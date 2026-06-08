/**
 * Shared Supabase REST insert for Edge — logs failures to Vercel function logs.
 */
export async function persistStudentRecord(row) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('[Supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Vercel env');
        return { ok: false, status: 0, error: 'missing_config' };
    }

    const body = {
        name: row.name ?? null,
        email: row.email ?? null,
        nationality: row.nationality ?? null,
        curriculum: row.curriculum ?? null,
        overall_average: row.overall_average ?? null,
        math_score: row.math_score ?? null,
        physics_score: row.physics_score ?? null,
        english_score: row.english_score ?? null,
        preferred_location: row.preferred_location ?? null,
        selected_track: row.selected_track ?? null,
        ai_roadmap: row.ai_roadmap ?? null,
    };

    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/students`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: key,
            Authorization: `Bearer ${key}`,
            Prefer: 'return=minimal',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error('[Supabase] Insert failed:', res.status, errText);
        return { ok: false, status: res.status, error: errText };
    }

    console.log('[Supabase] Insert ok for', row.email || row.name || 'anonymous');
    return { ok: true, status: res.status };
}
