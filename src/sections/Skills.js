import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import skillsData from '../data/skills.json';
import './Section.css';
import { FiCode, FiTool, FiMonitor } from 'react-icons/fi';

function Skills() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];
  const { languages, tools, programming } = skillsData;

  const categories = [
    { title: t.Language || 'Languages', icon: <FiCode />, data: languages, isObj: true },
    { title: t.Programming || 'Programming', icon: <FiMonitor />, data: programming, isObj: true },
    { title: t.Tools || 'Tools', icon: <FiTool />, data: tools, isObj: false },
  ];

  return (
    <section className="section skills glass-panel">
      <h2>{t.SkillsTitle}</h2>
      
      <div className="skills-grid">
        {categories.map((cat, idx) => (
          <div key={idx} className="skill-category-card glass-panel">
            <h3 className="skill-cat-title">
              <span className="skill-icon">{cat.icon}</span> {cat.title}
            </h3>
            <div className="skill-pills">
              {cat.isObj
                ? Object.entries(cat.data).map(([item, level]) => (
                    <div key={item} className="skill-pill">
                      <span className="skill-name">{item}</span>
                      <span className="skill-level">{level}</span>
                    </div>
                  ))
                : cat.data.map(item => (
                    <div key={item} className="skill-pill">
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
