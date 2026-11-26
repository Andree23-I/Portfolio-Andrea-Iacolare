import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import './Section.css';
import { 
  FiArrowUpRight, 
  FiMail, 
  FiLinkedin, 
  FiInstagram, 
  FiGithub, 
  FiCheck, 
  FiCode,
  FiActivity,
  FiShield,
  FiZap
} from 'react-icons/fi';
import Experience from './Experience';
import profilePhoto from '../Foto CV.jpeg';

function Intro() {
  const { language } = useContext(SettingsContext);
  const t = translations[language] || translations.it;
  const navigate = useNavigate();
  
  const [copied, setCopied] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  const email = "iacolareandrea9@gmail.com";

  // Live European Telemetry Clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = now.toLocaleTimeString(language === 'en' ? 'en-GB' : 'it-IT', {
          timeZone: 'Europe/Rome',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        setTimeStr(`${formatted} CET`);
      } catch {
        setTimeStr('17:35 CET');
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [language]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* ==========================================================================
          HERO: MONUMENTAL ARCHITECTURAL INTRO
          ========================================================================== */}
      <section className="section architectural-hero">
        {/* Live Telemetry Strip */}
        <div className="telemetry-bar">
          <div className="telemetry-item coordinates">
            <span className="telemetry-label">[ LOC ]</span>
            <span className="telemetry-val">40.68° N, 14.76° E • SALERNO, IT</span>
          </div>

          <div className="telemetry-divider" />

          <div className="telemetry-item time-display">
            <span className="telemetry-label">[ TIME ]</span>
            <span className="telemetry-val font-mono-tag">{timeStr || 'LIVE CET'}</span>
          </div>

          <div className="telemetry-divider" />

          <div className="telemetry-item system-status">
            <span className="telemetry-dot" />
            <span className="telemetry-val font-mono-tag">{t.AvailableForWork || 'OPERATIONAL // ACCEPTING COMMISSIONS'}</span>
          </div>
        </div>

        {/* Asymmetrical Split Stage */}
        <div className="hero-split-stage">
          {/* Left Column: Monumental Identity & Manifesto */}
          <div className="hero-identity-col">
            <div className="hero-role-badge">
              <span className="role-bracket">[</span>
              <span className="role-text">{t.AboutRole || 'FULL-STACK WEB & AI DEVELOPER'}</span>
              <span className="role-bracket">]</span>
            </div>

            <h1 className="hero-monumental-name">
              <span className="name-line">ANDREA</span>
              <span className="name-line name-accent">IACOLARE</span>
            </h1>

            <p className="hero-manifesto-text">
              {t.IntroText || 'Full-Stack & AI Developer specializzato nella realizzazione di architetture web moderne ad alte prestazioni, interfacce reattive ed esperienze digitali intuitive.'}
            </p>

            {/* Quick Actions Matrix */}
            <div className="hero-cta-matrix">
              <button 
                onClick={() => navigate('/projects')} 
                className="btn-primary"
                title={t.ViewProjects}
              >
                <span>{t.ViewProjects || 'Esplora i Progetti'}</span>
                <FiArrowUpRight size={18} />
              </button>

              <button 
                onClick={handleCopyEmail}
                className="btn-secondary"
                title={t.CopyEmail}
              >
                {copied ? (
                  <>
                    <FiCheck size={16} style={{ color: '#10b981' }} />
                    <span>{t.EmailCopied || 'Copiato!'}</span>
                  </>
                ) : (
                  <>
                    <FiMail size={16} />
                    <span>{t.CopyEmail || 'Copia Email'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Architectural Telemetry Badges Grid */}
            <div className="hero-spec-grid">
              <div className="spec-cell">
                <span className="spec-index">[ 01 ]</span>
                <span className="spec-title">CORE STACK</span>
                <span className="spec-value">React 18 • Next.js 15 • Vite</span>
              </div>
              <div className="spec-cell">
                <span className="spec-index">[ 02 ]</span>
                <span className="spec-title">AI & SYSTEMS</span>
                <span className="spec-value">Agentic Automations & APIs</span>
              </div>
              <div className="spec-cell">
                <span className="spec-index">[ 03 ]</span>
                <span className="spec-title">EXPERIENCE</span>
                <span className="spec-value">2+ Yrs Continuous Delivery</span>
              </div>
              <div className="spec-cell">
                <span className="spec-index">[ 04 ]</span>
                <span className="spec-title">FOCUS</span>
                <span className="spec-value">Ultra-Fast & Precision UI</span>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Visual Specimen Card */}
          <div className="hero-specimen-col">
            <div className="architectural-portrait-frame">
              {/* Corner Brackets */}
              <div className="corner-bracket top-left">+</div>
              <div className="corner-bracket top-right">+</div>
              <div className="corner-bracket bottom-left">+</div>
              <div className="corner-bracket bottom-right">+</div>

              {/* Card Header Specimen Bar */}
              <div className="specimen-header-bar">
                <span className="specimen-tag font-mono-tag">SPECIMEN // AI-01</span>
                <span className="specimen-hash font-mono-tag">SHA-256: 7F29B</span>
              </div>

              {/* Portrait Image Container */}
              <div className="specimen-img-wrap">
                <img 
                  src={profilePhoto} 
                  alt="Andrea Iacolare | Full-Stack & AI Developer" 
                  className="specimen-portrait-img"
                />
                <div className="specimen-scanline-overlay" />
                <div className="specimen-gradient-scrim" />
              </div>

              {/* Floating Architectural Overlay Tags */}
              <div className="specimen-overlay-data">
                <div className="specimen-name-row">
                  <span className="specimen-subject-name">Andrea Iacolare</span>
                  <span className="specimen-active-pill">VERIFIED PRO</span>
                </div>
                
                <div className="specimen-chips">
                  <span className="chip">Next.js 15</span>
                  <span className="chip">React</span>
                  <span className="chip">TypeScript</span>
                  <span className="chip">Tailwind</span>
                  <span className="chip">AI Agents</span>
                </div>
              </div>
            </div>

            {/* Social Signal Bar */}
            <div className="hero-social-strip">
              <a 
                href="https://github.com/andree23-i" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-strip-link"
                title="GitHub @andree23-i"
              >
                <FiGithub /> <span>GITHUB</span>
              </a>
              <span className="social-sep">/</span>
              <a 
                href="https://www.linkedin.com/in/andrea-iacolare-a626a233a/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-strip-link"
                title="LinkedIn"
              >
                <FiLinkedin /> <span>LINKEDIN</span>
              </a>
              <span className="social-sep">/</span>
              <a 
                href="https://www.instagram.com/andreaiacolare_/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-strip-link"
                title="Instagram"
              >
                <FiInstagram /> <span>INSTAGRAM</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          PILLARS: ARCHITECTURAL CAPABILITIES
          ========================================================================== */}
      <section className="section pillars-section">
        <div className="section-header">
          <span className="section-badge">
            <FiActivity /> {t.WhatIDoTitle || 'Aree di Eccellenza'}
          </span>
          <h2>{t.AboutTitle || 'Competenze Ingegneristiche'}</h2>
          <p className="section-subtitle">
            {t.AboutSummary || 'Progetto e sviluppo applicazioni web ad alte prestazioni, interfacce moderne e flussi di lavoro intelligenti con codice robusto e design senza compromessi.'}
          </p>
        </div>

        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-header">
              <span className="pillar-code">[ 01 ]</span>
              <div className="pillar-icon-box"><FiCode /></div>
            </div>
            <h3>{t.WhatIDo1Title || 'Siti & Web App Complete'}</h3>
            <p>{t.WhatIDo1Desc || 'Interfacce reattive, veloci e ottimizzate per ogni schermo realizzate in React e Next.js, con navigazione fluida e design distintivo.'}</p>
            <div className="pillar-footer-tags">
              <span>Next.js 15</span>
              <span>React 18</span>
              <span>Tailwind v4</span>
              <span>Vite</span>
            </div>
          </div>

          <div className="pillar-card pillar-featured">
            <div className="pillar-header">
              <span className="pillar-code">[ 02 ]</span>
              <div className="pillar-icon-box accent"><FiZap /></div>
            </div>
            <h3>{t.WhatIDo2Title || 'AI & Automazioni Intelligenti'}</h3>
            <p>{t.WhatIDo2Desc || 'Integrazione di modelli linguistici avanzati, agenti intelligenti e flussi operativi automatizzati che ottimizzano compiti reali.'}</p>
            <div className="pillar-footer-tags">
              <span>Agentic Workflows</span>
              <span>LLM APIs</span>
              <span>Prompting</span>
              <span>Autonomous Agents</span>
            </div>
          </div>

          <div className="pillar-card">
            <div className="pillar-header">
              <span className="pillar-code">[ 03 ]</span>
              <div className="pillar-icon-box"><FiShield /></div>
            </div>
            <h3>{t.WhatIDo3Title || 'Backend Stabile & Database'}</h3>
            <p>{t.WhatIDo3Desc || 'Logiche applicative sicure, architetture modulari, API ad alta disponibilità e gestione efficiente dei dati persistenti.'}</p>
            <div className="pillar-footer-tags">
              <span>Node.js</span>
              <span>REST APIs</span>
              <span>State Mgmt</span>
              <span>Vercel Deploy</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          EXPERIENCE & FORMATION LEDGER
          ========================================================================== */}
      <Experience />
    </>
  );
}

export default Intro;
