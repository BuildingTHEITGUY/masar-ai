import React, { useState } from 'react';
import FormInput from './components/FormInput';

const universityData = {
  ud: {
    name: "University of Dubai (UD) — Comprehensive Matrix",
    tagline: "Unified Policy Engine (Undergraduate S6.1 & Graduate S6.2 Frameworks)",
    sections: [
      {
        title: "College of Engineering & Information Technology (CEIT)",
        items: [
          {
            level: "Undergraduate Programs",
            criteria: "Requires an 80% minimum score in high school Mathematics (or passing the UD MPT), 80% in Physics, and 80% in Chemistry/Biology. Conditional entries allow up to 12 credits alongside remedial coursework.",
            programs: ["BSc in Computer Science", "BSc in Computer Engineering", "BSc in Electrical Engineering", "BSc in Computing and Information Systems"]
          },
          {
            level: "Graduate Programs (Master's Level)",
            criteria: "Requires an accredited Bachelor's degree in a core STEM discipline with a minimum CGPA of 3.0/4.0. Conditional tracks available down to 2.0 CGPA following a Program Director interview. Bridging/remedial courses are not permitted.",
            programs: ["Master of Science in Data Science (MSDS)", "Master of Science in Cyber Security (MSCS)"]
          }
        ]
      },
      {
        title: "Dubai Business School (DBS)",
        items: [
          {
            level: "Undergraduate Programs",
            criteria: "Requires standard high school completion. Direct English entry requires an 80% minimum in MoE English or clearing the institutional EPT exam.",
            programs: ["BBA in Accounting", "BBA in Finance", "BBA in Digital Marketing", "BBA in Logistics and Operations Management"]
          },
          {
            level: "Graduate Programs (Master's & PhD)",
            criteria: "Master's requires a minimum 3.0/4.0 CGPA. Unrelated disciplines must pass 2 remedial courses or clear challenge exams. Global MBA in AI requires 3+ years of post-bachelor experience and an interview.",
            programs: ["Regular MBA & Online MBA", "Global MBA in AI for Business", "PhD in Business Administration"]
          }
        ]
      },
      {
        title: "College of Law (COL)",
        items: [
          {
            level: "Undergraduate Programs",
            criteria: "Dual-Degree Track with University of London (UoL). Requires a 70%+ in high school Math or passing MPT. Complete 30 CH at UD in Year 1 with a 2.0 CGPA, and provide a valid 6.0 IELTS Academic score.",
            programs: ["Bachelor of Law (LLB)"]
          },
          {
            level: "Graduate Programs (Master's Level)",
            criteria: "Requires a recognized Bachelor's degree in law or related discipline with a minimum 3.0/4.0 CGPA. Conditional entry down to 2.0 CGPA available (requires 3 graduate remedial courses).",
            programs: ["Master of Law (LLM)"]
          }
        ]
      }
    ]
  },
  mbzuai: {
    name: "Mohamed bin Zayed University of AI Pathways",
    tagline: "Post-Graduate Deep Tech AI Research Integration",
    sections: [
      {
        title: "School of AI Foundation Systems",
        items: [
          {
            level: "Advanced Research Tracks",
            criteria: "Target destination framework. Evaluates quantitative background preparation. Ideal progression vectors include completing a STEM Bachelor or Master's track at UD with optimal academic performance data profiles.",
            programs: ["MSc in Machine Learning", "MSc in Computer Vision", "MSc in Natural Language Processing"]
          }
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

      {/* Header Architecture */}
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

      {/* Main Container Split View */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '1fr minmax(320px, 480px)',
        gap: '40px',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '50px 20px'
      }}>

        {/* LEFT COLUMN: THE PRIMARY INTERACTIVE WORKSPACE */}
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

        {/* RIGHT COLUMN: UNIFIED INSTITUTIONAL INDEX */}
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
            Toggle target institutions to evaluate multi-tier program criteria tracking.
          </p>

          {/* Selector Tabs */}
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
              MBZUAI Index
            </button>
          </div>

          {/* Active Framework Mapping Loop */}
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#ffffff', fontWeight: '600' }}>
              {universityData[activeTab].name}
            </h4>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.75rem', color: '#ff6b3d', fontWeight: '500' }}>
              {universityData[activeTab].tagline}
            </p>

            {universityData[activeTab].sections.map((sec, sIdx) => (
              <div key={sIdx} style={{ marginBottom: '24px', borderBottom: '1px dashed #1e293b', paddingBottom: '16px' }}>
                <h5 style={{ margin: '0 0 12px 0', color: '#ffffff', fontSize: '0.9rem', fontWeight: '700', borderLeft: '3px solid #ff6b3d', paddingLeft: '8px' }}>
                  {sec.title}
                </h5>

                {sec.items.map((item, iIdx) => (
                  <div key={iIdx} style={{ background: '#131a26', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#ff6b3d', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
                      {item.level}
                    </span>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
                      {item.criteria}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {item.programs.map((prog, pIdx) => (
                        <span key={pIdx} style={{ fontSize: '0.7rem', background: '#0f172a', color: '#cbd5e1', padding: '4px 8px', borderRadius: '4px', border: '1px solid #1e293b' }}>
                          {prog}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}