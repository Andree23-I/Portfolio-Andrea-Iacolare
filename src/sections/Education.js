import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import educationData from '../data/education.json';
import './Section.css';

function Education() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];
  return (
    <section className="section education glass-panel">
      <h2>{t.EducationTitle}</h2>
      <ul className="education-list">
        {educationData.map((item, idx) => (
          <li key={idx} className="education-item">
            <h3>{item.institution}</h3>
            <p>{item.degree} ({item.period})</p>
            <p>{item.details}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Education;
