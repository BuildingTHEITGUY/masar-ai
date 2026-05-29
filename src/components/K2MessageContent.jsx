import React from 'react';
import { formatK2Message, renderInlineMarkdown } from '../lib/sanitizeK2Output';

function Inline({ text }) {
  const parts = renderInlineMarkdown(text);
  return (
    <>
      {parts.map((p, i) => {
        if (p.type === 'bold') {
          return (
            <strong key={i} style={{ color: '#f8fafc', fontWeight: 700 }}>
              {p.value}
            </strong>
          );
        }
        if (p.type === 'link') {
          return (
            <a
              key={i}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#38bdf8', textDecoration: 'underline', wordBreak: 'break-all' }}
            >
              {p.label}
            </a>
          );
        }
        return <span key={i}>{p.value}</span>;
      })}
    </>
  );
}

export default function K2MessageContent({ text, role }) {
  if (role === 'user') {
    return <span>{text}</span>;
  }

  const blocks = formatK2Message(text);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {blocks.map((block) => {
        if (block.type === 'break') return <div key={block.key} style={{ height: '4px' }} />;

        if (block.type === 'heading') {
          return (
            <div
              key={block.key}
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#f8fafc',
                marginTop: '4px',
                borderBottom: '1px solid #334155',
                paddingBottom: '4px',
              }}
            >
              <Inline text={block.text} />
            </div>
          );
        }

        if (block.type === 'list') {
          return (
            <div key={block.key} style={{ display: 'flex', gap: '8px', paddingLeft: '4px' }}>
              <span style={{ color: '#38bdf8', flexShrink: 0 }}>•</span>
              <span style={{ color: '#e2e8f0' }}>
                <Inline text={block.text} />
              </span>
            </div>
          );
        }

        if (block.type === 'table-row') {
          return (
            <code
              key={block.key}
              style={{
                fontSize: '0.75rem',
                color: '#cbd5e1',
                background: '#0b0f19',
                padding: '2px 6px',
                borderRadius: '4px',
                overflowX: 'auto',
                display: 'block',
              }}
            >
              {block.text}
            </code>
          );
        }

        return (
          <p key={block.key} style={{ margin: 0, color: '#e2e8f0' }}>
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
