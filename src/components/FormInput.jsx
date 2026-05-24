import React, { useState } from 'react';

export default function FormInput({ onSubmit }) {
    const [stream, setStream] = useState('moe_advanced');
    const [highSchoolAvg, setHighSchoolAvg] = useState('');
    const [emsatMath, setEmsatMath] = useState('');
    const [interest, setInterest] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            stream,
            highSchoolAvg: parseFloat(highSchoolAvg) || 0,
            emsatMath: emsatMath ? parseInt(emsatMath) : null,
            interest
        });
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#94a3b8',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    };

    const inputStyle = {
        width: '100%',
        padding: '14px',
        borderRadius: '8px',
        border: '1px solid #334155',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontSize: '0.95rem',
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    return (
        <form onSubmit={handleSubmit} style={{
            padding: '40px',
            background: '#1e293b',
            borderRadius: '16px',
            border: '1px solid #334155',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
            <h2 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: '700' }}>
                Initialize Guidance Matrix
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 32px 0', lineHeight: '1.5' }}>
                Input your academic parameters. Masar AI will evaluate institutional entrance requirements, high school percentages, and alternative placement options.
            </p>

            <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>High School Track / Curriculum</label>
                <select value={stream} onChange={(e) => setStream(e.target.value)} style={inputStyle}>
                    <option value="moe_advanced">UAE MoE — Advanced Stream</option>
                    <option value="moe_general">UAE MoE — General Stream</option>
                    <option value="british_alevels">British Curriculum (A-Levels)</option>
                    <option value="american_diploma">American Diploma</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <label style={labelStyle}>Overall High School Avgerage (%) *</label>
                    <input type="number" required min="50" max="100" placeholder="e.g. 85" value={highSchoolAvg} onChange={(e) => setHighSchoolAvg(e.target.value)} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>EmSAT Math Score (Optional)</label>
                    <input type="number" placeholder="Leave blank if skipped" value={emsatMath} onChange={(e) => setEmsatMath(e.target.value)} style={inputStyle} />
                </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
                <label style={labelStyle}>Core Areas of Passion & Specialization</label>
                <input type="text" placeholder="e.g. Cyber Security, AI, Space Tech, Marketing" value={interest} onChange={(e) => setInterest(e.target.value)} style={inputStyle} />
            </div>

            <button type="submit" style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #ff6b3d 0%, #e0531b 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(224, 83, 27, 0.3)',
                letterSpacing: '0.025em'
            }}>
                Process Pathway Reasoning Core
            </button>
        </form>
    );
}