import React, { useContext, useState } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import projects from '../data/projects.json';
import CardStack from '../components/CardStack';
import { FiExternalLink, FiLayers, FiCheckCircle } from 'react-icons/fi';
import './Section.css';

function Projects() {
  const { language } = useContext(SettingsContext);
  const t = translations[language] || translations.it;

  const activeProjects = t.projectsData || projects;
  const [activeIndex, setActiveIndex] = useState(0);

  const currentProject = activeProjects[activeIndex] || activeProjects[0];

  const getDisplayDomain = (link) => {
    try {
      const url = new URL(link);
      return url.hostname.replace('www.', '');
    } catch {
      return 'project.demo';
    }
  };

  return (
    <section id="projects-section" className="section projects">
      <div className="section-header">
        <span className="section-badge">
          <FiLayers /> {t.Projects}
        </span>
        <h2>{t.ProjectsTitle}</h2>
        <p className="section-subtitle">{t.ProjectsSubtitle}</p>
      </div>

      {/* 3D Card Stack Carousel */}
      <div className="projects-carousel-wrapper">
        <CardStack
          items={activeProjects}
          initialIndex={0}
          loop={true}
          autoAdvance={true}
          intervalMs={4500}
          pauseOnHover={true}
          showDots={true}
          onChangeIndex={(idx) => setActiveIndex(idx)}
          t={t}
        />
      </div>

      {/* Active Project Spotlight Card */}
      {currentProject && (
        <div className="active-project-spotlight glass-panel">
          <div className="spotlight-header">
            <div className="spotlight-meta">
              <span className="spotlight-index-pill">
                {activeIndex + 1} / {activeProjects.length}
              </span>
              <span className="spotlight-domain">
                https://{getDisplayDomain(currentProject.link)}
              </span>
            </div>
            <span className="project-status-tag">
              <FiCheckCircle style={{ marginRight: '4px' }} />
              {t.Featured || 'Featured'}
            </span>
          </div>

          <div className="spotlight-body">
            <div className="spotlight-info">
              <h3>{currentProject.title}</h3>
              <p className="spotlight-description">{currentProject.description}</p>
              
              <div className="project-tech-stack">
                {currentProject.techStack &&
                  currentProject.techStack.map((tech, techIdx) => (
                    <span key={techIdx} className="tech-badge">
                      {tech}
                    </span>
                  ))}
              </div>
            </div>

            <div className="spotlight-action">
              <a
                href={currentProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                title={`Open ${currentProject.title} live demo`}
              >
                <span>{t.LiveDemo || 'Visita Sito'}</span>
                <FiExternalLink />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Projects;
