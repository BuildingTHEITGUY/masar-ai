import { persistStudentRecord } from '../lib/supabaseStudent.js';
import { sanitizeK2Final } from '../src/lib/sanitizeK2Output.js';

export const config = {
    runtime: 'edge',
};

function parseK2ApiKey(raw) {
    let key = (raw || '').trim();
    if (key.toLowerCase().startsWith('bearer ')) key = key.slice(7).trim();
    if (key.startsWith('{') && key.endsWith('}')) key = key.slice(1, -1).trim();
    if (
        (key.startsWith('"') && key.endsWith('"')) ||
        (key.startsWith("'") && key.endsWith("'"))
    ) {
        key = key.slice(1, -1).trim();
    }
    return key;
}

function buildPersonalizationRule({ name, nationality, curriculum, overall_average, preferred_location, selected_track }) {
    const studentName = name || 'Student';
    const avg = overall_average ?? '—';
    const curr = curriculum || 'UAE curriculum';
    const loc = preferred_location || 'the UAE';
    const track = selected_track || 'their chosen field';
    const nat = nationality ? ` (${nationality})` : '';

    return (
        `You are Masar AI, an elite academic advisor. You are counseling a student named ${studentName}${nat} ` +
        `who holds a ${avg}% average in the ${curr} system and prefers studying in ${loc}, ` +
        `with a focus on ${track}. Address them politely by their first name throughout your evaluation layout.`
    );
}

function injectPersonalization(messages, profile) {
    const rule = buildPersonalizationRule(profile);
    const out = messages.map((m) => ({ ...m }));
    const sysIdx = out.findIndex((m) => m.role === 'system');
    if (sysIdx >= 0) {
        out[sysIdx] = {
            ...out[sysIdx],
            content: `${rule}\n\n${out[sysIdx].content}`,
        };
    } else {
        out.unshift({ role: 'system', content: rule });
    }
    return out;
}

function extractContentFromSseChunk(chunkText, accumulator) {
    const lines = chunkText.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === '[DONE]') continue;
        try {
            const json = JSON.parse(payload);
            const delta = json.choices?.[0]?.delta;
            const text = delta?.content ?? json.choices?.[0]?.message?.content;
            if (text) accumulator.value += text;
        } catch {
            /* skip malformed SSE */
        }
    }
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function inlineMarkdown(text) {
    return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#f8fafc;">$1</strong>');
}

function isTableSeparator(line) {
    return /^\|[\s\-:|]+\|$/.test(line.trim());
}

function parseTableRow(line) {
    return line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());
}

function renderMarkdownTable(tableLines) {
    const dataLines = tableLines.filter((line) => !isTableSeparator(line));
    if (dataLines.length === 0) return '';

    const headers = parseTableRow(dataLines[0]);
    const rows = dataLines.slice(1).map(parseTableRow);
    let html =
        '<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:14px 0;font-size:0.82rem;">';
    html += '<thead><tr>';
    for (const header of headers) {
        html += `<th style="text-align:left;padding:10px 8px;border-bottom:2px solid #334155;color:#38bdf8;font-weight:600;">${inlineMarkdown(header)}</th>`;
    }
    html += '</tr></thead><tbody>';
    for (const row of rows) {
        html += '<tr>';
        for (const cell of row) {
            html += `<td style="padding:10px 8px;border-bottom:1px solid #1e293b;color:#cbd5e1;vertical-align:top;line-height:1.5;">${inlineMarkdown(cell)}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
}

function markdownToEmailHtml(md) {
    if (!md) return '<p style="color:#cbd5e1;">Your pathway summary will appear here.</p>';

    const lines = md.split('\n');
    const parts = [];
    let i = 0;

    while (i < lines.length) {
        const trimmed = lines[i].trim();
        if (!trimmed) {
            i++;
            continue;
        }

        if (trimmed.startsWith('|') && trimmed.includes('|')) {
            const tableLines = [];
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                tableLines.push(lines[i].trim());
                i++;
            }
            parts.push(renderMarkdownTable(tableLines));
            continue;
        }

        const h3 = trimmed.match(/^### (.+)$/);
        if (h3) {
            parts.push(
                `<h3 style="color:#38bdf8;margin:18px 0 8px;font-size:1rem;">${inlineMarkdown(h3[1])}</h3>`
            );
            i++;
            continue;
        }

        const h2 = trimmed.match(/^## (.+)$/);
        if (h2) {
            parts.push(
                `<h2 style="color:#f8fafc;margin:20px 0 10px;font-size:1.15rem;">${inlineMarkdown(h2[1])}</h2>`
            );
            i++;
            continue;
        }

        if (/^(Best Fit|Conditional Flags|Practical Next Steps)$/i.test(trimmed)) {
            parts.push(
                `<h3 style="color:#38bdf8;margin:18px 0 8px;font-size:1rem;">${inlineMarkdown(trimmed)}</h3>`
            );
            i++;
            continue;
        }

        if (parts.length === 0 && /^Your .+/i.test(trimmed) && trimmed.length < 120) {
            parts.push(
                `<h2 style="color:#f8fafc;margin:20px 0 10px;font-size:1.15rem;">${inlineMarkdown(trimmed)}</h2>`
            );
            i++;
            continue;
        }

        if (/^\d+\.\s/.test(trimmed)) {
            const items = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
                i++;
            }
            parts.push(
                `<ol style="padding-left:20px;margin:10px 0;">${items
                    .map(
                        (item) =>
                            `<li style="margin:6px 0;color:#cbd5e1;line-height:1.55;">${inlineMarkdown(item)}</li>`
                    )
                    .join('')}</ol>`
            );
            continue;
        }

        if (/^[-*•]\s/.test(trimmed)) {
            const items = [];
            while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^[-*•]\s/, ''));
                i++;
            }
            parts.push(
                `<ul style="padding-left:20px;margin:10px 0;">${items
                    .map(
                        (item) =>
                            `<li style="margin:6px 0;color:#cbd5e1;line-height:1.55;">${inlineMarkdown(item)}</li>`
                    )
                    .join('')}</ul>`
            );
            continue;
        }

        parts.push(
            `<p style="margin:12px 0;color:#cbd5e1;line-height:1.65;">${inlineMarkdown(trimmed)}</p>`
        );
        i++;
    }

    return parts.join('\n');
}

function buildProfileSummaryHtml(profile) {
    const rows = [
        ['Name', profile.name],
        ['Nationality', profile.nationality],
        ['Curriculum', profile.curriculum],
        [
            'Overall average',
            profile.overall_average != null && profile.overall_average !== ''
                ? `${profile.overall_average}%`
                : null,
        ],
        ['Preferred location', profile.preferred_location],
        ['Track', profile.selected_track],
    ].filter(([, value]) => value);

    if (rows.length === 0) return '';

    const tableRows = rows
        .map(
            ([label, value]) =>
                `<tr><td style="padding:4px 12px 4px 0;color:#64748b;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>` +
                `<td style="padding:4px 0;color:#e2e8f0;">${escapeHtml(String(value))}</td></tr>`
        )
        .join('');

    return (
        `<div style="margin-bottom:20px;padding:14px 16px;background:#0f172a;border:1px solid #334155;border-radius:8px;">` +
        `<p style="margin:0 0 10px;color:#94a3b8;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">Your profile</p>` +
        `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:0.88rem;">${tableRows}</table>` +
        `</div>`
    );
}

function buildResendHtml(profile, roadmapMarkdown) {
    const greeting = profile.name ? `Dear ${profile.name},` : 'Dear Student,';
    const summary = buildProfileSummaryHtml(profile);
    const body = markdownToEmailHtml(roadmapMarkdown);
    return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0b0f19;font-family:Segoe UI,system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f19;padding:32px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:600px;background:#0f172a;border:1px solid #1e293b;border-radius:12px;overflow:hidden;">
<tr><td style="padding:28px 24px;border-bottom:1px solid #1e293b;">
<h1 style="margin:0;color:#fff;font-size:1.35rem;">Masar AI <span style="color:#ff6b3d;">مسار</span></h1>
<p style="margin:8px 0 0;color:#94a3b8;font-size:0.85rem;">Your Strategic Academic Pathway Matrix</p>
</td></tr>
<tr><td style="padding:24px;">
<p style="margin:0 0 16px;color:#e2e8f0;font-size:1rem;">${greeting}</p>
<p style="margin:0 0 20px;color:#94a3b8;font-size:0.9rem;line-height:1.55;">Below is your personalized UAE university pathway evaluation from K2 Think V2.</p>
${summary}
<div style="background:#131a26;border:1px solid #334155;border-radius:8px;padding:18px;">${body}</div>
<p style="margin:24px 0 0;color:#64748b;font-size:0.78rem;">Built in the UAE 🇦🇪 · Verify all deadlines on official university sites.</p>
</td></tr>
</table>
</td></tr></table></body></html>`;
}

async function persistToSupabase(profile, roadmap) {
    return persistStudentRecord({
        name: profile.name,
        email: profile.email,
        nationality: profile.nationality,
        curriculum: profile.curriculum,
        overall_average: profile.overall_average,
        preferred_location: profile.preferred_location,
        selected_track: profile.selected_track,
        ai_roadmap: roadmap,
    });
}

async function sendResendEmail(profile, roadmap) {
    const resendKey = process.env.RESEND_API_KEY;
    const to = profile.email?.trim();
    if (!resendKey || !to) return;

    await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'Masar AI Advisor <advisor@read.buildingtheitguy.com>',
            to: [to],
            subject: '🇦🇪 Your Strategic Academic Pathway Matrix - Masar AI',
            html: buildResendHtml(profile, roadmap),
        }),
    });
}

async function runPostStreamWorkers(profile, roadmap) {
    if (!profile.capture_roadmap) return;
    if (!roadmap?.trim()) {
        console.warn('[Masar] K2 stream ended with empty roadmap text — skipping Supabase/Resend');
        return;
    }
    await persistToSupabase(profile, roadmap).catch((e) =>
        console.error('[Masar] Supabase post-stream error:', e?.message)
    );
    await sendResendEmail(profile, roadmap).catch((e) =>
        console.error('[Masar] Resend post-stream error:', e?.message)
    );
}

function createCapturingStream(sourceBody, profile) {
    const accumulator = { value: '' };
    let sseCarry = '';

    const transformer = new TransformStream({
        transform(chunk, controller) {
            controller.enqueue(chunk);
            const piece = new TextDecoder().decode(chunk, { stream: true });
            sseCarry += piece;
            const parts = sseCarry.split('\n');
            sseCarry = parts.pop() || '';
            extractContentFromSseChunk(parts.join('\n') + '\n', accumulator);
        },
        async flush() {
            if (sseCarry) extractContentFromSseChunk(sseCarry, accumulator);
            const cleaned = sanitizeK2Final(accumulator.value);
            if (!cleaned?.trim() && accumulator.value?.trim()) {
                console.warn(
                    '[Masar] Sanitizer emptied K2 output — raw length:',
                    accumulator.value.length
                );
            }
            await runPostStreamWorkers(profile, cleaned);
        },
    });

    return sourceBody.pipeThrough(transformer);
}

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const incomingData = await req.json();
        const serverApiKey = parseK2ApiKey(process.env.K2_API_KEY);

        if (!serverApiKey) {
            return new Response(JSON.stringify({ error: 'Server API Key configuration missing or empty.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const messages = Array.isArray(incomingData?.messages) ? incomingData.messages : [];
        if (messages.length === 0) {
            return new Response(JSON.stringify({ error: 'Request must include a non-empty messages array.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const profile = {
            name: incomingData.name ?? '',
            email: incomingData.email ?? '',
            nationality: incomingData.nationality ?? '',
            curriculum: incomingData.curriculum ?? '',
            overall_average: incomingData.overall_average ?? null,
            preferred_location: incomingData.preferred_location ?? '',
            selected_track: incomingData.selected_track ?? '',
            capture_roadmap: Boolean(incomingData.capture_roadmap),
        };

        const personalizedMessages = injectPersonalization(messages, profile);

        const response = await fetch('https://api.k2think.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${serverApiKey}`,
            },
            body: JSON.stringify({
                model: 'MBZUAI-IFM/K2-Think-v2',
                messages: personalizedMessages,
                stream: true,
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            let detail = errText || response.statusText;
            try {
                const parsed = JSON.parse(errText);
                detail = parsed?.error?.message || parsed?.detail || detail;
            } catch {
                /* keep raw */
            }
            return new Response(JSON.stringify({ error: detail }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const stream = profile.capture_roadmap
            ? createCapturingStream(response.body, profile)
            : response.body;

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
