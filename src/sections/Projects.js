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
            {p.image && <img src={process.env.PUBLIC_URL + '/' + p.image} alt={p.title} loading="lazy" />}
            <div className="project-card-content">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="project-tech-stack">
                {p.techStack.map((tech, techIdx) => (
                  <span key={techIdx} className="tech-badge">{tech}</span>
                ))}
              </div>
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-primary">{language === 'en' ? 'Live Demo' : 'Demo'}</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
