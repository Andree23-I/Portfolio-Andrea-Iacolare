import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import WebDevCenterpiece3D from '../components/WebDevCenterpiece3D';
import CardStack from '../components/CardStack';
import projectsData from '../data/projects.json';
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
  FiZap,
  FiExternalLink,
  FiCheckCircle,
  FiLayers,
  FiAward,
  FiMessageSquare,
  FiRadio,
  FiCompass
} from 'react-icons/fi';

export default function Intro({ onOpenPortal }) {
  const { language } = useContext(SettingsContext);
  const t = translations[language] || translations.it;
  
  const [copied, setCopied] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [flashTriggered, setFlashTriggered] = useState(false);
  
  // Projects state
  const activeProjects = t.projectsData || projectsData;
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const currentProject = activeProjects[activeProjectIdx] || activeProjects[0];

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
        setTimeStr('17:45 CET');
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

  const handleTriggerFlash = () => {
    setFlashTriggered(true);
    setTimeout(() => setFlashTriggered(false), 400);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getDisplayDomain = (link) => {
    try {
      const url = new URL(link);
      return url.hostname.replace('www.', '');
    } catch {
      return 'project.demo';
    }
  };

  // Timeline Milestones (Emma Parker 'The Journey So Far' counterpart)
  const journeyMilestones = [
    {
      year: "2022",
      month: language === 'en' ? "OCTOBER" : "OTTOBRE",
      title: language === 'en' ? "Foundations in Web Standards" : "Fondamenta negli Standard Web",
      tag: "HTML5 • CSS3 • ES6+",
      description: language === 'en' 
        ? "Early architectural studies in responsive grid layouts, semantic DOM structures, and modern JavaScript engineering principles."
        : "Primi studi approfonditi su layout responsive, architetture semantiche del DOM e principi ingegneristici del JavaScript moderno."
    },
    {
      year: "2023",
      month: language === 'en' ? "MAY" : "MAGGIO",
      title: language === 'en' ? "Full-Stack Architecture & React" : "Architettura Full-Stack & React",
      tag: "REACT 18 • NODE.JS • REST",
      description: language === 'en'
        ? "Mastery of single-page application lifecycles, asynchronous state management, Node.js microservices, and persistent database modeling."
        : "Padronanza del ciclo di vita delle SPA, gestione asincrona dello stato, microservizi in Node.js e modellazione di database persistenti."
    },
    {
      year: "2024",
      month: language === 'en' ? "DECEMBER" : "DICEMBRE",
      title: language === 'en' ? "Next.js & Production E-Commerce" : "Next.js & E-Commerce di Produzione",
      tag: "NEXT.JS 14/15 • TAILWIND • DEPLOY",
      description: language === 'en'
        ? "International technical internship in Seville (Beer & Dreams e-commerce) and delivery of robust high-converting digital storefronts."
        : "Stage tecnico internazionale a Siviglia (e-commerce Beer & Dreams) e sviluppo di piattaforme digitali ad alta conversione."
    },
    {
      year: "2025",
      month: language === 'en' ? "SEPTEMBER" : "SETTEMBRE",
      title: language === 'en' ? "Studio Deployments & AI Automations" : "Lancio Studio & Automazioni AI",
      tag: "SOUTHDV.STUDIO • AGENTS • API",
      description: language === 'en'
        ? "Official release of southdv.studio and Foto Extracolor, integrating autonomous AI agents, LLM tool workflows, and edge compute."
        : "Rilascio ufficiale di southdv.studio e Foto Extracolor, integrando agenti AI autonomi, workflow LLM e computazione edge."
    },
    {
      year: "2026",
      month: language === 'en' ? "PRESENT" : "OGGI",
      title: language === 'en' ? "Scalable Creative Engineering" : "Ingegneria Creativa Scalabile",
      tag: "AWWWARDS-GRADE • MOTION • CLOUD",
      description: language === 'en'
        ? "Continuous engineering of tactile, ultra-fast web experiences, combining brutalist-editorial aesthetic with zero-compromise performance."
        : "Progettazione continua di esperienze web tattili e velocissime, fondendo estetica brutalist-editoriale con performance senza compromessi."
    }
  ];

  return (
    <div className={`emma-editorial-experience ${flashTriggered ? 'flash-active' : ''}`}>
      {/* ==========================================================================
          01. VIEWFINDER HERO HUD & 3D WEB CENTERPIECE
          ========================================================================== */}
      <section id="hero" className="viewfinder-hero-stage">
        {/* Viewfinder Frame Overlay Brackets */}
        <div className="viewfinder-bracket bracket-tl" aria-hidden="true">+</div>
        <div className="viewfinder-bracket bracket-tr" aria-hidden="true">+</div>
        <div className="viewfinder-bracket bracket-bl" aria-hidden="true">+</div>
        <div className="viewfinder-bracket bracket-br" aria-hidden="true">+</div>

        {/* Viewfinder Top Telemetry Strip */}
        <div className="viewfinder-telemetry-hud">
          <div className="hud-metric rec-badge">
            <span className="rec-dot" />
            <span className="font-mono">LIVE // 4K 60FPS</span>
          </div>

          <div className="hud-metric">
            <span className="hud-label">[ LOC ]</span>
            <span className="hud-val">40.68° N, 14.76° E • SALERNO</span>
          </div>

          <div className="hud-metric">
            <span className="hud-label">[ TIME ]</span>
            <span className="hud-val font-mono">{timeStr}</span>
          </div>

          <div className="hud-metric">
            <span className="hud-label">[ ISO ]</span>
            <span className="hud-val font-mono">100 // CALIBRATED</span>
          </div>

          <div className="hud-metric status-operational">
            <span className="status-dot" />
            <span className="hud-val font-mono">{t.AvailableForWork || 'AVAILABLE FOR COMMISSIONS'}</span>
          </div>
        </div>

        {/* Hero Wordmark (Emma Parker 'btl-wordmark' Style) */}
        <div className="hero-wordmark-container">
          <div className="role-super-tag">
            <span className="bracket">[</span>
            <span className="role-text">{t.AboutRole || 'FULL-STACK WEB & AI DEVELOPER'}</span>
            <span className="bracket">]</span>
          </div>

          <h1 className="editorial-wordmark">
            <span className="wordmark-ghost" aria-hidden="true">Andrea Iacolare</span>
            <span className="wordmark-solid">Andrea Iacolare</span>
          </h1>

          <p className="hero-editorial-sub">
            {language === 'en' 
              ? "Architect of tactile, high-performance web systems and cinematic digital spaces."
              : "Architetto di sistemi web tattili ad alte prestazioni ed esperienze digitali cinematografiche."}
          </p>
        </div>

        {/* 3D Web Centerpiece (Direct replacement for the 3D film camera) */}
        <div className="hero-3d-centerpiece-container">
          <WebDevCenterpiece3D t={t} onTriggerFlash={handleTriggerFlash} />
        </div>

        {/* Hero Bottom Navigation & Shutter Trigger Strip */}
        <div className="hero-action-strip">
          {onOpenPortal && (
            <button 
              className="btn-editorial-portal"
              onClick={onOpenPortal}
              title={language === 'en' ? 'Open 3D Destination Gallery' : 'Apri Galleria 3D di Scelta'}
            >
              <FiCompass className="portal-icon-spin" />
              <span>{language === 'en' ? 'CHOOSE EXPERIENCE' : 'SCEGLI DESTINAZIONE 3D'}</span>
            </button>
          )}

          <button 
            className="btn-editorial-primary"
            onClick={() => scrollToSection('work')}
            title="Explore Selected Works"
          >
            <span>{t.ViewProjects || 'Esplora i Lavori'}</span>
            <FiArrowUpRight />
          </button>

          <button 
            className="btn-editorial-secondary"
            onClick={handleCopyEmail}
            title={t.CopyEmail}
          >
            {copied ? (
              <>
                <FiCheck style={{ color: '#10b981' }} />
                <span>{t.EmailCopied || 'Copiato!'}</span>
              </>
            ) : (
              <>
                <FiMail />
                <span>{t.CopyEmail || 'Copia Email'}</span>
              </>
            )}
          </button>

          <div className="hero-social-pill-group">
            <a 
              href="https://github.com/andree23-i" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-pill-btn"
              title="GitHub @andree23-i"
            >
              <FiGithub />
              <span>GITHUB</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/andrea-iacolare-a626a233a/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-pill-btn"
              title="LinkedIn"
            >
              <FiLinkedin />
              <span>LINKEDIN</span>
            </a>
            <a 
              href="https://www.instagram.com/andreaiacolare_/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-pill-btn"
              title="Instagram"
            >
              <FiInstagram />
              <span>INSTAGRAM</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          02. EDITORIAL MANIFESTO / PHILOSOPHY
          ========================================================================== */}
      <section id="manifesto" className="section editorial-manifesto-stage">
        <div className="manifesto-card glass-panel">
          <div className="manifesto-header-bar">
            <span className="manifesto-tag font-mono">[ PHILOSOPHY // 01 ]</span>
            <span className="manifesto-coordinates font-mono">LAT 40.68° N • LON 14.76° E</span>
          </div>

          <blockquote className="manifesto-quote">
            "{t.PhilosophyQuote || 'I grandi siti web non sono mai solo codice. Nascono nel punto esatto di incontro tra design cinematografico, prestazioni istantanee ed architetture resilienti.'}"
          </blockquote>

          <div className="manifesto-footer-bar">
            <span className="manifesto-author font-mono">
              {t.PhilosophyAuthor || 'Andrea Iacolare • Creative Web Technologist'}
            </span>
            <div className="manifesto-specs-row">
              <span className="spec-pill">React 18</span>
              <span className="spec-pill">Next.js 15</span>
              <span className="spec-pill">AI Agents</span>
              <span className="spec-pill">100/100 Lighthouse</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          03. WHAT I BUILD // SELECTED WORKS (Emma Parker 'btl-work' Style)
          ========================================================================== */}
      <section id="work" className="section editorial-work-stage">
        <div className="section-header">
          <span className="section-badge">
            <FiLayers /> [ 02 // SELECTED WORKS ]
          </span>
          <h2>{t.ProjectsTitle || 'Cosa Costruisco'}</h2>
          <p className="section-subtitle">
            {t.ProjectsSubtitle || 'Una selezione di applicazioni web e piattaforme realizzate con tecnologie moderne.'}
          </p>
        </div>

        {/* 3D Card Stack Carousel */}
        <div className="projects-carousel-wrapper">
          <CardStack
            items={activeProjects}
            initialIndex={0}
            loop={true}
            autoAdvance={true}
            intervalMs={4500}
            pauseOnHover={true}
            showDots={true}
            onChangeIndex={(idx) => setActiveProjectIdx(idx)}
            t={t}
          />
        </div>

        {/* Active Project Spotlight Ledger */}
        {currentProject && (
          <div className="active-project-spotlight glass-panel">
            <div className="spotlight-header">
              <div className="spotlight-meta">
                <span className="spotlight-index-pill font-mono">
                  {activeProjectIdx + 1} / {activeProjects.length}
                </span>
                <span className="spotlight-domain font-mono">
                  https://{getDisplayDomain(currentProject.link)}
                </span>
              </div>
              <span className="project-status-tag font-mono">
                <FiCheckCircle style={{ marginRight: '6px' }} />
                {t.Featured || 'FEATURED WORK'}
              </span>
            </div>

            <div className="spotlight-body">
              <div className="spotlight-info">
                <h3>{currentProject.title}</h3>
                <p className="spotlight-description">{currentProject.description}</p>
                
                <div className="project-tech-stack">
                  {currentProject.techStack &&
                    currentProject.techStack.map((tech, techIdx) => (
                      <span key={techIdx} className="tech-badge font-mono">
                        {tech}
                      </span>
                    ))}
                </div>
              </div>

              <div className="spotlight-action">
                <a
                  href={currentProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editorial-primary"
                  title={`Open ${currentProject.title} live demo`}
                >
                  <span>{t.LiveDemo || 'Visita Sito'}</span>
                  <FiExternalLink />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==========================================================================
          04. THE JOURNEY SO FAR (Emma Parker 'btl-journey' Timeline)
          ========================================================================== */}
      <section id="journey" className="section editorial-journey-stage">
        <div className="section-header">
          <span className="section-badge">
            <FiRadio /> [ 03 // CHRONOLOGY ]
          </span>
          <h2>{t.JourneyTitle || 'Il Percorso Fino ad Ora'}</h2>
          <p className="section-subtitle">
            {t.JourneySubtitle || 'Tappe fondamentali, evoluzione full-stack ed ingegneria di produzione continua.'}
          </p>
        </div>

        <div className="journey-timeline-grid">
          {journeyMilestones.map((item, idx) => (
            <div key={idx} className="journey-milestone-card glass-panel">
              <div className="milestone-top-row">
                <span className="milestone-year font-mono">{item.year}</span>
                <span className="milestone-month font-mono">{item.month}</span>
              </div>

              <div className="milestone-content">
                <h4 className="milestone-title">{item.title}</h4>
                <span className="milestone-tag font-mono">{item.tag}</span>
                <p className="milestone-desc">{item.description}</p>
              </div>

              <div className="milestone-corner-mark font-mono">#{idx + 1}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================================================
          05. CRAFT & ARCHITECTURE (Engineering Pillars)
          ========================================================================== */}
      <section id="craft" className="section pillars-section">
        <div className="section-header">
          <span className="section-badge">
            <FiActivity /> [ 04 // CRAFT & EXPERTISE ]
          </span>
          <h2>{t.AboutTitle || 'Competenze Ingegneristiche'}</h2>
          <p className="section-subtitle">
            {t.AboutSummary || 'Progetto e sviluppo applicazioni web ad alte prestazioni, interfacce moderne e flussi di lavoro intelligenti.'}
          </p>
        </div>

        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-header">
              <span className="pillar-code">[ 01 ]</span>
              <div className="pillar-icon-box"><FiCode /></div>
            </div>
            <h3>{t.WhatIDo1Title || 'Siti & Web App Complete'}</h3>
            <p>{t.WhatIDo1Desc || 'Interfacce reattive, veloci e ottimizzate per ogni schermo realizzate in React e Next.js.'}</p>
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
            <p>{t.WhatIDo2Desc || 'Integrazione di modelli linguistici avanzati, agenti intelligenti e flussi operativi automatizzati.'}</p>
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
            <p>{t.WhatIDo3Desc || 'Logiche applicative sicure, architetture modulari, API ad alta disponibilità e gestione efficiente dei dati.'}</p>
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
          06. TELEMETRY & ACHIEVEMENTS (Emma Parker 'btl-achievements' Style)
          ========================================================================== */}
      <section id="achievements" className="section editorial-achievements-stage">
        <div className="section-header">
          <span className="section-badge">
            <FiAward /> [ 05 // METRICS & TELEMETRY ]
          </span>
          <h2>{t.AchievementsTitle || 'Telemetria & Metriche'}</h2>
          <p className="section-subtitle">
            {t.AchievementsSubtitle || 'Parametri di performance certificati su applicazioni in produzione.'}
          </p>
        </div>

        <div className="achievements-quad-grid">
          <div className="achievement-cell glass-panel">
            <span className="achievement-num font-mono">15+</span>
            <h4 className="achievement-label">Web Deployments</h4>
            <p className="achievement-detail">Production-ready applications launched on edge architecture.</p>
          </div>

          <div className="achievement-cell glass-panel highlight">
            <span className="achievement-num font-mono">100/100</span>
            <h4 className="achievement-label">Lighthouse Performance</h4>
            <p className="achievement-detail">Zero layout shift, instant first input delay, and optimized bundle size.</p>
          </div>

          <div className="achievement-cell glass-panel">
            <span className="achievement-num font-mono">&lt;80ms</span>
            <h4 className="achievement-label">Edge Network TTFB</h4>
            <p className="achievement-detail">Global distribution via CDN edge caching and static prerendering.</p>
          </div>

          <div className="achievement-cell glass-panel">
            <span className="achievement-num font-mono">99.9%</span>
            <h4 className="achievement-label">System Availability</h4>
            <p className="achievement-detail">Resilient uptime across enterprise client platforms and web tools.</p>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          07. IN THEIR WORDS (Emma Parker 'btl-testimonials' Style)
          ========================================================================== */}
      <section id="testimonials" className="section editorial-testimonials-stage">
        <div className="section-header">
          <span className="section-badge">
            <FiMessageSquare /> [ 06 // TESTIMONIALS ]
          </span>
          <h2>{t.TestimonialsTitle || 'Dicono di Me'}</h2>
          <p className="section-subtitle">
            {t.TestimonialsSubtitle || 'Feedback da clienti e collaboratori su esecuzione tecnica ed estetica.'}
          </p>
        </div>

        <div className="testimonials-editorial-grid">
          <div className="testimonial-card glass-panel">
            <div className="testimonial-rating font-mono">★★★★★</div>
            <p className="testimonial-body">
              "Andrea ha trasformato la nostra presenza digitale in qualcosa di magnetico e velocissimo. Un'attenzione al dettaglio e alla resa visiva davvero rara da trovare."
            </p>
            <div className="testimonial-author">
              <span className="author-name">South DV Studio</span>
              <span className="author-role font-mono">Creative Video Production • Napoli</span>
            </div>
          </div>

          <div className="testimonial-card glass-panel">
            <div className="testimonial-rating font-mono">★★★★★</div>
            <p className="testimonial-body">
              "Codice pulito, consegna rapida e un'interfaccia che riceve complimenti continui da tutti i nostri clienti. Comunicazione sempre chiara e puntuale."
            </p>
            <div className="testimonial-author">
              <span className="author-name">Extracolor Media</span>
              <span className="author-role font-mono">Photography & Digital Archive</span>
            </div>
          </div>

          <div className="testimonial-card glass-panel">
            <div className="testimonial-rating font-mono">★★★★★</div>
            <p className="testimonial-body">
              "Unisce la disciplina ingegneristica alla cura tipografica di un designer. Le sue soluzioni sono solide, scalabili e soprattutto pronte per la produzione."
            </p>
            <div className="testimonial-author">
              <span className="author-name">Tech Collaborator</span>
              <span className="author-role font-mono">Frontend Engineer</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          08. INITIALIZE COLLABORATION / CONTACT & VIEWFINDER FOOTER
          ========================================================================== */}
      <section id="contact" className="section editorial-contact-stage">
        <div className="contact-editorial-card glass-panel">
          <div className="contact-header-strip">
            <span className="font-mono">[ CONNECT // AI-2026 ]</span>
            <span className="font-mono">STATUS: AVAILABLE</span>
          </div>

          <h2 className="contact-editorial-title">
            {language === 'en' ? "Let's Build Something Memorable." : "Costruiamo Qualcosa di Straordinario."}
          </h2>

          <p className="contact-editorial-desc">
            {language === 'en'
              ? "Available for freelance projects, modern web development contracts, and creative engineering collaborations."
              : "Disponibile per progetti freelance, sviluppo siti web moderni, e-commerce ad alte prestazioni e collaborazioni tecniche."}
          </p>

          <div className="contact-cta-action-row">
            <button 
              onClick={handleCopyEmail}
              className="btn-editorial-primary"
              title={t.CopyEmail}
            >
              {copied ? (
                <>
                  <FiCheck style={{ color: '#ffffff' }} />
                  <span>{t.EmailCopied || 'Copiato!'}</span>
                </>
              ) : (
                <>
                  <FiMail />
                  <span>{email}</span>
                </>
              )}
            </button>

            <a 
              href="https://wa.me/393319022698" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-editorial-secondary"
              title="Chat on WhatsApp"
            >
              <span>WhatsApp Direct</span>
              <FiArrowUpRight />
            </a>
          </div>

          <div className="contact-social-grid">
            <a href="https://github.com/andree23-i" target="_blank" rel="noopener noreferrer" className="social-box">
              <FiGithub />
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/andrea-iacolare-a626a233a/" target="_blank" rel="noopener noreferrer" className="social-box">
              <FiLinkedin />
              <span>LinkedIn</span>
            </a>
            <a href="https://www.instagram.com/andreaiacolare_/" target="_blank" rel="noopener noreferrer" className="social-box">
              <FiInstagram />
              <span>Instagram</span>
            </a>
          </div>

          {/* Technical Viewfinder Camera Footer (Emma Parker aesthetic) */}
          <div className="viewfinder-footer-hud font-mono">
            <div className="hud-cell">
              <span className="hud-sub">FOCAL / OPTIC</span>
              <span className="hud-val">WEB_CANVAS 35MM</span>
            </div>
            <div className="hud-cell">
              <span className="hud-sub">RESOLUTION</span>
              <span className="hud-val">3840×2160 // 60FPS</span>
            </div>
            <div className="hud-cell">
              <span className="hud-sub">ORIGIN</span>
              <span className="hud-val">SALERNO, ITALY</span>
            </div>
            <div className="hud-cell">
              <span className="hud-sub">COPYRIGHT</span>
              <span className="hud-val">© 2026 ANDREA IACOLARE</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
