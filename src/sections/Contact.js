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
      id: "email",
      icon: <FiMail />, 
      label: t.Email, 
      hint: email, 
      href: `mailto:${email}`, 
      brandColor: "#06b6d4",
      brandGlow: "rgba(6, 182, 212, 0.45)",
      brandBg: "rgba(6, 182, 212, 0.12)",
      brandHoverBg: "#06b6d4"
    },
    { 
      id: "linkedin",
      icon: <FiLinkedin />, 
      label: t.LinkedIn, 
      hint: "andrea-iacolare", 
      href: "https://www.linkedin.com/in/andrea-iacolare-a626a233a/", 
      brandColor: "#0a66c2",
      brandGlow: "rgba(10, 102, 194, 0.5)",
      brandBg: "rgba(10, 102, 194, 0.12)",
      brandHoverBg: "#0a66c2"
    },
    { 
      id: "github",
      icon: <FiGithub />, 
      label: t.GitHub || 'GitHub', 
      hint: "@andree23-i", 
      href: "https://github.com/andree23-i", 
      brandColor: "#f0f6fc",
      brandGlow: "rgba(240, 246, 252, 0.35)",
      brandBg: "rgba(255, 255, 255, 0.08)",
      brandHoverBg: "#24292e"
    },
    { 
      id: "instagram",
      icon: <FiInstagram />, 
      label: t.Instagram, 
      hint: "@andreaiacolare_", 
      href: "https://www.instagram.com/andreaiacolare_/", 
      brandColor: "#e1306c",
      brandGlow: "rgba(225, 48, 108, 0.5)",
      brandBg: "rgba(225, 48, 108, 0.12)",
      brandHoverBg: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
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
            className={`contact-card contact-${c.id}`} 
            style={{ 
              '--brand-color': c.brandColor,
              '--brand-glow': c.brandGlow,
              '--brand-bg': c.brandBg,
              '--brand-hover-bg': c.brandHoverBg 
            }}
          >
            <div className="contact-card-left">
              <div className="contact-icon-box">
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

