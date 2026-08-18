import React, { useContext, useState } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import { FiGithub, FiLinkedin, FiInstagram, FiMail, FiArrowRight, FiCheck, FiSend } from 'react-icons/fi';
import './Section.css';

function Contact() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];
  const [copied, setCopied] = useState(false);

  const email = "iacolareandrea@outlook.it";

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const contacts = [
    { 
      icon: <FiMail />, 
      label: t.Email, 
      hint: email, 
      href: `mailto:${email}`, 
      brandColor: "#06b6d4",
      brandGlow: "rgba(6, 182, 212, 0.4)" 
    },
    { 
      icon: <FiLinkedin />, 
      label: t.LinkedIn, 
      hint: "andrea-iacolare", 
      href: "https://www.linkedin.com/in/andrea-iacolare-a626a233a/", 
      brandColor: "#0a66c2",
      brandGlow: "rgba(10, 102, 194, 0.4)" 
    },
    { 
      icon: <FiGithub />, 
      label: t.GitHub || 'GitHub', 
      hint: "@andree23-i", 
      href: "https://github.com/andree23-i", 
      brandColor: "#818cf8",
      brandGlow: "rgba(129, 140, 248, 0.4)" 
    },
    { 
      icon: <FiInstagram />, 
      label: t.Instagram, 
      hint: "@andreaiacolare_", 
      href: "https://www.instagram.com/andreaiacolare_/", 
      brandColor: "#e1306c",
      brandGlow: "rgba(225, 48, 108, 0.4)" 
    },
  ];

  return (
    <section id="contact-section" className="section contact">
      <div className="section-header">
        <span className="section-badge">
          <FiSend /> {t.Contact}
        </span>
        <h2>{t.ContactTitle}</h2>
        <p className="section-subtitle">{t.ContactSubtitle}</p>
      </div>

      <div className="contact-grid">
        {contacts.map((c, idx) => (
          <a 
            key={idx} 
            href={c.href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="contact-card" 
            style={{ 
              '--hover-brand-color': c.brandColor,
              '--hover-brand-glow': c.brandGlow 
            }}
          >
            <div className="contact-card-left">
              <div className="contact-icon-box" style={{ color: c.brandColor }}>
                {c.icon}
              </div>
              <div className="contact-label-box">
                <span className="contact-label-title">{c.label}</span>
                <span className="contact-label-hint">{c.hint}</span>
              </div>
            </div>
            <div className="contact-card-arrow">
              <FiArrowRight />
            </div>
          </a>
        ))}
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <button 
          onClick={handleCopyEmail} 
          className="btn-primary"
          title={copied ? t.EmailCopied : t.CopyEmail}
        >
          {copied ? <FiCheck size={18} /> : <FiMail size={18} />}
          <span>{copied ? t.EmailCopied : `${t.CopyEmail}: ${email}`}</span>
        </button>
      </div>
    </section>
  );
}

export default Contact;

