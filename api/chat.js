export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const incomingData = await req.json();

        let serverApiKey = (process.env.K2_API_KEY || '').trim();

        if (serverApiKey.toLowerCase().startsWith('bearer ')) {
            serverApiKey = serverApiKey.slice(7).trim();
        }
        if (serverApiKey.startsWith('{') && serverApiKey.endsWith('}')) {
            serverApiKey = serverApiKey.slice(1, -1).trim();
        }
        if (
            (serverApiKey.startsWith('"') && serverApiKey.endsWith('"')) ||
            (serverApiKey.startsWith("'") && serverApiKey.endsWith("'"))
        ) {
            serverApiKey = serverApiKey.slice(1, -1).trim();
        }

        // TEMPORARY DEBUG — remove this whole block after testing
        if (incomingData?.debug === true) {
            return new Response(
                JSON.stringify({
                    keyLength: serverApiKey.length,
                    keyStart: serverApiKey.slice(0, 4),
                    keyEnd: serverApiKey.slice(-4),
                    hasBearerPrefix: (process.env.K2_API_KEY || '').toLowerCase().startsWith('bearer '),
                    hasQuotes:
                        (process.env.K2_API_KEY || '').startsWith('"') ||
                        (process.env.K2_API_KEY || '').startsWith("'"),
                }),
                { headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!serverApiKey) {
            return new Response(
                JSON.stringify({ error: 'Server API Key configuration missing or empty.' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const response = await fetch('https://api.k2think.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${serverApiKey}`,
            },
            body: JSON.stringify({
                model: 'MBZUAI-IFM/K2-Think-v2',
                messages: incomingData.messages,
                stream: true,
                max_tokens: 800,
                temperature: 0.3,
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            return new Response(JSON.stringify({ error: errText || response.statusText }), {
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