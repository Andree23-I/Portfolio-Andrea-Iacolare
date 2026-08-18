import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import './Section.css';
import { 
  FiMail, 
  FiLinkedin, 
  FiInstagram, 
  FiGithub, 
  FiArrowRight, 
  FiCopy, 
  FiCheck, 
  FiLayers,
  FiCode,
  FiTerminal,
  FiCpu,
  FiZap,
  FiAward,
  FiUser,
  FiLayout,
  FiDatabase,
  FiGlobe
} from 'react-icons/fi';
import Experience from './Experience';
import Typewriter from '../components/Typewriter';

function Intro() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];
  const navigate = useNavigate();
  
  const [copied, setCopied] = useState(false);
  const [infoViewMode, setInfoViewMode] = useState(() => {
    return localStorage.getItem('portfolio_info_view') || 'visual';
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [copiedCode, setCopiedCode] = useState(false);

  const email = "iacolareandrea@outlook.it";

  useEffect(() => {
    localStorage.setItem('portfolio_info_view', infoViewMode);
  }, [infoViewMode]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const codeSnippets = {
    profile: `// ${t.CodeWindowTitle || 'andrea-profile.ts'}
const developer: DeveloperProfile = {
  name: "Andrea Iacolare",
  title: "Full-Stack & AI Developer",
  location: "Italy 🇮🇹",
  status: "Available for Projects & Hiring 🚀",
  passions: [
    "Modern React Ecosystems",
    "High-Performance Web Architecture",
    "Agentic AI & Smart Interfaces"
  ],
  sayHello: () => "Let's build something exceptional together!"
};`,
    stack: `{
  "core": ["React 18", "JavaScript ES6+", "TypeScript", "Node.js"],
  "frontend": ["HTML5", "CSS3 / Modern Glassmorphism", "Vite", "TailwindCSS"],
  "backend_and_data": ["Python", "Express", "RESTful APIs", "SQL / NoSQL"],
  "tools": ["Git / GitHub", "VS Code", "Vercel / GH-Pages", "AI SDKs"]
}`,
    terminal: `> andrea.initPortfolio()
✔ Initializing modern UI engine... [Done]
✔ Loading 10+ tech stack modules... [Done]
✔ Connecting to GitHub & live projects... [Done]
✔ System Status: Ready to collaborate! 

> andrea.contact()
→ Email: iacolareandrea@outlook.it
→ Status: Online & Accepting new opportunities.`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
            className="social-btn social-email" 
            title={t.Email}
            aria-label="Email"
          >
            <FiMail />
          </a>
          <a 
            href="https://github.com/andree23-i" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-btn social-github" 
            title={t.GitHub || 'GitHub'}
            aria-label="GitHub"
          >
            <FiGithub />
          </a>
          <a 
            href="https://www.linkedin.com/in/andrea-iacolare-a626a233a/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-btn social-linkedin" 
            title={t.LinkedIn}
            aria-label="LinkedIn"
          >
            <FiLinkedin />
          </a>
          <a 
            href="https://www.instagram.com/andreaiacolare_/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-btn social-instagram" 
            title={t.Instagram}
            aria-label="Instagram"
          >
            <FiInstagram />
          </a>
        </div>

        {/* Key Metrics / Highlights Bento Grid */}
        <div className="hero-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-box">
              <FiZap />
            </div>
            <div className="stat-info">
              <span className="stat-val">{t.StatExperienceVal || '2+ Anni'}</span>
              <span className="stat-label">{t.StatExperience || 'Esperienza & Crescita'}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box">
              <FiCode />
            </div>
            <div className="stat-info">
              <span className="stat-val">{t.StatTechVal || 'React & Node'}</span>
              <span className="stat-label">{t.StatTech || 'Core Stack'}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box">
              <FiCpu />
            </div>
            <div className="stat-info">
              <span className="stat-val">{t.StatFocusVal || 'Full-Stack & AI'}</span>
              <span className="stat-label">{t.StatFocus || 'Specializzazione'}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box">
              <FiAward />
            </div>
            <div className="stat-info">
              <span className="stat-val">{t.StatProjectsVal || 'In Evidenza'}</span>
              <span className="stat-label">{t.StatProjects || 'Progetti Web'}</span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher Header */}
        <div className="info-mode-container">
          <div className="info-mode-toggle-bar">
            <button 
              onClick={() => setInfoViewMode('visual')}
              className={`mode-btn ${infoViewMode === 'visual' ? 'active' : ''}`}
            >
              <FiUser size={16} />
              <span>{t.ViewModeVisual || 'Scheda Visiva (Semplice)'}</span>
            </button>
            <button 
              onClick={() => setInfoViewMode('code')}
              className={`mode-btn ${infoViewMode === 'code' ? 'active' : ''}`}
            >
              <FiCode size={16} />
              <span>{t.ViewModeCode || 'Vista Codice (Tech)'}</span>
            </button>
          </div>

          {/* Mode 1: Human-Friendly Visual Card */}
          {infoViewMode === 'visual' ? (
            <div className="visual-story-card">
              <div className="visual-card-top">
                <div className="visual-avatar-badge">
                  <span>AI</span>
                </div>
                <div className="visual-title-wrap">
                  <h4>{t.AboutTitle || 'Chi Sono & Sintesi Profilo'}</h4>
                  <p className="visual-role-tag">{t.AboutRole || 'Full-Stack Web & AI Developer'}</p>
                </div>
              </div>

              <p className="visual-summary-text">
                {t.AboutSummary || 'Progetto e sviluppo siti web ad alte prestazioni, applicazioni moderne e strumenti digitali su misura.'}
              </p>

              <div className="visual-pillars-grid">
                <div className="pillar-item">
                  <div className="pillar-icon">
                    <FiLayout />
                  </div>
                  <div className="pillar-text">
                    <strong>{t.WhatIDo1Title || 'Siti & Web App'}</strong>
                    <p>{t.WhatIDo1Desc || 'Interfacce reattive, moderne e veloci.'}</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon">
                    <FiCpu />
                  </div>
                  <div className="pillar-text">
                    <strong>{t.WhatIDo2Title || 'AI & Automazione'}</strong>
                    <p>{t.WhatIDo2Desc || 'Integrazione di modelli AI e processi intelligenti.'}</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon">
                    <FiDatabase />
                  </div>
                  <div className="pillar-text">
                    <strong>{t.WhatIDo3Title || 'Backend & Database'}</strong>
                    <p>{t.WhatIDo3Desc || 'Logiche server stabili e gestione dati strutturata.'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Mode 2: Interactive Developer Code Window */
            <div className="hero-code-showcase">
              <div className="code-window">
                <div className="code-header">
                  <div className="code-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="code-tabs">
                    <button 
                      onClick={() => setActiveTab('profile')} 
                      className={`code-tab ${activeTab === 'profile' ? 'active' : ''}`}
                    >
                      <FiCode size={14} />
                      <span>{t.CodeWindowTab1 || 'Profile.ts'}</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('stack')} 
                      className={`code-tab ${activeTab === 'stack' ? 'active' : ''}`}
                    >
                      <FiCpu size={14} />
                      <span>{t.CodeWindowTab2 || 'TechStack.json'}</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('terminal')} 
                      className={`code-tab ${activeTab === 'terminal' ? 'active' : ''}`}
                    >
                      <FiTerminal size={14} />
                      <span>{t.CodeWindowTab3 || 'Terminal'}</span>
                    </button>
                  </div>
                  <div className="code-actions">
                    <button 
                      onClick={handleCopyCode} 
                      className="code-copy-btn" 
                      title="Copia codice"
                    >
                      {copiedCode ? <FiCheck size={14} style={{ color: 'var(--accent-emerald)' }} /> : <FiCopy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="code-body">
                  <pre className="code-content">
                    <code>{codeSnippets[activeTab]}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
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
