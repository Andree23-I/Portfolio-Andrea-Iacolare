import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import projects from '../data/projects.json';
import './Section.css';

function Projects() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];
  
  return (
    <section id="projects-section" className="section projects">
      <h2>{t.ProjectsTitle}</h2>
      <div className="project-grid">
        {projects.map((p, idx) => {
          // Bento box sizing logic: alterniamo le larghezze per creare una griglia asimmetrica moderna
          const isLarge = idx % 3 === 0;
          const colSpan = isLarge ? 'span 8' : 'span 4';

          return (
            <div 
              key={idx} 
              className="project-card"
              style={{
                gridColumn: colSpan,
                '--bg-image': p.image ? `url(${process.env.PUBLIC_URL + '/' + p.image})` : 'none'
              }}
            >
              <div className="project-card-content">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="project-tech-stack">
                  {p.techStack.map((tech, techIdx) => (
                    <span key={techIdx} className="tech-badge">{tech}</span>
                  ))}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    {language === 'en' ? 'Live Demo' : 'Demo'}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Projects;
