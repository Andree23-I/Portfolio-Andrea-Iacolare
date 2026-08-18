import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import './Section.css';
import { FiMail, FiLinkedin, FiInstagram, FiArrowDown } from 'react-icons/fi';
import Experience from './Experience';
import Typewriter from '../components/Typewriter';

function Intro() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];
  const navigate = useNavigate();

  return (
    <>
      <section className="section intro">
        <div className="intro-text-content">
          <h1>
            <span style={{ display: 'block', fontSize: '0.5em', marginBottom: '0.5rem', fontWeight: 400, color: 'var(--text-muted)' }}>Hello, I am</span>
            <span className="text-accent"><Typewriter text={t.Intro} delay={150} /></span>
          </h1>
          <p className="fade-in-text">{t.IntroText}</p>
          
          <div className="social-links">
            <a href="mailto:iacolareandrea@outlook.it" target="_blank" rel="noopener noreferrer" title={t.Email}>
              <FiMail />
            </a>
            <a href="https://www.instagram.com/andreaiacolare_/" target="_blank" rel="noopener noreferrer" title={t.Instagram}>
              <FiInstagram />
            </a>
            <a href="https://www.linkedin.com/in/andrea-iacolare-a626a233a/" target="_blank" rel="noopener noreferrer" title={t.LinkedIn}>
              <FiLinkedin />
            </a>
          </div>
          
          <div style={{ marginTop: '3rem', opacity: 0.5, animation: 'bounce 2s infinite' }}>
             <FiArrowDown size={32} />
          </div>
        </div>

        {/* Secret Admin Button */}
        <div 
          onClick={() => navigate('/admin')}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '15px',
            height: '15px',
            background: 'transparent',
            borderRadius: '50%',
            cursor: 'default',
            zIndex: 100
          }}
          title=""
        />
      </section>
      
      <Experience />
    </>
  );
}

export default Intro;
