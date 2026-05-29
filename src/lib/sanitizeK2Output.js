const THINK_CLOSE = '<\/redacted_thinking>';
const THINK_OPEN = '<think>';
const LEGACY_THINK_CLOSE = '<\/think>';
const LEGACY_THINK_OPEN = '<' + 'think' + '>';
const THINKING_HINTS = ['The user asks:', 'We need to answer', 'We have a list of matches', 'Okay, the user'];

/**
 * Filters K2-Think-v2 stream: hides chain-of-thought until </think>.
 */
export function createK2StreamFilter() {
  let carry = '';
  let inThinking = false;
  let sawCloseTag = false;

  return function filterChunk(chunk) {
    if (sawCloseTag) {
      return chunk.replaceAll(THINK_OPEN, '').replaceAll(THINK_CLOSE, '');
    }

    carry += chunk;
    let visible = '';

    while (carry.length > 0) {
      if (!inThinking) {
        const openIdx = carry.indexOf(THINK_OPEN);
        const closeIdx = carry.indexOf(THINK_CLOSE);

        if (openIdx >= 0 && (closeIdx === -1 || openIdx < closeIdx)) {
          visible += carry.slice(0, openIdx);
          carry = carry.slice(openIdx + THINK_OPEN.length);
          inThinking = true;
          continue;
        }

        if (closeIdx >= 0 && !carry.slice(0, closeIdx).includes(THINK_OPEN)) {
          carry = carry.slice(closeIdx + THINK_CLOSE.length).replace(/^\s+/, '');
          sawCloseTag = true;
          inThinking = false;
          continue;
        }

        if (
          closeIdx === -1 &&
          THINKING_HINTS.some((h) => carry.includes(h)) &&
          !carry.trimStart().startsWith('**') &&
          !carry.trimStart().startsWith('#')
        ) {
          inThinking = true;
          carry = '';
          break;
        }

        visible += carry;
        carry = '';
        break;
      }

      const closeIdx = carry.indexOf(THINK_CLOSE);
      if (closeIdx === -1) {
        carry = '';
        break;
      }

      carry = carry.slice(closeIdx + THINK_CLOSE.length).replace(/^\s+/, '');
      inThinking = false;
      sawCloseTag = true;
    }

    return visible.replaceAll(THINK_OPEN, '').replaceAll(THINK_CLOSE, '');
  };
}

export function sanitizeK2Final(text) {
  if (!text) return '';

  let cleaned = text;

  for (const closeTag of [THINK_CLOSE, LEGACY_THINK_CLOSE]) {
    if (cleaned.includes(closeTag)) {
      cleaned = cleaned.split(closeTag).pop() ?? '';
      break;
    }
  }

  for (const openTag of [THINK_OPEN, LEGACY_THINK_OPEN]) {
    if (cleaned.includes(openTag)) {
      cleaned = cleaned.split(openTag).pop() ?? cleaned;
    }
  }

  if (THINKING_HINTS.some((h) => cleaned.includes(h)) && cleaned.includes('**')) {
    const answerStart = cleaned.search(/\*\*[^*]+\*\*/);
    if (answerStart > 200) cleaned = cleaned.slice(answerStart);
  }

  return cleaned
    .replaceAll(THINK_OPEN, '')
    .replaceAll(THINK_CLOSE, '')
    .replaceAll(LEGACY_THINK_OPEN, '')
    .replaceAll(LEGACY_THINK_CLOSE, '')
    .trim();
}

/** Lightweight markdown for chat bubbles (bold, links, lists) */
export function formatK2Message(text) {
  const lines = sanitizeK2Final(text).split('\n');
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return { key: i, type: 'break' };

    const heading = trimmed.match(/^#{1,3}\s+(.+)$/);
    if (heading) {
      return { key: i, type: 'heading', text: heading[1] };
    }

    if (trimmed.startsWith('|') && trimmed.includes('|')) {
      return { key: i, type: 'table-row', text: trimmed };
    }

    if (/^[-*•]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      return { key: i, type: 'list', text: trimmed.replace(/^[-*•]\s|^\d+\.\s/, '') };
    }

    return { key: i, type: 'paragraph', text: trimmed };
  });
}

export function renderInlineMarkdown(text) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+)/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: 'text', value: text.slice(last, match.index) });
    }
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push({ type: 'bold', value: token.slice(2, -2) });
    } else if (token.startsWith('[')) {
      const m = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (m) parts.push({ type: 'link', label: m[1], href: m[2] });
    } else {
      parts.push({ type: 'link', label: token, href: token });
    }
    last = match.index + token.length;
  }

  if (last < text.length) {
    parts.push({ type: 'text', value: text.slice(last) });
  }

  return parts;
}
