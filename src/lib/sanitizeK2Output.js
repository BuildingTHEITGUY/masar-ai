const THINK_CLOSE = '<\/redacted_thinking>';
const THINK_OPEN = '<think>';
const LEGACY_THINK_CLOSE = '<\/think>';
const LEGACY_THINK_OPEN = '<' + 'think' + '>';
const THINKING_HINTS = ['The user asks:', 'We need to answer', 'We have a list of matches', 'Okay, the user', "Now let's answer"];

export function createK2StreamFilter() {
  let carry = '';
  let inThinking = false;
  let sawCloseTag = false;

  const closeTags = [THINK_CLOSE, LEGACY_THINK_CLOSE];

  return function filterChunk(chunk) {
    if (sawCloseTag) {
      return stripArtifacts(chunk);
    }

    carry += chunk;
    let visible = '';

    while (carry.length > 0) {
      if (!inThinking) {
        const openIdx = Math.min(
          ...[THINK_OPEN, LEGACY_THINK_OPEN].map((t) => {
            const i = carry.indexOf(t);
            return i === -1 ? Infinity : i;
          })
        );
        const closeIdx = Math.min(
          ...closeTags.map((t) => {
            const i = carry.indexOf(t);
            return i === -1 ? Infinity : i;
          })
        );

        if (openIdx < Infinity && (closeIdx === Infinity || openIdx < closeIdx)) {
          visible += carry.slice(0, openIdx);
          const tag = carry.slice(openIdx).startsWith(LEGACY_THINK_OPEN) ? LEGACY_THINK_OPEN : THINK_OPEN;
          carry = carry.slice(openIdx + tag.length);
          inThinking = true;
          continue;
        }

        if (closeIdx < Infinity) {
          const tag = carry.slice(closeIdx).startsWith(LEGACY_THINK_CLOSE) ? LEGACY_THINK_CLOSE : THINK_CLOSE;
          carry = carry.slice(closeIdx + tag.length).replace(/^\s+/, '');
          sawCloseTag = true;
          inThinking = false;
          continue;
        }

        if (
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

      const closeIdx = Math.min(
        ...closeTags.map((t) => {
          const i = carry.indexOf(t);
          return i === -1 ? Infinity : i;
        })
      );

      if (closeIdx === Infinity) {
        carry = '';
        break;
      }

      const tag = carry.slice(closeIdx).startsWith(LEGACY_THINK_CLOSE) ? LEGACY_THINK_CLOSE : THINK_CLOSE;
      carry = carry.slice(closeIdx + tag.length).replace(/^\s+/, '');
      inThinking = false;
      sawCloseTag = true;
    }

    return stripArtifacts(visible);
  };
}

function stripArtifacts(text) {
  return text
    .replaceAll(THINK_OPEN, '')
    .replaceAll(THINK_CLOSE, '')
    .replaceAll(LEGACY_THINK_OPEN, '')
    .replaceAll(LEGACY_THINK_CLOSE, '')
    .replace(/^Now let's answer\.?\s*/i, '')
    .replace(/<\/?think>/gi, '')
    .replace(/<\/?redacted_thinking>/gi, '');
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

  return stripArtifacts(cleaned)
    .replace(/<br\s*\/?>/gi, '\n')
    .trim();
}

function parseTableRow(line) {
  return line
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function isTableSeparator(line) {
  return /^\|[\s\-:|]+\|$/.test(line.trim());
}

/** Parse markdown into structured blocks for ChatGPT-style rendering */
export function parseK2Blocks(text) {
  const lines = sanitizeK2Final(text).split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (/^-{3,}$/.test(trimmed)) {
      blocks.push({ type: 'hr', key: `hr-${i}` });
      i++;
      continue;
    }

    const mdHeading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (mdHeading) {
      blocks.push({
        type: 'heading',
        level: mdHeading[1].length,
        text: mdHeading[2].replace(/\*\*/g, ''),
        key: `h-${i}`,
      });
      i++;
      continue;
    }

    const boldHeading = trimmed.match(/^\*\*([^*]+)\*\*:?\s*$/);
    if (boldHeading) {
      blocks.push({ type: 'heading', level: 2, text: boldHeading[1], key: `bh-${i}` });
      i++;
      continue;
    }

    if (trimmed.startsWith('|') && trimmed.includes('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const dataLines = tableLines.filter((l) => !isTableSeparator(l));
      if (dataLines.length >= 1) {
        const headers = parseTableRow(dataLines[0]);
        const rows = dataLines.slice(1).map(parseTableRow);
        blocks.push({ type: 'table', headers, rows, key: `tbl-${i}` });
      }
      continue;
    }

    const ordered = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (ordered) {
      blocks.push({ type: 'ordered', text: ordered[2], index: ordered[1], key: `ol-${i}` });
      i++;
      continue;
    }

    if (/^[-*•]\s/.test(trimmed)) {
      blocks.push({ type: 'bullet', text: trimmed.replace(/^[-*•]\s/, ''), key: `ul-${i}` });
      i++;
      continue;
    }

    blocks.push({ type: 'paragraph', text: trimmed, key: `p-${i}` });
    i++;
  }

  return blocks;
}

/** @deprecated use parseK2Blocks */
export function formatK2Message(text) {
  return parseK2Blocks(text).map((b) => ({ ...b, key: b.key ?? 0 }));
}

export function renderInlineMarkdown(text) {
  if (!text) return [];

  const normalized = text.replace(/<br\s*\/?>/gi, ' ').trim();
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s|<]+)/g;
  let last = 0;
  let match;

  while ((match = regex.exec(normalized)) !== null) {
    if (match.index > last) {
      parts.push({ type: 'text', value: normalized.slice(last, match.index) });
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

  if (last < normalized.length) {
    parts.push({ type: 'text', value: normalized.slice(last) });
  }

  return parts;
}
