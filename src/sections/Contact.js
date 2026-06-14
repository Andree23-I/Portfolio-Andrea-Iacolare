import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import { FiGithub, FiLinkedin, FiInstagram, FiMail, FiArrowRight } from 'react-icons/fi';
import './Section.css';

function Contact() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];

  const contacts = [
    { icon: <FiMail />, label: t.Email, href: "mailto:iacolareandrea@outlook.it", color: "var(--accent)" },
    { icon: <FiLinkedin />, label: t.LinkedIn, href: "https://www.linkedin.com/in/andrea-iacolare-a626a233a/", color: "#0077b5" },
    { icon: <FiInstagram />, label: t.Instagram, href: "https://www.instagram.com/andree_23__/", color: "#e1306c" },
    { icon: <FiGithub />, label: t.GitHub || 'GitHub', href: "https://github.com/andree23-i", color: "var(--text-main)" }
  ];

  return (
    <section className="section contact glass-panel">
      <h2>{t.ContactTitle}</h2>
      <p style={{marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--text-muted)'}}>
        {language === 'it' 
          ? 'Sentiti libero di contattarmi per qualsiasi opportunità o domanda.' 
          : 'Feel free to reach out to me for any opportunities or questions.'}
      </p>

      <div className="contact-grid">
        {contacts.map((c, idx) => (
          <a key={idx} href={c.href} target="_blank" rel="noopener noreferrer" className="contact-card glass-panel" style={{ '--hover-color': c.color }}>
            <div className="contact-icon" style={{ color: c.color }}>{c.icon}</div>
            <div className="contact-label">{c.label}</div>
            <div className="contact-arrow"><FiArrowRight /></div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Contact;
