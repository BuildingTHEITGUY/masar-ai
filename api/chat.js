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

function markdownToEmailHtml(md) {
    if (!md) return '<p>Your pathway summary will appear here.</p>';
    let html = md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/^### (.+)$/gm, '<h3 style="color:#38bdf8;margin:18px 0 8px;font-size:1rem;">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 style="color:#f8fafc;margin:20px 0 10px;font-size:1.15rem;">$1</h2>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#f8fafc;">$1</strong>')
        .replace(/^- (.+)$/gm, '<li style="margin:6px 0;color:#cbd5e1;">$1</li>')
        .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (block) => `<ul style="padding-left:20px;margin:10px 0;">${block}</ul>`)
        .replace(/\n\n/g, '</p><p style="margin:12px 0;color:#cbd5e1;line-height:1.65;">')
        .replace(/\n/g, '<br/>');
    return `<p style="margin:12px 0;color:#cbd5e1;line-height:1.65;">${html}</p>`;
}

function buildResendHtml(name, roadmapMarkdown) {
    const greeting = name ? `Dear ${name},` : 'Dear Student,';
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
<div style="background:#131a26;border:1px solid #334155;border-radius:8px;padding:18px;">${body}</div>
<p style="margin:24px 0 0;color:#64748b;font-size:0.78rem;">Built in the UAE 🇦🇪 · Verify all deadlines on official university sites.</p>
</td></tr>
</table>
</td></tr></table></body></html>`;
}

async function persistToSupabase(profile, roadmap) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return;

    await fetch(`${url.replace(/\/$/, '')}/rest/v1/students`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: key,
            Authorization: `Bearer ${key}`,
            Prefer: 'return=minimal',
        },
        body: JSON.stringify({
            name: profile.name || null,
            email: profile.email || null,
            nationality: profile.nationality || null,
            curriculum: profile.curriculum || null,
            overall_average: profile.overall_average ?? null,
            preferred_location: profile.preferred_location || null,
            selected_track: profile.selected_track || null,
            ai_roadmap: roadmap,
        }),
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
            html: buildResendHtml(profile.name, roadmap),
        }),
    });
}

function runPostStreamWorkers(profile, roadmap) {
    if (!profile.capture_roadmap || !roadmap?.trim()) return;
    void persistToSupabase(profile, roadmap).catch(() => {});
    void sendResendEmail(profile, roadmap).catch(() => {});
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
        flush() {
            if (sseCarry) extractContentFromSseChunk(sseCarry, accumulator);
            runPostStreamWorkers(profile, accumulator.value);
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
