import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import './Section.css';
import { FiMail, FiLinkedin, FiInstagram, FiGithub, FiArrowRight, FiCopy, FiCheck, FiLayers } from 'react-icons/fi';
import Experience from './Experience';
import Typewriter from '../components/Typewriter';

function Intro() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const email = "iacolareandrea@outlook.it";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <section className="section intro-hero">
        {/* Availability Badge */}
        <div className="status-pill">
          <span className="status-dot"></span>
          <span>{t.AvailableForWork}</span>
        </div>

        {/* Hero Title */}
        <h1 className="hero-title">
          <span style={{ display: 'block', fontSize: '0.42em', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            {t.HeroGreeting}
          </span>
          <span className="text-gradient">
            <Typewriter text={t.Intro} delay={120} />
          </span>
        </h1>

        {/* Hero Bio */}
        <p className="hero-subtitle">
          {t.IntroText}
        </p>

        {/* CTA Buttons */}
        <div className="hero-actions">
          <button 
            onClick={() => navigate('/projects')} 
            className="btn-primary"
            title={t.ViewProjects}
          >
            <FiLayers />
            <span>{t.ViewProjects}</span>
            <FiArrowRight />
          </button>

          <button 
            onClick={() => navigate('/contact')} 
            className="btn-secondary"
            title={t.ContactMe}
          >
            <FiMail />
            <span>{t.ContactMe}</span>
          </button>

          <button 
            onClick={handleCopyEmail} 
            className="btn-secondary"
            title={copied ? t.EmailCopied : t.CopyEmail}
          >
            {copied ? <FiCheck style={{ color: 'var(--accent-emerald)' }} /> : <FiCopy />}
            <span>{copied ? (language === 'it' ? 'Copiata!' : 'Copied!') : (language === 'it' ? 'Copia Email' : 'Copy Email')}</span>
          </button>
        </div>

        {/* Social Links */}
        <div className="hero-socials">
          <a 
            href={`mailto:${email}`} 
            className="social-btn" 
            title={t.Email}
            aria-label="Email"
          >
            <FiMail />
          </a>
          <a 
            href="https://github.com/andree23-i" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-btn" 
            title={t.GitHub || 'GitHub'}
            aria-label="GitHub"
          >
            <FiGithub />
          </a>
          <a 
            href="https://www.linkedin.com/in/andrea-iacolare-a626a233a/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-btn" 
            title={t.LinkedIn}
            aria-label="LinkedIn"
          >
            <FiLinkedin />
          </a>
          <a 
            href="https://www.instagram.com/andreaiacolare_/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-btn" 
            title={t.Instagram}
            aria-label="Instagram"
          >
            <FiInstagram />
          </a>
        </div>

        {/* Secret Admin Button in top-right corner */}
        <div 
          onClick={() => navigate('/admin')}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '20px',
            height: '20px',
            background: 'transparent',
            borderRadius: '50%',
            cursor: 'default',
            zIndex: 100
          }}
          title=""
          aria-hidden="true"
        />
      </section>
      
      <Experience />
    </>
  );
}

export default Intro;

