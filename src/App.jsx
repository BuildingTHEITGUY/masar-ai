import React, { useState } from 'react';
import FormInput from './components/FormInput';
import frameworkData from './data/framework.json';

export default function App() {
  const [studentProfile, setStudentProfile] = useState(null);

  const handleFormSubmit = (profileData) => {
    setStudentProfile(profileData);
    console.log("Captured Student Profile Data:", profileData);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', minHeight: '100vh', background: '#fff' }}>
      <header style={{ background: '#111', color: '#fff', padding: '20px', textAlign: 'center', borderBottom: '4px solid #e0531b' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', tracking: 'wide' }}>MASAR AI</h1>
        <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '0.9rem' }}>Beyond Theory. Building Reality.</p>
      </header>

      <main style={{ padding: '40px 20px' }}>
        {!studentProfile ? (
          <FormInput onSubmit={handleFormSubmit} />
        ) : (
          <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
            <div style={{ background: '#e0f7fa', padding: '20px', borderRadius: '8px', border: '1px solid #00acc1' }}>
              <h3>Profile Successfully Processed!</h3>
              <p>Ready to feed this data matrix into the K2 Think V2 reasoning core once API access is granted.</p>
            </div>
            <button onClick={() => setStudentProfile(null)} style={{ marginTop: '20px', padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Reset Profile
            </button>
          </div>
        )}
      </main>
    </div>
  );
}