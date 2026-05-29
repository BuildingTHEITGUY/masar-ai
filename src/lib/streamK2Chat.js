/**
 * Streams tokens from POST /api/chat (Vercel edge → K2 Think).
 * @param {Array<{role: string, content: string}>} messages
 * @param {(chunk: string) => void} onChunk
 * @param {AbortSignal} [signal]
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
        const text = json.choices?.[0]?.delta?.content ?? json.choices?.[0]?.message?.content;
        if (text) onChunk(text);
      } catch {
        /* skip malformed SSE lines */
      }
    }
  }
}
