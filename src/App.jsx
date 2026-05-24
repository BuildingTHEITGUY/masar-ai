import React, { useState } from 'react';
import FormInput from './components/FormInput';

export default function App() {
  const [studentProfile, setStudentProfile] = useState(null);

  const handleFormSubmit = (profileData) => {
    setStudentProfile(profileData);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f3f4f6' }}>

      {/* Header Grid */}
      <header style={{
        background: '#0f172a',
        padding: '24px 20px',
        textAlign: 'center',
        borderBottom: '1px solid #1e293b'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.025em', color: '#ffffff' }}>
          Masar AI <span style={{ color: '#ff6b3d', fontWeight: '400' }}>(مسار)</span>
        </h1>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '0.95rem', fontWeight: '500' }}>
          Next-Gen Student Pathway Reasoning Agent
        </p>
      </header>

      {/* Main Framework Viewport */}
      <main style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {!studentProfile ? (
          <FormInput onSubmit={handleFormSubmit} />
        ) : (
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            textAlign: 'center',
            background: '#131a26',
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid #1e293b'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(240, 98, 33, 0.1)',
              color: '#ff6b3d',
              marginBottom: '16px',
              fontSize: '1.5rem'
            }}>
              ✓
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#ffffff', fontSize: '1.2rem' }}>Matrix Set Successfully</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 24px 0' }}>
              Profile locked down. Ready to route parameters into the K2 Think V2 reasoning API engine upon activation credentials.
            </p>
            <button
              onClick={() => setStudentProfile(null)}
              style={{
                padding: '10px 20px',
                background: '#1f2937',
                color: '#f3f4f6',
                border: '1px solid #374151',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem'
              }}
            >
              Modify Matrix Context
            </button>
          </div>
        )}
      </main>
    </div>
  );
}