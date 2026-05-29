import React, { useRef, useState, useEffect } from 'react';
import { buildSystemPrompt, buildInitialUserMessage } from '../lib/buildK2Context';
import { streamK2Chat } from '../lib/streamK2Chat';

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

    let accumulated = '';
    try {
      await streamK2Chat(
        apiMessages,
        (chunk) => {
          accumulated += chunk;
          setStreamingText(accumulated);
        },
        controller.signal
      );
      setMessages((prev) => [...prev, { role: 'assistant', content: accumulated }]);
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
    const system = buildSystemPrompt(studentProfile, matchingResults, resolvedTrack);
    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);

    const apiMessages = [
      { role: 'system', content: system },
      ...nextMessages.map((m) => ({ role: m.role, content: m.content })),
    ];
    await runK2(apiMessages);
  };

  const panelStyle = {
    marginTop: '8px',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '12px',
    overflow: 'hidden',
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
    <div style={panelStyle}>
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
            Ask follow-ups about your matches — answers stay tied to your results.
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
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '1.2rem',
            lineHeight: 1,
          }}
          aria-label="Close counselor"
        >
          ×
        </button>
      </div>

      <div
        style={{
          maxHeight: '320px',
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '92%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: msg.role === 'user' ? 'rgba(255, 107, 61, 0.15)' : '#1e293b',
              border: `1px solid ${msg.role === 'user' ? 'rgba(255,107,61,0.3)' : '#334155'}`,
              fontSize: '0.88rem',
              lineHeight: 1.55,
              color: '#e2e8f0',
              whiteSpace: 'pre-wrap',
            }}
          >
            {msg.role === 'user' && (
              <span style={{ fontSize: '0.65rem', color: '#ff6b3d', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                YOU
              </span>
            )}
            {msg.content}
          </div>
        ))}

        {isStreaming && streamingText && (
          <div
            style={{
              alignSelf: 'flex-start',
              maxWidth: '92%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: '#1e293b',
              border: '1px solid #38bdf8',
              fontSize: '0.88rem',
              lineHeight: 1.55,
              color: '#e2e8f0',
              whiteSpace: 'pre-wrap',
            }}
          >
            <span style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              K2 THINK
            </span>
            {streamingText}
            <span style={{ opacity: 0.5 }}>▌</span>
          </div>
        )}

        {isStreaming && !streamingText && (
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>
            Reasoning over your pathway matrix…
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
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          type="text"
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
          placeholder="e.g. Which option is best if I want to work in Dubai courts?"
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
