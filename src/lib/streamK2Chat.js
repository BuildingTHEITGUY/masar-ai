import { createK2StreamFilter, sanitizeK2Final } from './sanitizeK2Output';

/**
 * Streams tokens from POST /api/chat (Vercel edge → K2 Think).
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
      detail = err.error || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail || `K2 request failed (${response.status})`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response stream from K2');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  const filter = createK2StreamFilter();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;

      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') continue;

      try {
        const json = JSON.parse(payload);
        const delta = json.choices?.[0]?.delta;
        // K2 Think may send reasoning in a separate field — never show it
        const text = delta?.content ?? json.choices?.[0]?.message?.content;
        if (text) {
          const visible = filter(text);
          if (visible) onChunk(visible);
        }
      } catch {
        /* skip malformed SSE lines */
      }
    }
  }
}

export { sanitizeK2Final };
