import { persistStudentRecord } from '../lib/supabaseStudent.js';

export const config = {
    runtime: 'edge',
};

/** Save student profile when onboarding form is submitted (before K2). */
export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const data = await req.json();

        const result = await persistStudentRecord({
            name: data.name ?? null,
            email: data.email ?? null,
            nationality: data.nationality ?? null,
            curriculum: data.curriculum ?? null,
            overall_average: data.overall_average ?? null,
            math_score: data.math_score ?? null,
            physics_score: data.physics_score ?? null,
            english_score: data.english_score ?? null,
            english_test_type: data.english_test_type ?? null,
            english_test_score: data.english_test_score ?? null,
            preferred_location: data.preferred_location ?? null,
            selected_track: data.selected_track ?? null,
            ai_roadmap: null,
        });

        if (!result.ok) {
            return new Response(
                JSON.stringify({
                    error: 'Supabase insert failed',
                    detail: result.error,
                    hint: 'Run supabase/migrate-students-columns.sql and verify SUPABASE_SERVICE_ROLE_KEY',
                }),
                { status: result.status || 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('[log-profile]', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
