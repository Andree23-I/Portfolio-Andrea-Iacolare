import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import skillsData from '../data/skills.json';
import './Section.css';
import { FiCode, FiCpu, FiGlobe, FiTool } from 'react-icons/fi';

function Skills() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];
  const { languages, tools, programming } = skillsData;

  const categories = [
    { 
      title: t.Programming || 'Development & Web', 
      icon: <FiCode />, 
      data: programming, 
      isObj: true,
      color: 'var(--primary)'
    },
    { 
      title: t.Tools || 'Tools & Environment', 
      icon: <FiTool />, 
      data: tools, 
      isObj: false,
      color: 'var(--accent-cyan)'
    },
    { 
      title: t.Languages || 'Spoken Languages', 
      icon: <FiGlobe />, 
      data: languages, 
      isObj: true,
      color: 'var(--accent-violet)'
    },
  ];

  return (
    <section id="skills-section" className="section skills">
      <div className="section-header">
        <span className="section-badge">
          <FiCpu /> {t.Skills}
        </span>
        <h2>{t.SkillsTitle}</h2>
      </div>
      
      <div className="skills-grid">
        {categories.map((cat, idx) => (
          <div key={idx} className="skill-category-card">
            <h3 className="skill-cat-title">
              <span className="skill-icon-wrap">{cat.icon}</span> 
              <span>{cat.title}</span>
            </h3>
            <div className="skill-pills">
              {cat.isObj
                ? Object.entries(cat.data).map(([item, level]) => (
                    <div key={item} className="skill-pill">
                      <span className="skill-name">{item}</span>
                      <span className="skill-level-badge">{level}</span>
                    </div>
                  ))
                : cat.data.map((item, itemIdx) => (
                    <div key={itemIdx} className="skill-pill">
                      <span className="skill-name">{item}</span>
                    </div>
                  ))
              }
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;

