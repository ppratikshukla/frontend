import React from 'react';

const AboutPage = () => {
  return (
    <div className="about-page-container" style={{ padding: '10px 0' }}>
      <div className="page-header">
        <h1 className="page-title">About Developer</h1>
        <p className="page-subtitle">A little bit about the creator of this application</p>
      </div>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '40px',
        textAlign: 'center',
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'relative',
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          padding: '4px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          marginBottom: '20px',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
        }}>
          <img 
            src="https://github.com/ppratikshukla.png" 
            alt="Pratik Shukla"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid var(--bg2)'
            }}
          />
        </div>
        <h2 style={{ fontSize: '2rem', color: 'var(--text)', marginBottom: '5px', fontWeight: '800' }}>Pratik Shukla</h2>
        <p style={{ color: 'var(--text3)', fontSize: '0.95rem', marginBottom: '25px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Full Stack Developer</p>
        
        <p style={{ 
          color: 'var(--text2)', 
          lineHeight: '1.8', 
          maxWidth: '650px', 
          margin: '0 auto 35px auto',
          fontSize: '1.05rem'
        }}>
          Hi there! I'm a passionate developer who loves building beautiful, functional, and user-friendly web applications. 
          I built this Attendance Tracker to help students easily manage their own attendance records, analyze their patterns, 
          and ensure they always stay above the necessary limits without the stress.
        </p>
        
        <a 
          href="https://github.com/ppratikshukla" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ display: 'inline-flex', width: 'auto', textDecoration: 'none', padding: '14px 28px', fontSize: '1rem', borderRadius: '100px' }}
        >
          <svg style={{ width: '22px', height: '22px', fill: 'currentColor' }} viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Visit My GitHub
        </a>
      </div>
    </div>
  );
};

export default AboutPage;
