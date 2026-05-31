import { sanitizeK2Final } from './sanitizeK2Output';

/**
 * Streams tokens from POST /api/chat (Vercel → K2 Think).
 * Chain-of-thought is stripped before reaching the UI.
 */
export async function streamK2Chat(messages, onChunk, signal) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const err = await response.json();
      let raw = err.error ?? err.detail ?? detail;
      if (typeof raw === 'string') {
        try {
          const nested = JSON.parse(raw);
          raw = nested?.error?.message || nested?.detail || raw;
        } catch {
          /* plain string */
        }
      } else if (raw && typeof raw === 'object' && raw.message) {
        raw = raw.message;
      }
      detail = raw || detail;
    } catch {
      /* ignore */
    }
    if (response.status === 504) {
      throw new Error(
        'K2 took too long to respond (gateway timeout). Please try again — follow-up questions are faster than the first explanation.'
      );
    }
    throw new Error(detail || `K2 request failed (${response.status})`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response stream from K2');
  }

  const decoder = new TextDecoder();
  let sseBuffer = '';
  let rawAccumulated = '';
  let reasoningChars = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    sseBuffer += decoder.decode(value, { stream: true });
    const lines = sseBuffer.split('\n');
    sseBuffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;

      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') continue;

      try {
        const json = JSON.parse(payload);
        const delta = json.choices?.[0]?.delta;

        if (delta?.reasoning_content) {
          reasoningChars += delta.reasoning_content.length;
          if (import.meta.env?.DEV) {
            console.debug('[K2] reasoning chunk chars:', delta.reasoning_content.length, 'total:', reasoningChars);
          }
        }

        const text = delta?.content ?? json.choices?.[0]?.message?.content;
        if (text) {
          rawAccumulated += text;
          const visible = sanitizeK2Final(rawAccumulated);
          if (visible) onChunk(visible);
        }
      } catch {
        /* skip malformed SSE lines */
      }
    }
  }

  if (import.meta.env?.DEV && reasoningChars > 0) {
    console.debug('[K2] stream complete — content chars:', rawAccumulated.length, 'reasoning chars:', reasoningChars);
  }

  return sanitizeK2Final(rawAccumulated);
}

export { sanitizeK2Final };
