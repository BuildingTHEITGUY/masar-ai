export const config = {
    runtime: 'edge',
};

/** Normalize K2_API_KEY — Vercel env vars sometimes include Bearer, quotes, or braces. */
function parseK2ApiKey(raw) {
    let key = (raw || '').trim();

    if (key.toLowerCase().startsWith('bearer ')) {
        key = key.slice(7).trim();
    }
    if (key.startsWith('{') && key.endsWith('}')) {
        key = key.slice(1, -1).trim();
    }
    if (
        (key.startsWith('"') && key.endsWith('"')) ||
        (key.startsWith("'") && key.endsWith("'"))
    ) {
        key = key.slice(1, -1).trim();
    }

    return key;
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

        // Match K2 onboarding curl exactly — extra params (max_tokens, temperature)
        // can cause "No LLM found" on some IFM key tiers.
        const response = await fetch('https://api.k2think.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${serverApiKey}`,
            },
            body: JSON.stringify({
                model: 'MBZUAI-IFM/K2-Think-v2',
                messages,
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
                /* keep raw text */
            }
            return new Response(JSON.stringify({ error: detail }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(response.body, {
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
