export const config = {
    runtime: 'edge', // Uses high-speed Vercel Edge network for instant streaming
};

export default async function handler(req) {
    // Guardrail: Only allow secure POST requests
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const incomingData = await req.json();

        // Securely pull the key on the server-side only
        const serverApiKey = process.env.K2_API_KEY;

        if (!serverApiKey) {
            return new Response(JSON.stringify({ error: "Server API Key configuration missing." }), { status: 500 });
        }

        // Call the external MBZUAI API securely from our server
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
                stream: true
            })
        });

        // Pipe the real-time text token stream straight back to the student's browser
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