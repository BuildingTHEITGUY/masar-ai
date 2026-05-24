import React, { useState } from 'react';
import FormInput from './components/FormInput';

const universityData = {
  ud: {
    name: "University of Dubai (UD) — Graduate Admissions",
    tagline: "CAA Standard 6.3 Certified Post-Graduate Pathways (Policy S 6.2)",
    colleges: [
      {
        name: "College of Engineering and Information Technology (CEIT)",
        criteria: "Requires a recognized Bachelor's degree in a core STEM discipline with a minimum CGPA of 3.0/4.0. Conditional tracks available for CGPAs down to 2.0 (requires Program Director interview). No remedial bridging courses permitted.",
        programs: [
          "Master of Science in Data Science (MSDS)",
          "Master of Science in Cyber Security (MSCS)",
          "Master's Level Micro-credentials"
        ]
      },
      {
        name: "Dubai Business School (DBS)",
        criteria: "Requires a recognized Bachelor's degree (Minimum CGPA 3.0/4.0). Conditional entry down to 2.0 CGPA. Unrelated degrees require passing 2 remedial courses or clearing online/offline proctored challenge exams.",
        programs: [
          "Regular MBA & Online MBA",
          "Global MBA in AI for Business (Requires 3+ Years Work Experience + Interview)",
          "PhD in Business Administration (Regular & Senior Leadership 15-Year Waiver Route)"
        ]
      },
      {
        name: "College of Law (COL)",
        criteria: "Requires a recognized Bachelor's degree in a related discipline. Regular entry requires 3.0 CGPA. Conditional entry at 2.0 CGPA requires passing 3 graduate-level remedial courses.",
        programs: [
          "Master of Law (LLM)"
        ]
      }
    ]
  },
  mbzuai: {
    name: "Mohamed bin Zayed University of Artificial Intelligence",
    tagline: "Post-Graduate Deep Tech AI Research System Integration",
    colleges: [
      {
        name: "School of AI Foundation Systems",
        criteria: "Target competitive destination framework. Requires completion of a verified, highly quantitative STEM qualification framework (such as UD's MSc in Data Science) with optimal background profiles.",
        programs: [
          "MSc in Machine Learning",
          "MSc in Computer Vision",
          "MSc in Natural Language Processing"
        ]
      }
    ]
  }
};

export default function App() {
  const [studentProfile, setStudentProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('ud');

  const handleFormSubmit = (profileData) => {
    setStudentProfile(profileData);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f3f4f6' }}>

      {/* Premium Header Architecture */}
      <header style={{
        background: '#0f172a',
        padding: '24px 20px',
        textAlign: 'center',
        borderBottom: '1px solid #1e293b',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
          Masar AI <span style={{ color: '#ff6b3d', fontWeight: '400' }}>(مسار)</span>
        </h1>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '0.95rem', fontWeight: '500' }}>
          Next-Gen Student Pathway Reasoning Agent
        </p>
      </header>

      {/* Dynamic Main Workspace Container Layout */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '1fr minmax(320px, 480px)',
        gap: '40px',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '50px 20px'
      }}>

        {/* LEFT COLUMN: THE INTEL SPOTLIGHT */}
        <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
          {!studentProfile ? (
            <FormInput onSubmit={handleFormSubmit} />
          ) : (
            <div style={{
              width: '100%',
              background: '#1e293b',
              padding: '40px',
              borderRadius: '16px',
              border: '1px solid #334155',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
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
              }}>✓</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#ffffff', fontSize: '1.4rem', fontWeight: '700' }}>Telemetry Logged</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 32px 0' }}>
                Profile coordinates captured. Ready to route parameters into the K2 Think V2 long chain-of-thought orchestration matrices.
              </p>
              <button
                onClick={() => setStudentProfile(null)}
                style={{
                  padding: '12px 24px',
                  background: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid #334155',
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

        {/* RIGHT COLUMN: INSTITUTIONAL BENCHMARK DIRECTORY */}
        <section style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          height: 'fit-content'
        }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Institutional Matrix Index
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.8rem', color: '#64748b' }}>
            Select verified destination frameworks to analyze admission routing engines.
          </p>

          {/* Tab Selector System */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('ud')}
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: activeTab === 'ud' ? '#ff6b3d' : '#1e293b',
                backgroundColor: activeTab === 'ud' ? 'rgba(255, 107, 61, 0.1)' : '#111827',
                color: activeTab === 'ud' ? '#ff6b3d' : '#94a3b8',
                fontWeight: '600',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              University of Dubai
            </button>
            <button
              onClick={() => setActiveTab('mbzuai')}
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: activeTab === 'mbzuai' ? '#ff6b3d' : '#1e293b',
                backgroundColor: activeTab === 'mbzuai' ? 'rgba(255, 107, 61, 0.1)' : '#111827',
                color: activeTab === 'mbzuai' ? '#ff6b3d' : '#94a3b8',
                fontWeight: '600',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              MBZUAI Core
            </button>
          </div>

          {/* Active View Engine */}
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#ffffff', fontWeight: '600' }}>
              {universityData[activeTab].name}
            </h4>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.75rem', color: '#ff6b3d', fontWeight: '500' }}>
              {universityData[activeTab].tagline}
            </p>

            {universityData[activeTab].colleges.map((college, idx) => (
              <div key={idx} style={{
                background: '#131a26',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '12px'
              }}>
                <h5 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#f1f5f9', fontWeight: '600' }}>
                  {college.name}
                </h5>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4', background: '#0f172a', padding: '8px', borderRadius: '4px', borderLeft: '2px solid #ff6b3d' }}>
                  <strong>Admission Criteria Update:</strong> {college.criteria}
                </p>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {college.programs.map((prog, pIdx) => (
                    <li key={pIdx} style={{ marginBottom: '2px' }}>{prog}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}