import React, { useState } from 'react';
import FormInput from './components/FormInput';

// Safe fallback data directly inside the file in case the JSON path is broken
const fallbackData = {
  "name": "University of Dubai",
  "colleges": [
    {
      "name": "College of Engineering and Information Technology",
      "min_emsat_math": 900,
      "programs": ["BSc in Information Systems Security", "BSc in Electrical Engineering", "BSc in Computer Science"]
    },
    {
      "name": "Dubai Business School",
      "min_emsat_math": 600,
      "programs": ["BBA in Accounting", "BBA in Finance", "BBA in Digital Marketing"]
    }
  ]
};

export default function App() {
  const [studentProfile, setStudentProfile] = useState(null);

  const handleFormSubmit = (profileData) => {
    setStudentProfile(profileData);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f3f4f6' }}>

      {/* Header Bar */}
      <header style={{
        background: '#0f172a',
        padding: '20px',
        textAlign: 'center',
        borderBottom: '1px solid #1e293b',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.025em', color: '#ffffff' }}>
          Masar AI <span style={{ color: '#ff6b3d', fontWeight: '400' }}>(مسار)</span>
        </h1>
        <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
          Next-Gen Student Pathway Reasoning Agent
        </p>
      </header>

      {/* Main Container Split View */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '50px 20px'
      }}>

        {/* Left Column: Embedded Academic Framework Hub */}
        <section style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          height: 'fit-content'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
            <span style={{ fontSize: '1.4rem' }}>🏛️</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff', fontWeight: '600' }}>{fallbackData.name} Matrix</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#ff6b3d', fontWeight: '600', textTransform: 'uppercase' }}>CAA Accredited Benchmarks</p>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '20px' }}>
            Live integration mapping for institutional admissions processing systems. Powered by MBZUAI K2 Think V2 reasoning logic models.
          </p>

          {/* Dynamic Map Loop over Colleges */}
          {fallbackData.colleges.map((college, idx) => (
            <div key={idx} style={{
              background: '#131a26',
              border: '1px solid #1f2937',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#f3f4f6', fontWeight: '600' }}>
                {college.name}
              </h4>
              <div style={{ display: 'inline-block', fontSize: '0.75rem', background: 'rgba(224, 83, 27, 0.15)', color: '#ff6b3d', padding: '4px 8px', borderRadius: '4px', fontWeight: '600', marginBottom: '12px' }}>
                Minimum EmSAT Math: {college.min_emsat_math}
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.6' }}>
                {college.programs.map((prog, pIdx) => (
                  <li key={pIdx} style={{ marginBottom: '4px' }}>{prog}</li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '12px', marginTop: '20px', fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>
            <span>Platform Target: MoE Compliance Core</span>
            <span style={{ color: '#475569', marginLeft: 'auto' }}>v1.0.0</span>
          </div>
        </section>

        {/* Right Column: Interactive Profile Configuration Panel */}
        <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
          {!studentProfile ? (
            <FormInput onSubmit={handleFormSubmit} />
          ) : (
            <div style={{
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto',
              background: '#131a26',
              padding: '40px 32px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255, 107, 61, 0.1)',
                color: '#ff6b3d',
                marginBottom: '20px',
                fontSize: '1.8rem',
                fontWeight: 'bold'
              }}>
                ✓
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#ffffff', fontSize: '1.3rem', fontWeight: '600' }}>Matrix Configured</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 30px 0' }}>
                Data telemetry matched with high school stream metrics. Ready to initiate streaming token reasoning pipelines via MBZUAI K2 Think infrastructure.
              </p>
              <button
                onClick={() => setStudentProfile(null)}
                style={{
                  padding: '12px 24px',
                  background: '#1f2937',
                  color: '#f3f4f6',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                Reconfigure Intake Profile
              </button>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}