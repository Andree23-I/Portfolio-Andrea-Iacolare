import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import projects from '../data/projects.json';
import './Section.css';

function Projects() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];
  return (
    <section className="section projects glass-panel">
      <h2>{t.ProjectsTitle}</h2>
      <div className="project-grid">
        {projects.map((p, idx) => (
          <div key={idx} className="project-card">
            {p.image && <img src={process.env.PUBLIC_URL + '/' + p.image} alt={p.title} className="project-img" loading="lazy" />}
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p><strong>{t.TechStack || 'Tech Stack'}:</strong> {p.techStack.join(', ')}</p>
            <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-primary">{language === 'en' ? 'Live Demo' : 'Demo'}</a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
