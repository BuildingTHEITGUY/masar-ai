import React, { useState, useMemo } from 'react';

import {

  INTEREST_OPTIONS,

  PRIORITY_OPTIONS,

  suggestPathways,

  buildExploreInterestText,

} from '../lib/resolveTrackFromExplore';

import {

  WIZARD_STEP,

  needsBehavioralSorter,

  resolveBehavioralBranch,

  getQuizForBranch,

  resolveSubTrackFromOption,

  getSubTrackMeta,

  computeAdvisorInsight,

  getWizardProgress,

  getPreviousStep,

  getNextStepFromInterests,
  interestTriggersBehavioral,

} from '../lib/behavioralSorter';

import BehavioralSorterStep from './BehavioralSorterStep';

import { SubTrackHeroCard, AdvisorInsightBox } from './SubTrackPathwayCard';



const labelStyle = {

  display: 'block',

  fontSize: '0.85rem',

  fontWeight: '600',

  color: '#94a3b8',

  marginBottom: '6px',

  letterSpacing: '0.03em',

};



const inputStyle = {

  width: '100%',

  padding: '14px',

  borderRadius: '8px',

  border: '1px solid #334155',

  backgroundColor: '#131a26',

  color: '#f8fafc',

  fontSize: '0.95rem',

  boxSizing: 'border-box',

  outline: 'none',

};



const shellStyle = {

  padding: '36px 40px',

  background: '#0b0f19',

  borderRadius: '16px',

  border: '1px solid #1e293b',

  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',

};



function StepDots({ step, hasBehavioral }) {

  const { index, total } = getWizardProgress(step, hasBehavioral);

  return (

    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }} role="progressbar" aria-valuenow={index + 1} aria-valuemax={total}>

      {Array.from({ length: total }, (_, i) => (

        <div

          key={i}

          style={{

            flex: 1,

            height: '4px',

            borderRadius: '2px',

            background: i <= index ? '#38bdf8' : '#334155',

          }}

        />

      ))}

    </div>

  );

}



function SelectCard({ selected, onClick, emoji, label, showBehavioralBadge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: showBehavioralBadge ? '10px' : '0',
        padding: '14px 16px',
        borderRadius: '10px',
        border: `2px solid ${selected ? '#38bdf8' : '#334155'}`,
        background: selected ? 'rgba(56,189,248,0.12)' : '#131a26',
        cursor: 'pointer',
        textAlign: 'left',
        color: '#e2e8f0',
        fontSize: '0.88rem',
        lineHeight: 1.45,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ flexShrink: 0, lineHeight: 1.35 }} aria-hidden>
          {emoji}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>{label}</span>
      </span>
      {showBehavioralBadge && (
        <span
          style={{
            alignSelf: 'flex-start',
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#38bdf8',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            padding: '3px 8px',
            borderRadius: '4px',
            lineHeight: 1.2,
          }}
        >
          Includes Step 2.5 quiz
        </span>
      )}
    </button>
  );
}



function getStepLabel(step) {
  switch (step) {
    case WIZARD_STEP.PROFILE:
      return 'Step 1';
    case WIZARD_STEP.INTERESTS:
      return 'Step 2';
    case WIZARD_STEP.BEHAVIORAL:
      return 'Step 2.5';
    case WIZARD_STEP.PRIORITIES:
      return 'Step 3';
    case WIZARD_STEP.PATHWAYS:
      return 'Step 4';
    default:
      return '';
  }
}



export default function ExploreWizard({ onSubmit, onBack }) {

  const [step, setStep] = useState(WIZARD_STEP.PROFILE);

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [nationality, setNationality] = useState('UAE');

  const [stream, setStream] = useState('moe_general');

  const [emirate, setEmirate] = useState('dubai');

  const [highSchoolAvg, setHighSchoolAvg] = useState('');

  const [emsatMath, setEmsatMath] = useState('');

  const [interests, setInterests] = useState([]);

  const [priorities, setPriorities] = useState([]);

  const [subTrack, setSubTrack] = useState(null);

  const [behavioralOptionId, setBehavioralOptionId] = useState(null);

  const [chosenTrack, setChosenTrack] = useState(null);



  const hasBehavioral = useMemo(() => needsBehavioralSorter(interests), [interests]);

  const behavioralBranch = useMemo(() => resolveBehavioralBranch(interests), [interests]);



  const subTrackMeta = useMemo(() => getSubTrackMeta(subTrack), [subTrack]);



  const advisorInsight = useMemo(

    () => computeAdvisorInsight(subTrack, priorities),

    [subTrack, priorities]

  );



  const suggestions = useMemo(

    () =>

      step >= WIZARD_STEP.PATHWAYS

        ? suggestPathways(interests, priorities, stream, subTrack)

        : [],

    [step, interests, priorities, stream, subTrack]

  );



  const toggleInterest = (id) => {

    setInterests((prev) => {

      if (prev.includes(id)) return prev.filter((x) => x !== id);

      if (prev.length >= 2) return prev;

      return [...prev, id];

    });

    setBehavioralOptionId(null);

    setSubTrack(null);

  };



  const togglePriority = (id) => {

    setPriorities((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  };



  const finishWithTrack = (track) => {

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      nationality: nationality.trim(),
      stream,
      emirate,
      track,
      highSchoolAvg: parseFloat(highSchoolAvg) || 0,
      emsatMath: emsatMath ? parseInt(emsatMath, 10) : null,
      interest: buildExploreInterestText(interests, priorities, subTrack),
      discoveryMode: true,
      subTrack,
      subTrackMeta,
      advisorInsight: computeAdvisorInsight(subTrack, priorities),
    });

  };



  const canNextStep0 =
    name.trim() &&
    email.trim() &&
    highSchoolAvg &&
    parseFloat(highSchoolAvg) >= 50;

  const canNextStep1 = interests.length >= 1;



  const goToPathways = () => {

    const ranked = suggestPathways(interests, priorities, stream, subTrack);

    const preferredTrack = subTrackMeta?.track ?? ranked[0]?.track ?? 'business';

    setChosenTrack(preferredTrack);

    setStep(WIZARD_STEP.PATHWAYS);

  };



  const handleBack = () => {

    const prev = getPreviousStep(step, hasBehavioral);

    if (prev === null) onBack();

    else setStep(prev);

  };



  const handleBehavioralSelect = (optionId) => {

    setBehavioralOptionId(optionId);

    const quiz = getQuizForBranch(behavioralBranch);

    const option = quiz.options.find((o) => o.id === optionId);

    setSubTrack(resolveSubTrackFromOption(option));

  };



  const handleContinueFromInterests = () => {

    setStep(getNextStepFromInterests(hasBehavioral));

  };



  const backLabel =

    step === WIZARD_STEP.PROFILE ? 'Back to start' : 'Previous step';



  return (

    <div style={shellStyle}>

      <button

        type="button"

        onClick={handleBack}

        style={{

          background: 'none',

          border: 'none',

          color: '#64748b',

          cursor: 'pointer',

          fontSize: '0.8rem',

          marginBottom: '12px',

          padding: 0,

        }}

      >

        ← {backLabel}

      </button>



      <StepDots step={step} hasBehavioral={hasBehavioral} />



      {step === WIZARD_STEP.PROFILE && (

        <>

          <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 700 }}>

            Step 1 — About your high school

          </h2>

          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 24px', lineHeight: 1.5 }}>
            Basic facts so Masar can check which UAE programs you qualify for — and email your pathway.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <div>
              <label style={labelStyle}>Your name *</label>
              <input
                type="text"
                placeholder="e.g. Sara Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Nationality</label>
              <input
                type="text"
                placeholder="e.g. UAE"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>

            <label style={labelStyle}>Which high school system did you follow?</label>

            <select value={stream} onChange={(e) => setStream(e.target.value)} style={inputStyle}>

              <option value="moe_general">UAE MoE — General Stream</option>

              <option value="moe_advanced">UAE MoE — Advanced Stream</option>

              <option value="british_alevels">British Curriculum (A-Levels)</option>

              <option value="american_diploma">American Diploma</option>

            </select>

          </div>



          <div

            style={{

              display: 'grid',

              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',

              gap: '16px',

              marginBottom: '20px',

            }}

          >

            <div>

              <label style={labelStyle}>Your overall average (%)</label>

              <input

                type="number"

                min="50"

                max="100"

                placeholder="e.g. 78"

                value={highSchoolAvg}

                onChange={(e) => setHighSchoolAvg(e.target.value)}

                style={inputStyle}

              />

            </div>

            <div>

              <label style={labelStyle}>EmSAT Math (optional)</label>

              <input

                type="number"

                placeholder="Haven't taken it yet"

                value={emsatMath}

                onChange={(e) => setEmsatMath(e.target.value)}

                style={inputStyle}

              />

            </div>

          </div>



          <div style={{ marginBottom: '28px' }}>

            <label style={labelStyle}>Where would you prefer to study?</label>

            <select value={emirate} onChange={(e) => setEmirate(e.target.value)} style={inputStyle}>

              <option value="dubai">Dubai</option>

              <option value="abudhabi">Abu Dhabi</option>

              <option value="sharjah">Sharjah</option>

              <option value="all">Open to all emirates</option>

            </select>

          </div>



          <button

            type="button"

            disabled={!canNextStep0}

            onClick={() => setStep(WIZARD_STEP.INTERESTS)}

            style={{

              width: '100%',

              padding: '14px',

              borderRadius: '8px',

              border: 'none',

              background: canNextStep0 ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)' : '#334155',

              color: '#0f172a',

              fontWeight: 700,

              cursor: canNextStep0 ? 'pointer' : 'not-allowed',

            }}

          >

            Continue →

          </button>

        </>

      )}



      {step === WIZARD_STEP.INTERESTS && (

        <>

          <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 700 }}>

            Step 2 — What do you enjoy?

          </h2>

          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 12px' }}>
            Pick up to <strong style={{ color: '#38bdf8' }}>2</strong> that feel closest to you (macro enjoyment).
          </p>

          <p
            style={{
              color: '#64748b',
              fontSize: '0.78rem',
              margin: '0 0 16px',
              lineHeight: 1.5,
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid #334155',
            }}
          >
            {hasBehavioral ? (
              <>
                <strong style={{ color: '#38bdf8' }}>Step 2.5 unlocks next</strong> — a short behavioral quiz
                narrows your path (engineering, science, or digital tech).
              </>
            ) : (
              <>
                <strong style={{ color: '#94a3b8' }}>No Step 2.5</strong> for Business / Law / Unsure only — you
                go straight to value drivers. Pick 🔧 Building, 🔬 Science, 🎨 Creative, or 💻 Computers to unlock
                the quiz.
              </>
            )}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '10px',
              marginBottom: '28px',
            }}
          >
            {INTEREST_OPTIONS.map((opt) => (
              <SelectCard
                key={opt.id}
                emoji={opt.emoji}
                label={opt.label}
                selected={interests.includes(opt.id)}
                showBehavioralBadge={interestTriggersBehavioral(opt.id)}
                onClick={() => toggleInterest(opt.id)}
              />
            ))}
          </div>

          <button
            type="button"
            disabled={!canNextStep1}
            onClick={handleContinueFromInterests}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: canNextStep1 ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)' : '#334155',
              color: '#0f172a',
              fontWeight: 700,
              cursor: canNextStep1 ? 'pointer' : 'not-allowed',
            }}
          >
            {hasBehavioral ? 'Continue to Step 2.5 →' : 'Continue to Step 3 →'}
          </button>

        </>

      )}



      {step === WIZARD_STEP.BEHAVIORAL && (

        <BehavioralSorterStep

          branch={behavioralBranch}

          selectedOptionId={behavioralOptionId}

          onSelect={handleBehavioralSelect}

          canContinue={Boolean(subTrack)}

          onContinue={() => setStep(WIZARD_STEP.PRIORITIES)}

        />

      )}



      {step === WIZARD_STEP.PRIORITIES && (

        <>

          <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 700 }}>

            {getStepLabel(step)} — What matters to you?

          </h2>

          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 20px' }}>

            Value drivers — select any that apply. This helps rank your best pathways.

          </p>



          {subTrackMeta && (

            <p

              style={{

                margin: '0 0 16px',

                padding: '10px 12px',

                borderRadius: '8px',

                background: 'rgba(56, 189, 248, 0.08)',

                border: '1px solid rgba(56, 189, 248, 0.2)',

                fontSize: '0.8rem',

                color: '#bae6fd',

              }}

            >

              Your behavioral focus:{' '}

              <strong style={{ color: subTrackMeta.accent, fontWeight: 800 }}>

                {subTrackMeta.label}

              </strong>

            </p>

          )}



          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>

            {PRIORITY_OPTIONS.map((opt) => (

              <SelectCard

                key={opt.id}

                emoji={priorities.includes(opt.id) ? '✓' : '○'}

                label={opt.label}

                selected={priorities.includes(opt.id)}

                onClick={() => togglePriority(opt.id)}

              />

            ))}

          </div>



          <button

            type="button"

            onClick={goToPathways}

            style={{

              width: '100%',

              padding: '14px',

              borderRadius: '8px',

              border: 'none',

              background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',

              color: '#0f172a',

              fontWeight: 700,

              cursor: 'pointer',

            }}

          >

            See my suggested pathways →

          </button>

        </>

      )}



      {step === WIZARD_STEP.PATHWAYS && (

        <>

          <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 700 }}>

            {getStepLabel(step)} — Your suggested directions

          </h2>

          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 20px', lineHeight: 1.5 }}>

            Based on your profile, interests, and behavioral sorting — pick a direction to see real UAE

            universities.

          </p>



          <AdvisorInsightBox insight={advisorInsight} />



          {subTrack && <SubTrackHeroCard subTrackId={subTrack} isTopPick />}



          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>

            {suggestions.map((s, idx) => {

              const isSubTrackPrimary = subTrackMeta?.track === s.track && idx === 0;

              if (subTrack && isSubTrackPrimary) return null;



              return (

                <button

                  key={s.track}

                  type="button"

                  onClick={() => setChosenTrack(s.track)}

                  style={{

                    padding: '18px',

                    borderRadius: '12px',

                    border: `2px solid ${chosenTrack === s.track ? '#ff6b3d' : '#334155'}`,

                    background: chosenTrack === s.track ? 'rgba(255,107,61,0.1)' : '#131a26',

                    cursor: 'pointer',

                    textAlign: 'left',

                  }}

                >

                  <div

                    style={{

                      display: 'flex',

                      justifyContent: 'space-between',

                      alignItems: 'center',

                      marginBottom: '6px',

                      flexWrap: 'wrap',

                      gap: '8px',

                    }}

                  >

                    <strong style={{ color: '#f8fafc', fontSize: '1rem' }}>{s.title}</strong>

                    {idx === 0 && !subTrack && (

                      <span

                        style={{

                          fontSize: '0.65rem',

                          background: '#10b981',

                          color: '#fff',

                          padding: '2px 8px',

                          borderRadius: '4px',

                          fontWeight: 700,

                        }}

                      >

                        BEST FIT

                      </span>

                    )}

                  </div>

                  <p style={{ margin: '0 0 6px', fontSize: '0.8rem', color: '#38bdf8' }}>{s.degrees}</p>

                  <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.45 }}>

                    {s.why}

                  </p>

                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>

                    <strong style={{ color: '#cbd5e1' }}>Careers:</strong> {s.careers}

                  </p>

                </button>

              );

            })}

          </div>



          <button

            type="button"

            disabled={!chosenTrack}

            onClick={() => finishWithTrack(chosenTrack)}

            style={{

              width: '100%',

              padding: '16px',

              borderRadius: '8px',

              border: 'none',

              background: 'linear-gradient(135deg, #ff6b3d 0%, #e0531b 100%)',

              color: '#fff',

              fontWeight: 700,

              fontSize: '1rem',

              cursor: chosenTrack ? 'pointer' : 'not-allowed',

              boxShadow: '0 4px 20px rgba(224, 83, 27, 0.3)',

            }}

          >

            Show universities for this path →

          </button>

        </>

      )}

    </div>

  );

}

