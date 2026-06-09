import React, { useState, useEffect } from 'react';
import FormInput from './components/FormInput';
import LandingChoice from './components/LandingChoice';
import ExploreWizard from './components/ExploreWizard';
import HowMasarWorksSidebar from './components/HowMasarWorksSidebar';
import K2CounselorPanel from './components/K2CounselorPanel';
import { SubTrackHeroCard, AdvisorInsightBox } from './components/SubTrackPathwayCard';
import programs from './data/programs.json';
import universities from './data/universities.json';
import { matchPrograms, programsByEmirate } from './lib/matchPrograms';
import { buildChatProfilePayload } from './lib/buildChatProfilePayload';
import ThemeToggle from './components/ThemeToggle';

const TRACK_LABELS = { law: 'Law', tech: 'Technology', business: 'Business' };

function useCompactHeader(breakpoint = 768) {
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return compact;
}

const SPONSOR_LOGOS = {
  k2: { src: '/sponsors/k2-think.png', alt: 'K2 Think', href: 'https://k2think.ai' },
  mbzuai: {
    src: '/sponsors/mbzuai.png',
    alt: 'Mohamed bin Zayed University of Artificial Intelligence',
    href: 'https://mbzuai.ac.ae',
  },
};

function SponsorLogo({ src, alt, href, maxHeight = 40, maxWidth }) {
  const img = (
    <img
      src={src}
      alt={alt}
      style={{
        height: `${maxHeight}px`,
        width: 'auto',
        maxWidth: maxWidth ? `${maxWidth}px` : '100%',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  );

  if (!href) return img;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: `${maxHeight}px`,
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
        textDecoration: 'none',
      }}
      aria-label={alt}
    >
      {img}
    </a>
  );
}

function AppHeader() {
  const compact = useCompactHeader();

  return (
    <header
      style={{
        background: 'var(--masar-bg-header)',
        borderBottom: '1px solid var(--masar-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: compact ? 'center' : 'space-between',
        flexDirection: compact ? 'column' : 'row',
        gap: compact ? '16px' : '12px',
        padding: compact ? '16px 20px' : '16px 40px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: compact ? 'static' : 'absolute',
          top: compact ? undefined : '16px',
          right: compact ? undefined : '40px',
          alignSelf: compact ? 'flex-end' : undefined,
          marginBottom: compact ? '-8px' : 0,
          zIndex: 2,
        }}
      >
        <ThemeToggle compact={compact} />
      </div>

      <div
        style={{
          flex: compact ? undefined : '1 1 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: compact ? 'center' : 'flex-start',
          minWidth: compact ? undefined : '140px',
        }}
      >
        <SponsorLogo
          src={SPONSOR_LOGOS.k2.src}
          alt={SPONSOR_LOGOS.k2.alt}
          href={SPONSOR_LOGOS.k2.href}
          maxHeight={compact ? 36 : 40}
          maxWidth={compact ? 120 : 140}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          flex: compact ? undefined : '0 1 auto',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: 'var(--masar-text-primary)' }}>
          Masar AI <span style={{ color: 'var(--masar-accent)', fontWeight: '400' }}>(مسار)</span>
        </h1>
        <p style={{ margin: '6px 0 0 0', color: 'var(--masar-text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>
          Your UAE Pathway After High School
        </p>
        <UaeHeaderBadge />
      </div>

      <div
        style={{
          flex: compact ? undefined : '1 1 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: compact ? 'center' : 'flex-end',
          minWidth: compact ? undefined : '200px',
        }}
      >
        <SponsorLogo
          src={SPONSOR_LOGOS.mbzuai.src}
          alt={SPONSOR_LOGOS.mbzuai.alt}
          href={SPONSOR_LOGOS.mbzuai.href}
          maxHeight={compact ? 36 : 40}
          maxWidth={compact ? 160 : 220}
        />
      </div>
    </header>
  );
}

function UaeHeaderBadge() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '12px',
        padding: '7px 16px',
        borderRadius: '999px',
        border: '1px solid var(--masar-border-input)',
        background: 'var(--masar-badge-bg)',
        boxShadow: 'var(--masar-shadow)',
      }}
    >
      <span
        style={{
          fontSize: '0.8rem',
          color: 'var(--masar-text-muted)',
          fontWeight: 500,
          letterSpacing: '0.02em',
          lineHeight: 1.4,
          fontFamily: "'Segoe UI', system-ui, 'Segoe UI Emoji', sans-serif",
        }}
      >
        Built in the UAE{' '}
        <img
          src="/flags/uae.svg"
          alt="UAE flag"
          style={{
            height: '14px',
            width: 'auto',
            verticalAlign: 'middle',
            marginLeft: '2px',
            marginRight: '2px',
          }}
        />{' '}
        with ❤️ for the Next Gen of Talent
      </span>
    </div>
  );
}

function InstitutionalFooter() {
  return (
    <footer
      style={{
        background: 'var(--masar-bg-header)',
        borderTop: '1px solid var(--masar-border)',
        padding: '30px 20px',
        marginTop: '60px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: '24px 32px',
        }}
      >
        <div
          style={{
            flex: '1 1 280px',
            maxWidth: '400px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              padding: '18px 22px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 107, 61, 0.35)',
              background: 'var(--masar-footer-gradient)',
              boxShadow: '0 0 24px rgba(255, 107, 61, 0.08)',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--masar-text-dim)',
              }}
            >
              UAE National Initiative
            </p>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: '1.15rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                lineHeight: 1.25,
                color: 'var(--masar-text-primary)',
              }}
            >
              MAKE IT IN THE{' '}
              <span style={{ color: 'var(--masar-accent)' }}>EMIRATES</span>
            </p>
            <p
              style={{
                margin: '10px 0 0',
                fontSize: '0.78rem',
                color: 'var(--masar-text-muted)',
                lineHeight: 1.5,
                fontWeight: 500,
              }}
            >
              National Talent Accelerator Node
              <span style={{ color: 'var(--masar-text-dim)' }}> · </span>
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>Vision 2031</span> Alignment
            </p>
          </div>
        </div>

        <div
          style={{
            flex: '1 1 220px',
            maxWidth: '320px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p
            style={{
              margin: 0,
              color: 'var(--masar-text-dim)',
              fontSize: '0.8rem',
              lineHeight: 1.65,
              fontWeight: 500,
              maxWidth: '300px',
            }}
          >
            Proudly engineered in Dubai, UAE{' '}
            <span role="img" aria-label="United Arab Emirates flag">
              🇦🇪
            </span>
            <br />
            <span style={{ color: 'var(--masar-text-faint)', fontSize: '0.75rem' }}>
              Designed for Zero-Trust Data Sovereignty
            </span>
          </p>
        </div>

        <div
          style={{
            flex: '1 1 280px',
            maxWidth: '400px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              padding: '18px 22px',
              borderRadius: '12px',
              border: '1px solid var(--masar-border-input)',
              background: 'var(--masar-bg-card-alt)',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--masar-text-dim)',
              }}
            >
              Built by
            </p>
            <p
              style={{
                margin: '8px 0 6px',
                fontSize: '1rem',
                fontWeight: 800,
                color: 'var(--masar-text-primary)',
              }}
            >
              Building THE IT GUY
            </p>
            <p
              style={{
                margin: '0 0 14px',
                fontSize: '0.78rem',
                color: 'var(--masar-text-muted)',
                lineHeight: 1.5,
              }}
            >
              Mohamed Asath — IT strategist &amp; UAE education advocate
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px 16px',
                justifyContent: 'center',
              }}
            >
              <a
                href="https://www.buildingtheitguy.com/index.php/about-me/"
                target="_blank"
                rel="noopener noreferrer"
                className="masar-footer-link"
              >
                About Me / Blog
              </a>
              <a
                href="https://www.linkedin.com/in/mohamed-asath/"
                target="_blank"
                rel="noopener noreferrer"
                className="masar-footer-link"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      <p
        style={{
          margin: '22px 0 0',
          fontSize: '0.7rem',
          color: 'var(--masar-text-faint)',
          letterSpacing: '0.04em',
        }}
      >
        Masar AI · مسار — Empowering UAE graduates to find their university pathway
      </p>
    </footer>
  );
}

function MatchCard({ match, studentProfile, variant = 'match', subTrackAccent }) {
  const borderColor =
    variant === 'alternative'
      ? '#f59e0b'
      : match.isUnderScore || match.isConditional
        ? '#ef4444'
        : '#10b981';
  const programColor = subTrackAccent && variant === 'match' ? subTrackAccent : '#38bdf8';

  return (
    <div
      style={{
        background: '#1e293b',
        padding: '24px',
        borderRadius: '12px',
        borderLeft: `4px solid ${borderColor}`,
      }}
    >
      {variant === 'alternative' && (
        <div
          style={{
            marginBottom: '10px',
            padding: '8px 12px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid #f59e0b',
            borderRadius: '6px',
            fontSize: '0.78rem',
            color: '#fcd34d',
          }}
        >
          <strong>Curriculum note:</strong> This program typically requires Advanced Stream, A-Levels, or a
          foundation pathway — not a direct match for your current MoE General profile.
        </div>
      )}
      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: '700',
          color: '#ff6b3d',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {match.emirate} · {match.track}
      </span>
      <h4 style={{ margin: '4px 0 12px 0', fontSize: '1.4rem', fontWeight: '800' }}>
        <a href={match.url} target="_blank" rel="noreferrer" style={{ color: '#ffffff', textDecoration: 'underline' }}>
          {match.uniName}
        </a>
      </h4>
      <div style={{ marginBottom: '14px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>
          Target degree program
        </span>
        <strong style={{ fontSize: '1.05rem', color: programColor, fontWeight: '800' }}>
          {match.programName}
        </strong>
      </div>
      <div>
        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
          Admission criteria
        </span>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5' }}>{match.criteriaText}</p>
      </div>
      {match.isUnderScore && variant === 'match' && (
        <div
          style={{
            marginTop: '16px',
            padding: '10px 14px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: '#fca5a5',
          }}
        >
          <strong>Conditional track:</strong> Your average ({studentProfile.highSchoolAvg}%) is below the typical
          index of {match.minOverallPercent}% for this program.
        </div>
      )}
      {match.subjectFlags?.length > 0 && variant === 'match' && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid #f59e0b',
            borderRadius: '6px',
            fontSize: '0.78rem',
            color: '#fcd34d',
          }}
        >
          {match.subjectFlags.map((flag) => (
            <div key={flag} style={{ marginBottom: match.subjectFlags.length > 1 ? '4px' : 0 }}>
              {flag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [flowPhase, setFlowPhase] = useState('landing');
  const [studentProfile, setStudentProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('dubai');
  const [sidebarTrack, setSidebarTrack] = useState('law');
  const [matchingResults, setMatchingResults] = useState([]);
  const [alternativeResults, setAlternativeResults] = useState([]);
  const [resolvedTrack, setResolvedTrack] = useState(null);
  const [matchError, setMatchError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const resetSession = () => {
    setStudentProfile(null);
    setMatchingResults([]);
    setAlternativeResults([]);
    setResolvedTrack(null);
    setMatchError(null);
    setFlowPhase('landing');
  };

  const handleFormSubmit = (profileData) => {
    setStudentProfile(profileData);
    setSidebarTrack(profileData.track);
    setActiveTab(profileData.emirate === 'all' ? 'dubai' : profileData.emirate);
    setIsProcessing(true);

    const profilePayload = buildChatProfilePayload(profileData, profileData.track);
    if (profilePayload.email) {
      fetch('/api/log-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profilePayload),
      }).catch(() => {});
    }

    setTimeout(() => {
      const { track, matches, alternatives, error } = matchPrograms(programs, universities, {
        emirate: profileData.emirate,
        highSchoolAvg: profileData.highSchoolAvg,
        stream: profileData.stream,
        subjectMarks: profileData.subjectMarks,
        englishTestType: profileData.englishTestType,
        englishTestScore: profileData.englishTestScore,
        track: profileData.track,
        interest: profileData.interest,
        degreeLevel: 'undergraduate',
      });

      setResolvedTrack(track);
      setMatchError(error);
      setMatchingResults(matches);
      setAlternativeResults(alternatives);
      setIsProcessing(false);
    }, 600);
  };

  const sidebarSections = programsByEmirate(
    programs.filter((p) => p.track === sidebarTrack),
    activeTab
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--masar-bg-page, #0b0f19)', color: 'var(--masar-text-secondary, #f3f4f6)' }}>
      <AppHeader />

      <main
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '40px',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 20px',
        }}
      >
        <section style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              background: 'var(--masar-status-gradient)',
              border: '1px solid var(--masar-border)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '500' }}>
                K2 Think V2 Processing Engine:{' '}
                <strong style={{ color: '#10b981' }}>Online</strong>
              </span>
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                background: 'rgba(255, 107, 61, 0.15)',
                color: '#ff6b3d',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: '700',
              }}
            >
              SPONSORED VIA MBZUAI
            </div>
          </div>

          {!studentProfile ? (
            <>
              {flowPhase === 'landing' && (
                <LandingChoice
                  onExplore={() => setFlowPhase('explore')}
                  onDirect={() => setFlowPhase('direct')}
                />
              )}
              {flowPhase === 'explore' && (
                <ExploreWizard onSubmit={handleFormSubmit} onBack={() => setFlowPhase('landing')} />
              )}
              {flowPhase === 'direct' && (
                <FormInput onSubmit={handleFormSubmit} onBack={() => setFlowPhase('landing')} />
              )}
            </>
          ) : (
            <div
              style={{
                width: '100%',
                background: 'var(--masar-bg-card)',
                padding: '32px',
                borderRadius: '16px',
                border: '1px solid var(--masar-border)',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                  borderBottom: '1px solid #1e293b',
                  paddingBottom: '12px',
                }}
              >
                <div>
                  <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.25rem', fontWeight: '700' }}>
                    Universities that fit you
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {studentProfile.discoveryMode && (
                      <span style={{ color: '#38bdf8', marginRight: '6px' }}>Explore mode ·</span>
                    )}
                    {studentProfile.subTrackMeta && (
                      <span
                        style={{
                          color: studentProfile.subTrackMeta.accent,
                          fontWeight: 700,
                          marginRight: '6px',
                        }}
                      >
                        {studentProfile.subTrackMeta.label} ·
                      </span>
                    )}
                    {resolvedTrack
                      ? `${TRACK_LABELS[resolvedTrack]} · ${studentProfile.emirate === 'all' ? 'All Emirates' : studentProfile.emirate} · ${studentProfile.stream.replace(/_/g, ' ')}`
                      : 'Processing…'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetSession}
                  style={{
                    padding: '8px 14px',
                    background: '#1f2937',
                    color: '#f3f4f6',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                  }}
                >
                  New pathway
                </button>
              </div>

              {isProcessing ? (
                <div style={{ color: '#94a3b8', fontSize: '0.95rem', padding: '6px 0', textAlign: 'center' }}>
                  Activating pathway matching engine…
                </div>
              ) : matchError === 'TRACK_UNRESOLVED' ? (
                <div
                  style={{
                    color: '#ff6b3d',
                    padding: '20px',
                    background: 'rgba(224, 83, 27, 0.05)',
                    border: '1px dashed #ff6b3d',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                  }}
                >
                  Could not determine your track. Select Law, Technology, or Business above.
                </div>
              ) : matchingResults.length === 0 && alternativeResults.length === 0 ? (
                <div
                  style={{
                    color: '#ff6b3d',
                    padding: '20px',
                    background: 'rgba(224, 83, 27, 0.05)',
                    border: '1px dashed #ff6b3d',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                  }}
                >
                  No undergraduate {TRACK_LABELS[resolvedTrack]?.toLowerCase()} programs catalogued for this emirate yet.
                  Try &quot;All Emirates&quot; or expand{' '}
                  <code style={{ color: '#fbbf24' }}>src/data/programs.json</code>.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {studentProfile.subTrack && (
                    <SubTrackHeroCard subTrackId={studentProfile.subTrack} isTopPick />
                  )}
                  <AdvisorInsightBox insight={studentProfile.advisorInsight} />

                  {matchingResults.length === 0 && alternativeResults.length > 0 && (
                    <div
                      style={{
                        padding: '14px 16px',
                        background: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid #f59e0b',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#fcd34d',
                        lineHeight: 1.5,
                      }}
                    >
                      No direct matches for your <strong>curriculum stream</strong> in this emirate. Below are related
                      programs that usually need Advanced Stream, foundation year, or placement — still useful to explore.
                    </div>
                  )}

                  {matchingResults.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      studentProfile={studentProfile}
                      subTrackAccent={studentProfile.subTrackMeta?.accent}
                    />
                  ))}

                  {alternativeResults.length > 0 && matchingResults.length > 0 && (
                    <>
                      <h4 style={{ margin: '8px 0 0', color: '#f59e0b', fontSize: '0.9rem', fontWeight: '700' }}>
                        Also in this emirate (may need Advanced Stream or foundation)
                      </h4>
                      {alternativeResults.map((match) => (
                        <MatchCard key={match.id} match={match} studentProfile={studentProfile} variant="alternative" />
                      ))}
                    </>
                  )}

                  {matchingResults.length === 0 &&
                    alternativeResults.map((match) => (
                      <MatchCard key={match.id} match={match} studentProfile={studentProfile} variant="alternative" />
                    ))}

                  <K2CounselorPanel
                    key={`k2-${studentProfile.highSchoolAvg}-${[...matchingResults, ...alternativeResults].map((m) => m.id).join(',')}`}
                    studentProfile={studentProfile}
                    matchingResults={[...matchingResults, ...alternativeResults]}
                    resolvedTrack={resolvedTrack}
                  />
                </div>
              )}
            </div>
          )}
        </section>

        <section
          style={{
            flex: '1 1 320px',
            maxWidth: '480px',
            background: 'var(--masar-bg-header)',
            border: '1px solid var(--masar-border)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--masar-shadow)',
            height: 'fit-content',
          }}
        >
          {!studentProfile ? (
            <HowMasarWorksSidebar showExploreHint={flowPhase === 'landing'} />
          ) : (
            <>
          <h3
            style={{
              margin: '0 0 4px 0',
              fontSize: '1rem',
              fontWeight: '700',
              color: 'var(--masar-text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Knowledge base reference
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', color: 'var(--masar-text-dim)' }}>
            Catalogued {TRACK_LABELS[sidebarTrack]} programs — not your live match list.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
            {['dubai', 'abudhabi', 'sharjah'].map((loc) => (
              <button
                key={loc}
                type="button"
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
                  textTransform: 'capitalize',
                }}
              >
                {loc === 'abudhabi' ? 'Abu Dhabi' : loc}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            {['law', 'tech', 'business'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSidebarTrack(t)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: sidebarTrack === t ? '#38bdf8' : '#1e293b',
                  background: sidebarTrack === t ? 'rgba(56, 189, 248, 0.1)' : '#111827',
                  color: sidebarTrack === t ? '#38bdf8' : '#94a3b8',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {TRACK_LABELS[t]}
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
            {sidebarSections.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                No {TRACK_LABELS[sidebarTrack].toLowerCase()} programs catalogued for this emirate yet. Add entries to{' '}
                programs.json.
              </p>
            ) : (
              sidebarSections.map((sec) => (
                <div key={sec.title} style={{ marginBottom: '16px' }}>
                  <h5
                    style={{
                      margin: '0 0 8px 0',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      borderLeft: '3px solid #ff6b3d',
                      paddingLeft: '8px',
                    }}
                  >
                    {sec.title}
                  </h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {sec.programs.map((prog) => (
                      <span
                        key={prog.id}
                        style={{
                          fontSize: '0.7rem',
                          background: '#131a26',
                          color: '#cbd5e1',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          border: '1px solid #1e293b',
                        }}
                      >
                        {prog.programName}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
            </>
          )}
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
