export const config = {
    runtime: 'nodejs',
    maxDuration: 60,
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const incomingData = await req.json();

        const serverApiKey = process.env.K2_API_KEY;

        if (!serverApiKey) {
            return new Response(JSON.stringify({ error: "Server API Key configuration missing." }), { status: 500 });
        }

        const response = await fetch('https://api.k2think.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${serverApiKey}`
            },
            body: JSON.stringify({
                model: "MBZUAI-IFM/K2-Think-v2",
                messages: incomingData.messages,
                stream: true,
                max_tokens: 800,
                temperature: 0.3,
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            return new Response(JSON.stringify({ error: errText || response.statusText }), { status: response.status });
        }

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
