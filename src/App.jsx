import React, { useState } from 'react';
import FormInput from './components/FormInput';

const universityData = {
  dubai: {
    name: "University of Dubai (UD)",
    url: "https://ud.ac.ae",
    tagline: "Undergraduate S6.1 & Graduate S6.2 Frameworks",
    sections: [
      {
        title: "College of Engineering & IT",
        programs: ["BSc in Computer Science", "BSc in Computer Engineering", "Master of Science in Data Science (MSDS)", "Master of Science in Cyber Security (MSCS)"]
      },
      {
        title: "Dubai Business School",
        programs: ["BBA in Digital Marketing", "BBA in Finance", "Regular MBA & Online MBA", "Global MBA in AI for Business"]
      }
    ]
  },
  abudhabi: {
    name: "Mohamed bin Zayed University of AI (MBZUAI)",
    url: "https://mbzuai.ac.ae",
    tagline: "Post-Graduate Deep Tech AI Research Integration",
    sections: [
      {
        title: "School of AI Foundation Systems",
        programs: ["MSc in Machine Learning", "MSc in Computer Vision", "MSc in Natural Language Processing"]
      }
    ]
  },
  sharjah: {
    name: "University of Sharjah (UOS)",
    url: "https://www.sharjah.ac.ae",
    tagline: "Comprehensive Academic & Research Matrix",
    sections: [
      {
        title: "College of Computing and Informatics",
        programs: ["BSc in Information Technology", "BSc in Cybersecurity Engineering", "MSc in Computer Science"]
      },
      {
        title: "College of Business Administration",
        programs: ["BBA in Marketing", "BBA in Management", "Master of Business Administration (MBA)"]
      }
    ]
  }
};

export default function App() {
  const [studentProfile, setStudentProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('dubai');
  const [aiResponse, setAiResponse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFormSubmit = (profileData) => {
    setStudentProfile(profileData);
    setIsProcessing(true);

    // Dynamic processing simulator customized based on student inputs
    setTimeout(() => {
      const interestLower = (profileData.interest || '').toLowerCase();
      const isBusiness = interestLower.includes('market') || interestLower.includes('bus') || interestLower.includes('fin') || interestLower.includes('manag');

      let targetUni = universityData.dubai;
      let recommendedProg = isBusiness ? "BBA in Digital Marketing" : "BSc in Computer Science";
      let gradProg = isBusiness ? "Global MBA in AI for Business" : "Master of Science in Data Science (MSDS)";

      if (profileData.emirate === 'abudhabi' || (!isBusiness && interestLower.includes('ai'))) {
        targetUni = universityData.abudhabi;
        recommendedProg = "MSc in Machine Learning";
      } else if (profileData.emirate === 'sharjah') {
        targetUni = universityData.sharjah;
        recommendedProg = isBusiness ? "BBA in Marketing" : "BSc in Cybersecurity Engineering";
        gradProg = isBusiness ? "Master of Business Administration (MBA)" : "MSc in Computer Science";
      }

      setAiResponse({
        uniName: targetUni.name,
        uniUrl: targetUni.url,
        undergrad: recommendedProg,
        graduate: gradProg || "N/A",
        isConditional: profileData.highSchoolAvg < 80 && !isBusiness,
        profile: profileData
      });
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f3f4f6' }}>

      {/* Header Viewport */}
      <header style={{ background: '#0f172a', padding: '24px 20px', textAlign: 'center', borderBottom: '1px solid #1e293b' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
          Masar AI <span style={{ color: '#ff6b3d', fontWeight: '400' }}>(مسار)</span>
        </h1>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '0.95rem', fontWeight: '500' }}>
          Next-Gen Student Pathway Reasoning Agent
        </p>
      </header>

      {/* Main Container: Complete Flex wrap structure to enable beautiful phone screen alignment */}
      <main style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '40px',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>

        {/* LEFT COMPONENT LAYER: WORKSPACE SPOTLIGHT (Flexible Width for Mobile) */}
        <section style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '500' }}>
                K2-Think-V2 Processing Engine: <strong style={{ color: '#10b981' }}>ONLINE</strong>
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', background: 'rgba(255, 107, 61, 0.15)', color: '#ff6b3d', padding: '4px 10px', borderRadius: '6px', fontWeight: '700' }}>
              SPONSORED VIA MBZUAI
            </div>
          </div>

          {!studentProfile ? (
            <FormInput onSubmit={handleFormSubmit} />
          ) : (
            <div style={{ width: '100%', background: '#131a26', padding: '32px', borderRadius: '16px', border: '1px solid #1e293b', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.25rem', fontWeight: '700' }}>
                  Your Guided Academic Pathway
                </h3>
                <button onClick={() => { setStudentProfile(null); setAiResponse(null); }} style={{ padding: '6px 14px', background: '#1f2937', color: '#f3f4f6', border: '1px solid #374151', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                  Modify Inputs
                </button>
              </div>

              {isProcessing || !aiResponse ? (
                <div style={{ color: '#94a3b8', fontSize: '0.95rem', padding: '40px 0', textAlign: 'center' }}>
                  🤖 Activating long chain-of-thought routing matrices...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* Clean Non-Techie High Readable Cards */}
                  <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #ff6b3d' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ff6b3d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Institution</span>
                    <h4 style={{ margin: '4px 0', fontSize: '1.4rem', fontWeight: '700' }}>
                      <a href={aiResponse.uniUrl} target="_blank" rel="noreferrer" style={{ color: '#ffffff', textDecoration: 'underline', transition: 'color 0.2s' }}>
                        {aiResponse.uniName}
                      </a>
                    </h4>
                    <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Click the link above to view verified campus admission windows.</p>
                  </div>

                  <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended Undergraduate Base</span>
                    <p style={{ margin: '6px 0 0 0', fontSize: '1.1rem', fontWeight: '700', color: '#f1f5f9' }}>
                      {aiResponse.undergrad}
                    </p>
                    {aiResponse.isConditional && (
                      <p style={{ margin: '10px 0 0 0', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', fontSize: '0.8rem', color: '#fca5a5', lineHeight: '1.4' }}>
                        ⚠️ <strong>Conditional Alert:</strong> High School Average ({aiResponse.profile.highSchoolAvg}%) sits below regular engineering cutoffs. Program registration requires clearing the Institutional Math Placement Test (MPT).
                      </p>
                    )}
                  </div>

                  {aiResponse.uniName !== "Mohamed bin Zayed University of AI (MBZUAI)" && (
                    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Continuous Master's Pathway Horizon</span>
                      <p style={{ margin: '6px 0 0 0', fontSize: '1.1rem', fontWeight: '700', color: '#f1f5f9' }}>
                        {aiResponse.graduate}
                      </p>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}
        </section>

        {/* RIGHT COMPONENT LAYER: ADMINISTRATIVE REFERENCE ACCORDION */}
        <section style={{
          flex: '1 1 320px',
          maxWidth: '480px',
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
            Toggle active emirate framework profiles to inspect target baseline configurations.
          </p>

          {/* Location-based multi tab control mapping */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '20px' }}>
            {['dubai', 'abudhabi', 'sharjah'].map((loc) => (
              <button
                key={loc}
                onClick={() => setActiveTab(loc)}
                style={{
                  padding: '10px 4px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: activeTab === loc ? '#ff6b3d' : '#1e293b',
                  backgroundColor: activeTab === loc ? 'rgba(255, 107, 61, 0.1)' : '#111827',
                  color: activeTab === loc ? '#ff6b3d' : '#94a3b8',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {loc === 'abudhabi' ? 'Abu Dhabi' : loc}
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
            <h4 style={{ margin: '0 0 2px 0', fontSize: '1rem', color: '#ffffff', fontWeight: '700' }}>
              {universityData[activeTab].name}
            </h4>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.75rem', color: '#ff6b3d', fontWeight: '500' }}>
              {universityData[activeTab].tagline}
            </p>

            {universityData[activeTab].sections.map((sec, sIdx) => (
              <div key={sIdx} style={{ marginBottom: '16px' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#ffffff', fontSize: '0.85rem', fontWeight: '700', borderLeft: '3px solid #ff6b3d', paddingLeft: '8px' }}>
                  {sec.title}
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {sec.programs.map((prog, pIdx) => (
                    <span key={pIdx} style={{ fontSize: '0.7rem', background: '#131a26', color: '#cbd5e1', padding: '6px 10px', borderRadius: '4px', border: '1px solid #1e293b' }}>
                      {prog}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}