import React from 'react';
import {
  parseK2Blocks,
  renderInlineMarkdown,
  groupBlocksIntoSections,
  groupBulletsIntoUniCards,
} from '../lib/sanitizeK2Output';
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

const SECTION_META = {
  'best-fit': { icon: '★', label: 'Best fit' },
  conditional: { icon: '⚑', label: 'Flags' },
  steps: { icon: '→', label: 'Steps' },
  overview: { icon: '◆', label: 'Overview' },
  default: { icon: '•', label: 'Info' },
};

function ContactLine({ text }) {
  const isContact = /^contact:/i.test(text.trim());
  if (!isContact) {
    return (
      <li className="k2-uni-detail">
        <Inline text={text} />
      </li>
    );
  }

  const body = text.replace(/^contact:\s*/i, '');
  return (
    <li className="k2-uni-contact">
      <span className="k2-contact-label">Contact</span>
      <span className="k2-contact-value">
        <Inline text={body} />
      </span>
    </li>
  );
}

function UniCard({ name, program, details }) {
  return (
    <article className="k2-uni-card">
      <div className="k2-uni-card-head">
        <span className="k2-uni-icon" aria-hidden>
          🎓
        </span>
        <div>
          <h4 className="k2-uni-name">
            <Inline text={name} />
          </h4>
          {program && (
            <p className="k2-uni-program">
              <Inline text={program} />
            </p>
          )}
        </div>
      </div>
      {details.length > 0 && (
        <ul className="k2-uni-details">
          {details.map((d, i) => (
            <ContactLine key={i} text={d} />
          ))}
        </ul>
      )}
    </article>
  );
}

function MarkdownTable({ headers, rows, variant = 'default' }) {
  const contactCol = headers.findIndex((h) => /contact/i.test(h));

  return (
    <div className={`k2-table-wrap k2-table-wrap--${variant}`}>
      <table className="k2-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={i === 0 ? 'k2-col-uni' : undefined}>
                <Inline text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={[
                    ci === 0 ? 'k2-col-uni' : '',
                    ci === contactCol ? 'k2-col-contact' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {ci === contactCol && cell ? (
                    <span className="k2-table-contact">
                      <Inline text={cell} />
                    </span>
                  ) : (
                    <Inline text={cell} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BulletList({ items, variant = 'default' }) {
  return (
    <ul className={`k2-bullet-list k2-bullet-list--${variant}`}>
      {items.map((item, i) => (
        <li key={item.key ?? i} className="k2-bullet-list-item">
          <Inline text={item.text} />
        </li>
      ))}
    </ul>
  );
}

function OrderedList({ items }) {
  return (
    <ol className="k2-step-list">
      {items.map((item, i) => (
        <li key={item.key ?? i} className="k2-step-item">
          <span className="k2-step-num">{item.index ?? i + 1}</span>
          <span className="k2-step-text">
            <Inline text={item.text} />
          </span>
        </li>
      ))}
    </ol>
  );
}

function RenderBlock({ block, sectionKind }) {
  if (block.type === 'table') {
    return (
      <MarkdownTable
        headers={block.headers}
        rows={block.rows}
        variant={sectionKind === 'best-fit' ? 'compare' : 'default'}
      />
    );
  }

  if (block.type === 'paragraph') {
    return (
      <p className="k2-paragraph">
        <Inline text={block.text} />
      </p>
    );
  }

  if (block.type === 'ordered') {
    return <OrderedList items={[block]} />;
  }

  if (block.type === 'bullet') {
    return <BulletList items={[block]} variant={sectionKind} />;
  }

  return null;
}

function SectionBody({ items, kind }) {
  const tables = items.filter((b) => b.type === 'table');
  const ordered = items.filter((b) => b.type === 'ordered');
  const bullets = items.filter((b) => b.type === 'bullet');
  const paragraphs = items.filter((b) => b.type === 'paragraph');
  const other = items.filter(
    (b) => !['table', 'ordered', 'bullet', 'paragraph'].includes(b.type)
  );

  if (kind === 'best-fit') {
    const cards = groupBulletsIntoUniCards(bullets);
    const looseBullets = cards.filter((c) => c.type === 'bullet');
    const uniCards = cards.filter((c) => c.type === 'uni');
    const blockItems = cards.filter((c) => c.type === 'block').map((c) => c.block);

    return (
      <div className="k2-section-body">
        {paragraphs.map((p) => (
          <p key={p.key} className="k2-paragraph">
            <Inline text={p.text} />
          </p>
        ))}
        {tables.map((t) => (
          <MarkdownTable key={t.key} headers={t.headers} rows={t.rows} variant="compare" />
        ))}
        {uniCards.length > 0 && (
          <div className="k2-uni-grid">
            {uniCards.map((c, i) => (
              <UniCard key={i} name={c.name} program={c.program} details={c.details} />
            ))}
          </div>
        )}
        {looseBullets.length > 0 && (
          <BulletList
            items={looseBullets.map((c, i) => ({ key: `lb-${i}`, text: c.text }))}
            variant="best-fit"
          />
        )}
        {blockItems.map((b) => (
          <RenderBlock key={b.key} block={b} sectionKind={kind} />
        ))}
        {other.map((b) => (
          <RenderBlock key={b.key} block={b} sectionKind={kind} />
        ))}
      </div>
    );
  }

  if (kind === 'conditional') {
    return (
      <div className="k2-section-body">
        {paragraphs.map((p) => (
          <p key={p.key} className="k2-paragraph">
            <Inline text={p.text} />
          </p>
        ))}
        {tables.map((t) => (
          <MarkdownTable key={t.key} headers={t.headers} rows={t.rows} />
        ))}
        {bullets.length > 0 && <BulletList items={bullets} variant="conditional" />}
        {ordered.length > 0 && <OrderedList items={ordered} />}
        {other.map((b) => (
          <RenderBlock key={b.key} block={b} sectionKind={kind} />
        ))}
      </div>
    );
  }

  if (kind === 'steps') {
    return (
      <div className="k2-section-body">
        {paragraphs.map((p) => (
          <p key={p.key} className="k2-paragraph">
            <Inline text={p.text} />
          </p>
        ))}
        {ordered.length > 0 ? (
          <OrderedList items={ordered} />
        ) : (
          bullets.length > 0 && <OrderedList items={bullets.map((b, i) => ({ ...b, index: i + 1 }))} />
        )}
        {tables.map((t) => (
          <MarkdownTable key={t.key} headers={t.headers} rows={t.rows} />
        ))}
        {other.map((b) => (
          <RenderBlock key={b.key} block={b} sectionKind={kind} />
        ))}
      </div>
    );
  }

  return (
    <div className="k2-section-body">
      {items.map((b) => (
        <RenderBlock key={b.key} block={b} sectionKind={kind} />
      ))}
    </div>
  );
}

function SectionCard({ section }) {
  const meta = SECTION_META[section.kind] || SECTION_META.default;
  const title = section.heading?.text ?? meta.label;

  return (
    <section className={`k2-section-card k2-section-card--${section.kind}`}>
      <header className="k2-section-header">
        <span className="k2-section-icon" aria-hidden>
          {meta.icon}
        </span>
        <h3 className="k2-section-title">{title}</h3>
      </header>
      <SectionBody items={section.items} kind={section.kind} />
    </section>
  );
}

export default function K2MessageContent({ text, role }) {
  if (role === 'user') {
    return <p className="k2-user-text">{text}</p>;
  }

  const blocks = parseK2Blocks(text, { alreadySanitized: true });
  const { title, sections } = groupBlocksIntoSections(blocks);

  if (sections.length === 0) {
    return (
      <article className="k2-prose">
        {blocks.map((block) => (
          <RenderBlock key={block.key} block={block} sectionKind="default" />
        ))}
      </article>
    );
  }

  return (
    <article className="k2-prose k2-prose--structured">
      {title && (
        <header className="k2-answer-header">
          <h2 className="k2-answer-title">
            <Inline text={title.text} />
          </h2>
        </header>
      )}

      <div className="k2-sections">
        {sections.map((section, i) => (
          <SectionCard key={section.heading?.key ?? `sec-${i}`} section={section} />
        ))}
      </div>
    </article>
  );
}
