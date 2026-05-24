import React, { useState } from 'react';

export default function FormInput({ onSubmit }) {
    const [stream, setStream] = useState('moe_advanced');
    const [emsatMath, setEmsatMath] = useState('');
    const [interest, setInterest] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ stream, emsatMath: parseInt(emsatMath) || 0, interest });
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#9ca3af',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #1f2937',
        backgroundColor: '#111827',
        color: '#f3f4f6',
        fontSize: '0.95rem',
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    return (
        <form onSubmit={handleSubmit} style={{
            padding: '32px',
            maxWidth: '480px',
            margin: '0 auto',
            background: '#111827/80',
            backgroundColor: '#131a26',
            borderRadius: '16px',
            border: '1px solid #1f2937',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)'
        }}>
            <h3 style={{ color: '#f3f4f6', margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: '600', textAlign: 'center' }}>
                Configure Academic Matrix
            </h3>

            <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>High School Track / Curriculum</label>
                <select value={stream} onChange={(e) => setStream(e.target.value)} style={inputStyle}>
                    <option value="moe_advanced">UAE MoE — Advanced Stream</option>
                    <option value="moe_general">UAE MoE — General Stream</option>
                    <option value="british_alevels">British Curriculum (A-Levels)</option>
                    <option value="american_diploma">American Diploma</option>
                </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>EmSAT Mathematics Benchmarks</label>
                <input type="number" placeholder="e.g. 1100" value={emsatMath} onChange={(e) => setEmsatMath(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Core Specialization Passions</label>
                <input type="text" placeholder="e.g. Cyber Security, Space Tech, Finance" value={interest} onChange={(e) => setInterest(e.target.value)} style={inputStyle} />
            </div>

            <button type="submit" style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #ff6b3d 0%, #e0531b 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(224, 83, 27, 0.2)',
                letterSpacing: '0.025em'
            }}>
                Initialize Reasoning Core
            </button>
        </form>
    );
}