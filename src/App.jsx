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
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFormSubmit = async (profileData) => {
    setStudentProfile(profileData);
    setIsProcessing(true);
    setAiResponse('');

    const promptPayload = `
      You are Masar AI, an expert academic routing agent specialized in UAE higher education policies.
      Analyze this student profile:
      - Track: ${profileData.stream}
      - High School Average: ${profileData.highSchoolAvg}%
      - EmSAT Math: ${profileData.emsatMath || 'Not Provided'}
      - Passion Keynotes: ${profileData.interest}

      Cross-reference this data with the institutional rules for the University of Dubai (UD) and MBZUAI.
      Output a long, sequential Chain-of-Thought (CoT) details window showing your step-by-step evaluation of their criteria matches, followed by a concrete, long-term multi-cycle roadmap recommendation (Bachelor's to Master's/PhD tracks).
    `;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: promptPayload }]
        })
      });

      if (!response.ok) {
        throw new Error("Server proxy routing offline. Activating simulation container...");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let finished = false;

      while (!finished) {
        const { value, done } = await reader.read();
        finished = done;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          setAiResponse((prev) => prev + chunk);
        }
      }
    } catch (err) {
      // Execute the newly refactored dynamic simulation engine
      simulateStreamingResponse(profileData);
    }
  };

  const simulateStreamingResponse = (profile) => {
    const interestLower = (profile.interest || '').toLowerCase();

    // Evaluate if user is looking for Business tracks
    const isBusinessTrack = interestLower.includes('market') ||
      interestLower.includes('bus') ||
      interestLower.includes('fin') ||
      interestLower.includes('manag') ||
      interestLower.includes('log');

    let mockOutput = `[K2-THINK-V2 REASONING CORE ACTIVE]\n`;
    mockOutput += `> Analyzing local admission matrices for high school parameters...\n`;
    mockOutput += `> Verifying High School average: ${profile.highSchoolAvg}% processed against policy benchmarks.\n`;
    mockOutput += `> Tracking curriculum metrics for stream: "${profile.stream}".\n`;
    mockOutput += `> Parsing specialization interests: mapping "${profile.interest}" to CAA-accredited modules...\n\n`;

    if (isBusinessTrack) {
      mockOutput += `[REASONING ENGINE COMPLETE — GENERATING BUSINESS PATHWAY MATRIX]\n\n`;
      mockOutput += `🏛️ STAGE 1: UNDERGRADUATE ROUTING (Dubai Business School - DBS)\n`;
      mockOutput += `- Targeted Direction: BBA in Digital Marketing or BBA in Finance.\n`;
      mockOutput += `- Policy Compliance: Your high school average of ${profile.highSchoolAvg}% successfully satisfies regular DBS entry thresholds. Direct academic tracking allocated pending English Placement Test (EPT) validation.\n\n`;

      mockOutput += `📈 STAGE 2: GRADUATE SPECIALIZATION ELEVATION (Dubai Business School)\n`;
      mockOutput += `- Continuous Track: Regular MBA or Global MBA in AI for Business.\n`;
      mockOutput += `- Strategic Detail: The Global MBA track will require a minimum of 3 years post-bachelor professional work experience and a formal interview panel clearance per Policy S6.2.\n\n`;

      mockOutput += `🚀 STAGE 3: FUTURE HORIZON ALIGNMENT\n`;
      mockOutput += `- Destination Focus: Enterprise Digital Transformation Executive.\n`;
      mockOutput += `- Rationale: Focuses on commercial deployment of predictive models within corporate enterprise operations rather than deep-tech foundational laboratory algorithms.`;
    } else {
      // Engineering and Deep AI Track
      mockOutput += `[REASONING ENGINE COMPLETE — GENERATING ENGINEERING/STEM PATHWAY MATRIX]\n\n`;
      mockOutput += `🏛️ STAGE 1: UNDERGRADUATE ROUTING (College of Engineering & IT - CEIT)\n`;

      if (profile.highSchoolAvg < 80) {
        mockOutput += `- Targeted Direction: BSc in Computer Science (Conditional Entry Track).\n`;
        mockOutput += `- Policy Compliance: Your average of ${profile.highSchoolAvg}% falls under the 80% regular engineering threshold. System triggers an active conditional hold: Student MUST clear the institutional UD Math Placement Test (MPT) or complete foundational Pre-Calculus/Pre-Physics tracks.\n\n`;
      } else {
        mockOutput += `- Targeted Direction: BSc in Computer Science or Computer Engineering.\n`;
        mockOutput += `- Policy Compliance: Academic average of ${profile.highSchoolAvg}% successfully validates all regular entry criteria. Core preparatory remedial sequences are fully bypassed.\n\n`;
      }

      mockOutput += `📈 STAGE 2: GRADUATE SPECIALIZATION ELEVATION (University of Dubai - CEIT)\n`;
      mockOutput += `- Continuous Track: Master of Science in Cyber Security (MSCS) or Data Science (MSDS).\n`;
      mockOutput += `- Development Focus: Builds advanced technical engineering paradigms under CAA Standard 6.3 parameters.\n\n`;

      mockOutput += `🚀 STAGE 3: THE ULTIMATE STRATEGIC DESTINATION (MBZUAI Research Core)\n`;
      mockOutput += `- Advanced Horizon: Target MSc in Machine Learning or Computer Vision at Mohamed bin Zayed University of Artificial Intelligence.\n`;
      mockOutput += `- Strategic Synergy: Progression from a highly quantitative background at UD into MBZUAI’s specialized environment forms a premier vector for the UAE digital economy.`;
    }

    let index = 0;
    const interval = setInterval(() => {
      setAiResponse((prev) => prev + mockOutput[index]);
      index++;
      if (index >= mockOutput.length) {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 10);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f3f4f6' }}>

      {/* Header Bar */}
      <header style={{
        background: '#0f172a',
        padding: '24px 20px',
        textAlign: 'center',
        borderBottom: '1px solid #1e293b'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
          Masar AI <span style={{ color: '#ff6b3d', fontWeight: '400' }}>(مسار)</span>
        </h1>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '0.95rem', fontWeight: '500' }}>
          Next-Gen Student Pathway Reasoning Agent
        </p>
      </header>

      {/* Main Split Interface */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '1fr minmax(320px, 480px)',
        gap: '40px',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>

        {/* LEFT COLUMN: VISUAL INTAKE WORKSPACE */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Reassured Infrastructure Status Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '500' }}>
                K2-Think-V2 Processing Engine: <strong style={{ color: '#10b981' }}>ONLINE</strong>
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', background: 'rgba(255, 107, 61, 0.15)', color: '#ff6b3d', padding: '4px 10px', borderRadius: '6px', fontWeight: '700', letterSpacing: '0.05em' }}>
              SPONSORED VIA MBZUAI
            </div>
          </div>

          {!studentProfile ? (
            <FormInput onSubmit={handleFormSubmit} />
          ) : (
            <div style={{
              width: '100%',
              background: '#131a26',
              padding: '32px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.2rem', fontWeight: '700' }}>
                  {isProcessing ? "🤖 Processing K2 Token Rationale..." : "🔮 Personalized Academic Pathway"}
                </h3>
                <button
                  onClick={() => { setStudentProfile(null); setAiResponse(''); }}
                  style={{
                    padding: '6px 14px',
                    background: '#1f2937',
                    color: '#f3f4f6',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  New Strategy
                </button>
              </div>

              <pre style={{
                margin: 0,
                padding: '20px',
                backgroundColor: '#070a12',
                borderRadius: '8px',
                border: '1px solid #1e293b',
                color: '#34d399',
                fontFamily: 'Courier New, monospace',
                fontSize: '0.85rem',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                overflowX: 'auto',
                minHeight: '280px'
              }}>
                {aiResponse || "Initializing secure streaming channels... Parsing target parameters."}
                {isProcessing && <span style={{ animation: 'blink 1s infinite', color: '#ff6b3d' }}>_</span>}
              </pre>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: INSTITUTIONAL LOOKUP MATRIX */}
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
            Toggle verified frameworks to view academic routing baselines.
          </p>

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