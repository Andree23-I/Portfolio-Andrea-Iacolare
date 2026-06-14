import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import './Section.css';
import { FiMail, FiLinkedin, FiInstagram } from 'react-icons/fi';
import Experience from './Experience';
import Typewriter from '../components/Typewriter';

function Intro() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];
  return (
    <>
      <section className="section intro glass-panel">
        <div className="floating-element shape-1"></div>
        <div className="floating-element shape-2"></div>
        <div className="floating-element shape-3"></div>
        
        <h1><Typewriter text={t.Intro} delay={150} /></h1>
        <p className="fade-in-text">{t.IntroText}</p>
        <div className="social-links">
          <a href="mailto:iacolareandrea@outlook.it" target="_blank" rel="noopener noreferrer">
            <FiMail style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />{t.Email}
          </a>
          <a href="https://www.instagram.com/andree_23__/" target="_blank" rel="noopener noreferrer">
            <FiInstagram style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />{t.Instagram}
          </a>
          <a href="https://www.linkedin.com/in/andrea-iacolare-a626a233a/" target="_blank" rel="noopener noreferrer">
            <FiLinkedin style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />{t.LinkedIn}
          </a>
        </div>
      </section>
      
      <Experience />
    </>
  );
}

export default Intro;
