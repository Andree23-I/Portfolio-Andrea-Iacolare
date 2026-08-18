import React, { useContext, useState } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import projects from '../data/projects.json';
import { FiExternalLink, FiLayers, FiCode } from 'react-icons/fi';
import './Section.css';

function Projects() {
  const { language } = useContext(SettingsContext);
  const t = translations[language];
  const [imgErrors, setImgErrors] = useState({});

  const handleImageError = (idx) => {
    setImgErrors(prev => ({ ...prev, [idx]: true }));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const publicUrl = process.env.PUBLIC_URL || '';
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return publicUrl ? `${publicUrl}/${cleanPath}` : `/${cleanPath}`;
  };

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

      <div className="projects-grid">
        {projects.map((p, idx) => {
          const hasError = imgErrors[idx] || !p.image;
          const imageUrl = getImageUrl(p.image);
          const domain = getDisplayDomain(p.link);

          return (
            <div key={idx} className="project-card">
              {/* Browser Mockup Frame */}
              <div className="browser-mockup">
                <div className="browser-header">
                  <div className="browser-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="browser-address-bar">
                    https://{domain}
                  </div>
                </div>

                <div className="project-img-wrapper">
                  {!hasError ? (
                    <img 
                      src={imageUrl} 
                      alt={`${p.title} Preview Screenshot`} 
                      className="project-img"
                      onError={() => handleImageError(idx)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="project-img-fallback">
                      <FiCode size={36} />
                      <span>{p.title}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Card Content */}
              <div className="project-card-body">
                <div className="project-card-title-row">
                  <h3>{p.title}</h3>
                  <span className="project-status-tag">{t.Featured}</span>
                </div>

                <p className="project-description">{p.description}</p>

                <div className="project-tech-stack">
                  {p.techStack && p.techStack.map((tech, techIdx) => (
                    <span key={techIdx} className="tech-badge">{tech}</span>
                  ))}
                </div>

                <div className="project-actions">
                  <a 
                    href={p.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary"
                    title={`Open ${p.title} live demo`}
                  >
                    <span>{t.LiveDemo}</span>
                    <FiExternalLink />
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

