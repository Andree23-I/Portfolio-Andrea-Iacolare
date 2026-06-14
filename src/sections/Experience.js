import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import experienceData from '../data/experience.json';
import educationData from '../data/education.json';
import './Section.css';
import { FiBriefcase, FiBookOpen, FiCalendar, FiMapPin } from 'react-icons/fi';

function Experience() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];

  return (
    <section className="section experience glass-panel">
      <h2>{t.EducationTitle} & {t.ExperienceTitle}</h2>
      
      <div className="timeline-container">
        {/* Education Section */}
        <div className="timeline-column">
          <h3 className="timeline-header">
            <FiBookOpen className="timeline-icon-header" /> 
            {t.EducationTitle}
          </h3>
          <div className="modern-timeline">
            {educationData.map((item, idx) => (
              <div key={`edu-${idx}`} className="timeline-card glass-panel">
                <div className="timeline-dot"></div>
                <h4 className="timeline-role">{item.degree}</h4>
                <div className="timeline-meta">
                  <span className="timeline-company">{item.institution}</span>
                  <span className="timeline-date"><FiCalendar /> {item.period}</span>
                  <span className="timeline-location"><FiMapPin /> {item.location}</span>
                </div>
                <p className="timeline-desc">{item.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="timeline-column">
          <h3 className="timeline-header">
            <FiBriefcase className="timeline-icon-header" /> 
            {t.ExperienceTitle}
          </h3>
          <div className="modern-timeline">
            {experienceData.map((item, idx) => (
              <div key={`exp-${idx}`} className="timeline-card glass-panel">
                <div className="timeline-dot"></div>
                <h4 className="timeline-role">{item.role}</h4>
                <div className="timeline-meta">
                  <span className="timeline-company">{item.company}</span>
                  <span className="timeline-date"><FiCalendar /> {item.period}</span>
                  <span className="timeline-location"><FiMapPin /> {item.location}</span>
                </div>
                <p className="timeline-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Experience;
