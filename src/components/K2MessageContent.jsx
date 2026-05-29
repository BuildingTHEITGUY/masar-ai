import React from 'react';
import { parseK2Blocks, renderInlineMarkdown } from '../lib/sanitizeK2Output';
import './K2MessageContent.css';

function Inline({ text }) {
  const parts = renderInlineMarkdown(text);
  return (
    <>
      {parts.map((p, i) => {
        if (p.type === 'bold') {
          return (
            <strong key={i} className="k2-inline-bold">
              {p.value}
            </strong>
          );
        }
        if (p.type === 'link') {
          return (
            <a key={i} href={p.href} target="_blank" rel="noreferrer" className="k2-inline-link">
              {p.label}
            </a>
          );
        }
        return <span key={i}>{p.value}</span>;
      })}
    </>
  );
}

function MarkdownTable({ headers, rows }) {
  return (
    <div className="k2-table-wrap">
      <table className="k2-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>
                <Inline text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>
                  <Inline text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function K2MessageContent({ text, role }) {
  if (role === 'user') {
    return <p className="k2-user-text">{text}</p>;
  }

  const blocks = parseK2Blocks(text);

  return (
    <article className="k2-prose">
      {blocks.map((block) => {
        if (block.type === 'hr') {
          return <hr key={block.key} className="k2-hr" />;
        }

        if (block.type === 'heading') {
          const Tag = block.level === 1 ? 'h2' : block.level === 3 ? 'h4' : 'h3';
          return (
            <Tag key={block.key} className={`k2-heading k2-heading-${block.level}`}>
              <Inline text={block.text} />
            </Tag>
          );
        }

        if (block.type === 'table') {
          return <MarkdownTable key={block.key} headers={block.headers} rows={block.rows} />;
        }

        if (block.type === 'bullet') {
          return (
            <div key={block.key} className="k2-list-item">
              <span className="k2-bullet" aria-hidden>
                •
              </span>
              <span>
                <Inline text={block.text} />
              </span>
            </div>
          );
        }

        if (block.type === 'ordered') {
          return (
            <div key={block.key} className="k2-list-item k2-list-ordered">
              <span className="k2-ordered-num">{block.index}.</span>
              <span>
                <Inline text={block.text} />
              </span>
            </div>
          );
        }

        return (
          <p key={block.key} className="k2-paragraph">
            <Inline text={block.text} />
          </p>
        );
      })}
    </article>
  );
}
