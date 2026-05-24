import React, { useState } from 'react';

export default function FormInput({ onSubmit }) {
    const [stream, setStream] = useState('moe_advanced');
    const [emsatMath, setEmsatMath] = useState('');
    const [interest, setInterest] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ stream, emsatMath: parseInt(emsatMath) || 0, interest });
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '20px', maxWidth: '500px', margin: 'auto', background: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#e0531b', marginBottom: '20px' }}>Student Profile Intake</h2>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>High School Curriculum / Stream:</label>
                <select value={stream} onChange={(e) => setStream(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                    <option value="moe_advanced">UAE MoE - Advanced Stream</option>
                    <option value="moe_general">UAE MoE - General Stream</option>
                    <option value="british_alevels">British Curriculum (A-Levels)</option>
                    <option value="american_diploma">American Diploma</option>
                </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>EmSAT Mathematics Score:</label>
                <input type="number" placeholder="e.g. 950" value={emsatMath} onChange={(e) => setEmsatMath(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Primary Fields of Interest / Passion:</label>
                <input type="text" placeholder="e.g. Cyber Security, Space Tech, Finance" value={interest} onChange={(e) => setInterest(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <button type="submit" style={{ width: '100%', padding: '12px', background: '#e0531b', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                Generate Roadmap Matrix
            </button>
        </form>
    );
}