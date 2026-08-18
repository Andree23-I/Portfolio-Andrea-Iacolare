import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
 import { translations } from '../translations';
 import experienceData from '../data/experience.json';
 import educationData from '../data/education.json';
 import './Section.css';
 import { FiBriefcase, FiBookOpen, FiCalendar, FiMapPin, FiAward } from 'react-icons/fi';

function Experience() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];

  return (
    <section id="experience-section" className="section experience">
      <div className="section-header">
        <span className="section-badge">
          <FiAward /> {t.Experience}
        </span>
        <h2>{t.ExperienceTitle}</h2>
      </div>
      
      <div className="timeline-dual-grid">
        {/* Education Column */}
        <div className="timeline-column">
          <h3 className="timeline-column-header">
            <FiBookOpen className="timeline-column-icon" /> 
            <span>{t.Education}</span>
          </h3>
          <div className="timeline-stream">
            {educationData.map((item, idx) => (
              <div key={`edu-${idx}`} className="timeline-node">
                <div className="timeline-dot-pulse"></div>
                <div className="timeline-card">
                  <h4 className="timeline-role">{item.degree}</h4>
                  <div className="timeline-meta-wrap">
                    <span className="timeline-company-pill">{item.institution}</span>
                    <span className="timeline-date-pill"><FiCalendar /> {item.period}</span>
                    <span className="timeline-loc-pill"><FiMapPin /> {item.location}</span>
                  </div>
                  <p className="timeline-desc">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Column */}
        <div className="timeline-column">
          <h3 className="timeline-column-header">
            <FiBriefcase className="timeline-column-icon" /> 
            <span>{t.Experience}</span>
          </h3>
          <div className="timeline-stream">
            {experienceData.map((item, idx) => (
              <div key={`exp-${idx}`} className="timeline-node">
                <div className="timeline-dot-pulse"></div>
                <div className="timeline-card">
                  <h4 className="timeline-role">{item.role}</h4>
                  <div className="timeline-meta-wrap">
                    <span className="timeline-company-pill">{item.company}</span>
                    <span className="timeline-date-pill"><FiCalendar /> {item.period}</span>
                    <span className="timeline-loc-pill"><FiMapPin /> {item.location}</span>
                  </div>
                  <p className="timeline-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Experience;

