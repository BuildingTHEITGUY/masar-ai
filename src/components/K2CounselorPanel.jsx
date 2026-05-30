import React, { useRef, useState, useEffect, useMemo } from 'react';
import universities from '../data/universities.json';
import { buildSystemPrompt, buildInitialUserMessage, buildFollowUpSystemPrompt } from '../lib/buildK2Context';
import { streamK2Chat } from '../lib/streamK2Chat';
import { k2ContentIsRenderable } from '../lib/sanitizeK2Output';
import K2MessageContent from './K2MessageContent';

function VerifiedContacts({ matchingResults }) {
  const contacts = useMemo(() => {
    const seen = new Set();
    return matchingResults
      .map((m) => universities.find((u) => u.id === m.universityId))
      .filter(Boolean)
      .filter((u) => {
        if (seen.has(u.id)) return false;
        seen.add(u.id);
        return u.admissionsPhone || u.admissionsEmail || u.applyUrl;
      });
  }, [matchingResults]);

  if (contacts.length === 0) return null;

  return (
    <div
      style={{
        marginBottom: '12px',
        padding: '12px 14px',
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid #10b981',
        borderRadius: '8px',
      }}
    >
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', marginBottom: '8px', letterSpacing: '0.06em' }}>
        VERIFIED CONTACTS (from Masar database — not AI-generated)
      </div>
      {contacts.map((u) => (
        <div key={u.id} style={{ marginBottom: contacts.length > 1 ? '10px' : 0, fontSize: '0.82rem', lineHeight: 1.6 }}>
          <strong style={{ color: '#f1f5f9' }}>{u.name}</strong>
          <div style={{ color: '#cbd5e1' }}>
            {u.applyUrl && (
              <div>
                Apply:{' '}
                <a href={u.applyUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>
                  {u.applyUrl}
                </a>
              </div>
            )}
            {u.admissionsPhone && <div>Phone: {u.admissionsPhone}</div>}
            {u.admissionsEmail && <div>Email: {u.admissionsEmail}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function K2CounselorPanel({ studentProfile, matchingResults, resolvedTrack }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [followUp, setFollowUp] = useState('');
  const abortRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, isOpen]);

  const runK2 = async (apiMessages) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsStreaming(true);
    setStreamingText('');
    setError(null);

    try {
      const finalText = await streamK2Chat(
        apiMessages,
        (sanitized) => {
          setStreamingText(sanitized);
        },
        controller.signal
      );
      const trimmed = finalText.trim();
      if (!trimmed || !k2ContentIsRenderable(trimmed, true)) {
        setError(
          'K2 returned an empty or unreadable answer. Try a specific question like "Tell me about MBZUAI BSc AI" or use the verified contacts above.'
        );
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: trimmed }]);
      }
      setStreamingText('');
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Could not reach K2. Deploy on Vercel with K2_API_KEY, or run `vercel dev` locally.');
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const startExplanation = async () => {
    setIsOpen(true);
    const system = buildSystemPrompt(studentProfile, matchingResults, resolvedTrack);
    const initialUser = buildInitialUserMessage();
    const apiMessages = [
      { role: 'system', content: system },
      { role: 'user', content: initialUser },
    ];
    setMessages([{ role: 'user', content: initialUser }]);
    await runK2(apiMessages);
  };

  const sendFollowUp = async (e) => {
    e.preventDefault();
    const text = followUp.trim();
    if (!text || isStreaming) return;

    setFollowUp('');
    const system = buildFollowUpSystemPrompt(studentProfile, matchingResults, resolvedTrack, text);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);

    const apiMessages = [
      { role: 'system', content: system },
      { role: 'user', content: text },
    ];
    await runK2(apiMessages);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={startExplanation}
        style={{
          width: '100%',
          marginTop: '8px',
          padding: '14px 20px',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          border: '1px solid #38bdf8',
          borderRadius: '10px',
          color: '#e0f2fe',
          fontWeight: '700',
          fontSize: '0.95rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>✦</span>
        Explain my matches with K2 Think
      </button>
    );
  }

  return (
    <div
      style={{
        marginTop: '8px',
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(90deg, rgba(56,189,248,0.15) 0%, transparent 100%)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#38bdf8', letterSpacing: '0.08em' }}>
            K2 THINK V2 COUNSELOR
          </span>
          <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
            Verified contacts shown below. AI explains your matches — it will not invent phone numbers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            abortRef.current?.abort();
            setIsOpen(false);
            setMessages([]);
            setStreamingText('');
            setError(null);
          }}
          style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}
          aria-label="Close counselor"
        >
          ×
        </button>
      </div>

      <div
        style={{
          maxHeight: '520px',
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: '#0b0f19',
        }}
      >
        <VerifiedContacts matchingResults={matchingResults} />

        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '96%',
              padding: '14px 16px',
              borderRadius: '12px',
              background: msg.role === 'user' ? 'rgba(255, 107, 61, 0.12)' : '#1e293b',
              border: `1px solid ${msg.role === 'user' ? 'rgba(255,107,61,0.35)' : '#475569'}`,
              fontSize: '0.92rem',
              lineHeight: 1.65,
            }}
          >
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                display: 'block',
                marginBottom: '8px',
                color: msg.role === 'user' ? '#ff6b3d' : '#38bdf8',
                letterSpacing: '0.06em',
              }}
            >
              {msg.role === 'user' ? 'YOU' : 'K2 COUNSELOR'}
            </span>
            <K2MessageContent text={msg.content} role={msg.role} />
          </div>
        ))}

        {isStreaming && streamingText && (
          <div
            style={{
              alignSelf: 'flex-start',
              maxWidth: '96%',
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#1e293b',
              border: '1px solid #38bdf8',
              fontSize: '0.92rem',
              lineHeight: 1.65,
            }}
          >
            <span style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: '700', display: 'block', marginBottom: '8px' }}>
              K2 COUNSELOR
            </span>
            <K2MessageContent text={streamingText} role="assistant" />
            <span style={{ opacity: 0.5 }}>▌</span>
          </div>
        )}

        {isStreaming && !streamingText && (
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>
            Preparing your answer (reasoning hidden)…
          </p>
        )}

        {error && (
          <p
            style={{
              margin: 0,
              padding: '10px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#fca5a5',
            }}
          >
            {error}
          </p>
        )}
        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={sendFollowUp}
        style={{ padding: '12px 16px', borderTop: '1px solid #1e293b', display: 'flex', gap: '8px' }}
      >
        <input
          type="text"
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
          placeholder="e.g. How do I apply? (use verified contacts above for phone/email)"
          disabled={isStreaming}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: '8px',
            border: '1px solid #334155',
            background: '#0b0f19',
            color: '#f8fafc',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isStreaming || !followUp.trim()}
          style={{
            padding: '12px 18px',
            background: isStreaming ? '#334155' : '#38bdf8',
            color: '#0f172a',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '700',
            cursor: isStreaming ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
