const THINK_CLOSE = '<\/redacted_thinking>';
const THINK_OPEN = '<think>';
const LEGACY_THINK_CLOSE = '<\/think>';
const LEGACY_THINK_OPEN = '<' + 'think' + '>';

/** Substrings that indicate K2 internal planning (plain text, no tags) */
const REASONING_MARKERS = [
  'We need to produce',
  'We need to answer',
  'We need to discuss',
  'We need to give',
  'We need to ensure',
  'We need to incorporate',
  'We need to be careful',
  'We need to output',
  'We need to use',
  'We need to keep',
  'We must not',
  'We must ensure',
  'We must follow',
  'We must be careful',
  'We must only',
  'We must incorporate',
  'We have a list of matches',
  'We have 10 institutions',
  'The user asks',
  'The user wants',
  'Okay, the user',
  "Now let's answer",
  "Now let's write",
  "Now let's produce",
  "Let's design",
  "Let's try",
  "Let's plan",
  "Let's count",
  "Ok, let's",
  'Word count',
  'But we need',
  'But instructions say',
  'Make sure we',
  'Plan:',
  'Outline:',
  'Alright.',
  'Alright,',
  'Potential best fit',
  'Better to have',
  'To be safe',
  'For streaming',
];

const REASONING_LINE = /^(We need to|We must|We have|We can|We should|We also|We may|The user|They want|But we|But need|Make sure|Now let|Ok,|Okay,|Let's |Let us|Plan:|Outline:|Word count|Alright|Potential |Better to |To be safe|For hackathon|If we |Probably |Might |Could |Would |Need to |Must not|Should we|Can we|Do not |Don't |Does the|Is the |Are we|Will we|Hmm|Wait\.|Actually,|However,|Therefore,|Thus,|So we |So let's|All right|Good luck – you)/i;

/** First markdown heading — primary answer boundary */
const HEADING_LINE = /^#{1,3}\s+\S/;

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

export function containsReasoning(text) {
  if (!text) return false;
  const sample = text.slice(0, 1200);
  return REASONING_MARKERS.some((m) => sample.includes(m)) || REASONING_LINE.test(sample.trim());
}

/** Index of first ## / ### heading suitable as answer start */
export function findAnswerStartIndex(text) {
  if (!text) return -1;

  const lines = text.split('\n');
  let offset = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (HEADING_LINE.test(trimmed)) {
      const before = text.slice(0, offset).trim();
      if (i === 0 || containsReasoning(before) || before.length > 80) {
        return offset + lines[i].search(/\S/);
      }
    }
    offset += lines[i].length + 1;
  }

  return -1;
}

function trimLeadingReasoningLines(text) {
  const lines = text.split('\n');
  let start = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (HEADING_LINE.test(trimmed)) {
      start = i;
      break;
    }
    if (REASONING_LINE.test(trimmed) || REASONING_MARKERS.some((m) => trimmed.includes(m))) {
      continue;
    }
    if (containsReasoning(lines.slice(0, i).join('\n'))) {
      continue;
    }
    start = i;
    break;
  }

  return lines.slice(start).join('\n');
}

/** Extract student-facing answer only */
export function extractStudentAnswer(text) {
  if (!text) return '';

  let cleaned = stripArtifacts(text);

  for (const closeTag of [THINK_CLOSE, LEGACY_THINK_CLOSE]) {
    if (cleaned.includes(closeTag)) {
      cleaned = cleaned.split(closeTag).pop() ?? '';
    }
  }

  for (const openTag of [THINK_OPEN, LEGACY_THINK_OPEN]) {
    if (cleaned.includes(openTag) && !cleaned.includes(THINK_CLOSE) && !cleaned.includes(LEGACY_THINK_CLOSE)) {
      cleaned = '';
    }
  }

  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n').trim();

  const headingIdx = findAnswerStartIndex(cleaned);
  if (headingIdx > 0) {
    cleaned = cleaned.slice(headingIdx).trim();
  } else if (containsReasoning(cleaned)) {
    cleaned = trimLeadingReasoningLines(cleaned);
  }

  if (containsReasoning(cleaned.split('\n')[0] ?? '')) {
    const retryIdx = findAnswerStartIndex(cleaned);
    if (retryIdx >= 0) cleaned = cleaned.slice(retryIdx).trim();
  }

  return cleaned.trim();
}

export function sanitizeK2Final(text) {
  return extractStudentAnswer(text);
}

/**
 * Stream filter: buffer until first ## heading or think-tag close, then pass through.
 */
export function createK2StreamFilter() {
  let buffer = '';
  let phase = 'waiting';

  return function filterChunk(chunk) {
    if (phase === 'answer') {
      return stripArtifacts(chunk);
    }

    buffer += chunk;

    for (const closeTag of [THINK_CLOSE, LEGACY_THINK_CLOSE]) {
      if (buffer.includes(closeTag)) {
        const after = buffer.split(closeTag).pop() ?? '';
        buffer = '';
        phase = 'answer';
        return extractStudentAnswer(after);
      }
    }

    if (buffer.includes(THINK_OPEN) || buffer.includes(LEGACY_THINK_OPEN)) {
      const openIdx = Math.min(
        ...[THINK_OPEN, LEGACY_THINK_OPEN]
          .map((t) => {
            const i = buffer.indexOf(t);
            return i === -1 ? Infinity : i;
          })
          .filter((i) => i < Infinity)
      );
      if (openIdx < Infinity && openIdx > 0) {
        buffer = buffer.slice(0, openIdx);
      }
      if (buffer.includes(THINK_OPEN) || buffer.includes(LEGACY_THINK_OPEN)) {
        return '';
      }
    }

    const answerIdx = findAnswerStartIndex(buffer);
    if (answerIdx >= 0) {
      const before = buffer.slice(0, answerIdx);
      if (answerIdx === 0 || containsReasoning(before) || before.trim().length > 60) {
        const out = buffer.slice(answerIdx);
        buffer = '';
        phase = 'answer';
        return stripArtifacts(out);
      }
    }

    if (containsReasoning(buffer) && buffer.length > 400 && answerIdx === -1) {
      return '';
    }

    if (!containsReasoning(buffer) && HEADING_LINE.test(buffer.trim())) {
      phase = 'answer';
      const out = buffer;
      buffer = '';
      return stripArtifacts(out);
    }

    return '';
  };
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
