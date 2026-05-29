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
  'We need to check',
  'We need to include',
  'We need to present',
  'We need to compare',
  'We need to obey',
  'We need to craft',
  'We need to compile',
  'We must not',
  'We must ensure',
  'We must follow',
  'We must be careful',
  'We must only',
  'We must incorporate',
  'We must obey',
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
  "Let's parse",
  "Let's do",
  "Let's break",
  "Let's aim",
  "Ok, let's",
  'Word count',
  'But we need',
  'But instructions say',
  'But the instruction',
  'Make sure we',
  'Plan:',
  'Outline:',
  'Alright.',
  'Alright,',
  'Potential best fit',
  'Potential answer',
  'Potential pitfalls',
  'Better to have',
  'To be safe',
  'For streaming',
  'Verified program matches:',
  'Will produce final',
  'I will format',
  'Now craft the answer',
  'Now we need to',
  'Given that the student',
  'We should point out',
  'One more check',
  'Check that we',
  'Running total:',
  'Thus total',
  'That seems around',
  "That's around",
  'Structure:',
  'Will output:',
];

/** Lines echoed from our prompt that K2 repeats while planning */
const PROMPT_ECHO_MARKERS = [
  'Explain my matches in plain language',
  'They also specify',
  'Output formatting',
  'Use only verified contact links',
  'The answer must be final student-facing',
  'no internal reasoning',
  'Start with a ## heading',
  'Use short ## / ### section headings',
  'Use bullet lists for steps',
  'Use markdown tables only when comparing',
  'Keep paragraphs short',
  'Keep total length scannable',
  'no guessed phone numbers',
];

const REASONING_LINE =
  /^(We need to|We must|We have|We can|We should|We also|We may|The user|They want|They also|But we|But need|But the|Make sure|Now let|Now we|Ok,|Okay,|Let's |Let us|Plan:|Outline:|Word count|Alright|Potential |Better to |To be safe|For hackathon|If we |Probably |Might |Could |Would |Need to |Must not|Should we|Can we|Do not |Don't |Does the|Is the |Are we|Will we|Hmm|Wait\.|Actually,|However,|Therefore,|Thus,|So we |So let's|All right|Good luck|Given that|We should|We could|Check for|Check that|One more|Will produce|I will format|Will output|Structure:|Running total|That's around|That seems|For next steps:|For contact details:|For tuition|All have thresholds|Specifically:|Practical next steps:|Conditional flags:|Best fits:|Not verified|Official sites listed)/i;

const PROMPT_ECHO_LINE = new RegExp(
  `^(${PROMPT_ECHO_MARKERS.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
  'i'
);

/** Markdown heading at start of line */
const HEADING_LINE = /^#{1,3}\s+\S/;

/** Plain student-answer title without # prefix */
const PLAIN_ANSWER_TITLE = /^Your .+ (Matches|Path|Options|Universities|Programs)/i;

/** Section titles K2 sometimes emits without ### */
const PLAIN_SECTION_TITLE =
  /^(Best Fit Programs|Conditional Admission Flags|Practical Next Steps|Why Business .+|Why .+ (Aligns|Fits|Matches))/i;

/** Markers immediately before the final formatted answer */
const FINAL_ANSWER_MARKERS = [
  /Will produce final answer[^\n]*/gi,
  /Now (?:craft|produce|output|compile)(?: the)? final answer/gi,
  /I will format (?:as|the answer)[^\n]*/gi,
  /following the guidelines\s*/gi,
  /Now we need to produce final answer[^\n]*/gi,
];

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

/** Glue "guidelines## Title" → newline before heading (never split ## mid-token) */
function normalizeGluedHeadings(text) {
  return text
    .replace(/([^\n#])(#{1,3}\s+\S)/g, '$1\n$2')
    .replace(/following the guidelines\s*(#{1,3}\s+)/gi, 'following the guidelines\n$1');
}

export function containsReasoning(text) {
  if (!text) return false;
  if (REASONING_MARKERS.some((m) => text.includes(m))) return true;
  if (PROMPT_ECHO_MARKERS.some((m) => text.includes(m))) return true;

  const sampleLines = text.split('\n').slice(0, 40);
  return sampleLines.some((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    return REASONING_LINE.test(trimmed) || PROMPT_ECHO_LINE.test(trimmed);
  });
}

function isReasoningLine(trimmed) {
  if (!trimmed) return false;
  return (
    REASONING_LINE.test(trimmed) ||
    PROMPT_ECHO_LINE.test(trimmed) ||
    REASONING_MARKERS.some((m) => trimmed.includes(m)) ||
    PROMPT_ECHO_MARKERS.some((m) => trimmed.includes(m))
  );
}

function findAllHeadingStarts(text) {
  const lines = text.split('\n');
  let offset = 0;
  const results = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      const lineStart = line.search(/\S/);
      results.push({
        offset: offset + (lineStart >= 0 ? lineStart : 0),
        level: match[1].length,
        title: match[2].trim(),
      });
    }
    offset += line.length + 1;
  }

  return results;
}

function findPlainTitleStarts(text) {
  const lines = text.split('\n');
  let offset = 0;
  const results = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (PLAIN_ANSWER_TITLE.test(trimmed) && !HEADING_LINE.test(trimmed)) {
      const lineStart = line.search(/\S/);
      results.push(offset + (lineStart >= 0 ? lineStart : 0));
    }
    offset += line.length + 1;
  }

  return results;
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

  const plainStarts = findPlainTitleStarts(text);
  if (plainStarts.length > 0) {
    const idx = plainStarts[0];
    const before = text.slice(0, idx).trim();
    if (containsReasoning(before) || before.length > 80) return idx;
  }

  return -1;
}

/** When K2 emits multiple drafts, keep the last answer block only */
function findLastAnswerBlockStart(text) {
  const normalized = normalizeGluedHeadings(text);

  let searchFrom = 0;
  for (const re of FINAL_ANSWER_MARKERS) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(normalized)) !== null) {
      searchFrom = Math.max(searchFrom, match.index + match[0].length);
    }
  }

  const tail = searchFrom > 0 ? normalized.slice(searchFrom) : normalized;
  const tailHeadings = findAllHeadingStarts(tail);

  if (tailHeadings.length > 0) {
    const topLevel = tailHeadings.filter((h) => h.level <= 2);
    const pick = topLevel.length > 0 ? topLevel[topLevel.length - 1] : tailHeadings[tailHeadings.length - 1];
    return searchFrom + pick.offset;
  }

  const plainInTail = findPlainTitleStarts(tail);
  if (plainInTail.length > 0) {
    return searchFrom + plainInTail[plainInTail.length - 1];
  }

  const allHeadings = findAllHeadingStarts(normalized);
  if (allHeadings.length > 1) {
    const topLevel = allHeadings.filter((h) => h.level <= 2);
    const pick = topLevel.length > 0 ? topLevel[topLevel.length - 1] : allHeadings[allHeadings.length - 1];
    return pick.offset;
  }

  if (allHeadings.length === 1) {
    return allHeadings[0].offset;
  }

  const plainStarts = findPlainTitleStarts(normalized);
  if (plainStarts.length > 0) {
    return plainStarts[plainStarts.length - 1];
  }

  return findAnswerStartIndex(normalized);
}

function trimLeadingReasoningLines(text) {
  const lines = text.split('\n');
  let start = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (HEADING_LINE.test(trimmed) || PLAIN_ANSWER_TITLE.test(trimmed)) {
      start = i;
      break;
    }
    if (isReasoningLine(trimmed)) continue;
    if (containsReasoning(lines.slice(0, i).join('\n'))) continue;
    start = i;
    break;
  }

  return lines.slice(start).join('\n');
}

/** Remove duplicate draft sections — keep content from the last main title onward */
function dedupeRepeatedSections(text) {
  if (!text) return text;

  const headings = findAllHeadingStarts(text);
  if (headings.length >= 2) {
    const topLevel = headings.filter((h) => h.level <= 2);
    if (topLevel.length >= 2) {
      const last = topLevel[topLevel.length - 1];
      const firstTitle = topLevel[0].title.toLowerCase();
      const lastTitle = last.title.toLowerCase();
      if (firstTitle === lastTitle) {
        return text.slice(last.offset).trim();
      }
    }
  }

  const lines = text.split('\n');
  const sectionHits = [];
  let offset = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (PLAIN_SECTION_TITLE.test(trimmed) || /^#{1,3}\s+(Best Fit|Conditional|Practical Next)/i.test(trimmed)) {
      sectionHits.push({ offset, label: trimmed.replace(/^#{1,3}\s+/, '') });
    }
    offset += line.length + 1;
  }

  if (sectionHits.length >= 4) {
    const labels = sectionHits.map((h) => h.label.toLowerCase());
    const firstLabel = labels[0];
    const repeatIdx = labels.findIndex((l, i) => i > 0 && l === firstLabel);
    if (repeatIdx > 0) {
      return text.slice(sectionHits[repeatIdx].offset).trim();
    }
  }

  return text;
}

function stripTrailingReasoning(text) {
  const lines = text.split('\n');
  let end = lines.length;

  for (let i = lines.length - 1; i >= 0; i--) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (isReasoningLine(trimmed)) {
      end = i;
      continue;
    }
    break;
  }

  return lines.slice(0, end).join('\n').trim();
}

function ensureMarkdownHeadings(text) {
  const lines = text.split('\n');
  if (lines.length === 0) return text;

  const first = lines[0].trim();
  if (!HEADING_LINE.test(first) && PLAIN_ANSWER_TITLE.test(first)) {
    const indent = lines[0].match(/^\s*/)?.[0] ?? '';
    lines[0] = `${indent}## ${first}`;
  }

  for (let i = 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed || HEADING_LINE.test(trimmed)) continue;
    if (PLAIN_SECTION_TITLE.test(trimmed) && trimmed.length < 80) {
      const indent = lines[i].match(/^\s*/)?.[0] ?? '';
      lines[i] = `${indent}### ${trimmed}`;
    }
  }

  return lines.join('\n');
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
  cleaned = normalizeGluedHeadings(cleaned);

  if (containsReasoning(cleaned)) {
    const lastIdx = findLastAnswerBlockStart(cleaned);
    if (lastIdx >= 0) {
      cleaned = cleaned.slice(lastIdx).trim();
    } else {
      cleaned = trimLeadingReasoningLines(cleaned);
    }
  } else {
    const headingIdx = findAnswerStartIndex(cleaned);
    if (headingIdx > 0) {
      cleaned = cleaned.slice(headingIdx).trim();
    }
  }

  cleaned = dedupeRepeatedSections(cleaned);
  cleaned = stripTrailingReasoning(cleaned);
  cleaned = ensureMarkdownHeadings(cleaned);

  if (containsReasoning(cleaned)) {
    const retryIdx = findLastAnswerBlockStart(cleaned);
    if (retryIdx > 0) {
      cleaned = cleaned.slice(retryIdx).trim();
    } else {
      cleaned = trimLeadingReasoningLines(cleaned);
    }
    cleaned = dedupeRepeatedSections(cleaned);
    cleaned = ensureMarkdownHeadings(cleaned);
  }

  return cleaned.trim();
}

export function sanitizeK2Final(text) {
  return extractStudentAnswer(text);
}

/**
 * Stream filter: buffer raw tokens; caller should run sanitizeK2Final on full buffer.
 * Returns empty string while reasoning is still streaming (no partial leaks).
 */
export function createK2StreamFilter() {
  let rawBuffer = '';

  return function filterChunk(chunk) {
    rawBuffer += chunk;
    const sanitized = extractStudentAnswer(rawBuffer);
    if (!sanitized) return '';
    if (containsReasoning(sanitized) && !HEADING_LINE.test(sanitized.trim().split('\n')[0]?.trim() ?? '')) {
      return '';
    }
    return sanitized;
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

    if (PLAIN_SECTION_TITLE.test(trimmed) && trimmed.length < 80) {
      blocks.push({ type: 'heading', level: 3, text: trimmed, key: `sh-${i}` });
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

    if (isReasoningLine(trimmed)) {
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
