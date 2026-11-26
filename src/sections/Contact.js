import React, { useContext, useState } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import { 
  FiGithub, 
  FiLinkedin, 
  FiInstagram, 
  FiMail, 
  FiArrowUpRight, 
  FiCheck, 
  FiSend
} from 'react-icons/fi';
import './Section.css';

function Contact() {
  const { language } = useContext(SettingsContext);
  const t = translations[language] || translations.it;
  const [copied, setCopied] = useState(false);

  const email = "iacolareandrea9@gmail.com";
  const phone = "(+39) 327 707 4410";
  const whatsappUrl = "https://wa.me/393277074410";

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const contacts = [
    { 
      id: "email",
      icon: <FiMail />, 
      label: language === 'en' ? "Direct Email" : "Email Diretta", 
      hint: email, 
      href: `mailto:${email}`,
      actionLabel: copied ? (language === 'en' ? "Copied!" : "Copiata!") : (language === 'en' ? "Send Mail ↗" : "Invia Email ↗")
    },
    { 
      id: "whatsapp",
      icon: <FiSend />, 
      label: "WhatsApp / Direct Phone", 
      hint: phone, 
      href: whatsappUrl,
      actionLabel: language === 'en' ? "Open Chat ↗" : "Apri Chat ↗"
    },
    { 
      id: "linkedin",
      icon: <FiLinkedin />, 
      label: "LinkedIn Professional", 
      hint: "andrea-iacolare", 
      href: "https://www.linkedin.com/in/andrea-iacolare-a626a233a/",
      actionLabel: language === 'en' ? "Connect ↗" : "Collegati ↗"
    },
    { 
      id: "github",
      icon: <FiGithub />, 
      label: "GitHub Source & Repos", 
      hint: "@andree23-i", 
      href: "https://github.com/andree23-i",
      actionLabel: language === 'en' ? "View Profile ↗" : "Vedi Profilo ↗"
    },
    { 
      id: "instagram",
      icon: <FiInstagram />, 
      label: "Instagram Social", 
      hint: "@andreaiacolare_", 
      href: "https://www.instagram.com/andreaiacolare_/",
      actionLabel: language === 'en' ? "Follow ↗" : "Segui ↗"
    },
  ];

  return (
    <section id="contact-section" className="section contact">
      <div className="section-header">
        <span className="section-badge">
          <FiSend /> {t.Contact || 'Contatti'}
        </span>
        <h2>{t.ContactTitle || "Mettiamoci in Contatto"}</h2>
        <p className="section-subtitle">
          {t.ContactSubtitle || "Hai un'idea ambiziosa, un progetto da realizzare o vuoi integrare nuove tecnologie? Scrivimi direttamente tramite i miei canali ufficiali."}
        </p>
      </div>

      <div className="contact-grid">
        {contacts.map((c, idx) => (
          <a 
            key={idx} 
            href={c.href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`contact-card contact-${c.id}`}
            title={`Contatta Andrea via ${c.label}`}
          >
            <div className="contact-icon-box">
              {c.icon}
            </div>

            <div className="contact-info">
              <span className="contact-label">{c.label}</span>
              <span className="contact-hint">{c.hint}</span>
            </div>

            <div className="contact-action-arrow">
              <FiArrowUpRight />
            </div>
          </a>
        ))}
      </div>

      {/* Instant Email Callout Card */}
      <div className="glass-panel" style={{ marginTop: '3.5rem', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)' }} />
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          {language === 'en' ? "Ready to build something extraordinary?" : "Pronto a costruire qualcosa di straordinario?"}
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
          {language === 'en' 
            ? "Whether you need a cutting-edge Next.js application, high-converting showcase or bespoke AI automations, I am ready to collaborate."
            : "Che tu abbia bisogno di un'applicazione Next.js all'avanguardia, un sito vetrina ad alto impatto o automazioni AI su misura, parliamone."}
        </p>
        <button onClick={handleCopyEmail} className="btn-primary" style={{ margin: '0 auto' }}>
          {copied ? (
            <>
              <FiCheck size={18} style={{ color: '#ffffff' }} />
              <span>{t.EmailCopied || "Email Copiata negli Appunti!"}</span>
            </>
          ) : (
            <>
              <FiMail size={18} />
              <span>{email} — {language === 'en' ? "Click to Copy" : "Clicca per Copiare"}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}

export default Contact;
