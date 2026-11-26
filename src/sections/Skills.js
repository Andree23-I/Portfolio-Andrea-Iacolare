import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import './Section.css';
import { 
  FiCode, 
  FiCpu, 
  FiGlobe, 
  FiTool, 
  FiZap
} from 'react-icons/fi';

function Skills() {
  const { language } = useContext(SettingsContext);
  const t = translations[language] || translations.it;

  const categories = [
    {
      code: "01 // CORE ARCHITECTURE",
      title: language === 'en' ? "Frontend & Modern Web" : "Frontend & Web Moderno",
      icon: <FiCode />,
      skills: [
        { name: "React 18", level: "Advanced" },
        { name: "Next.js 15", level: "Production" },
        { name: "TypeScript", level: "Solid Base" },
        { name: "JavaScript ES6+", level: "Advanced" },
        { name: "HTML5 & Modern CSS", level: "Mastery" },
        { name: "Tailwind CSS v4", level: "Production" },
        { name: "Vite", level: "Fast Build" },
        { name: "C++", level: "Intermediate" }
      ]
    },
    {
      code: "02 // AGENTIC AI & AUTOMATION",
      title: language === 'en' ? "Intelligent Systems & AI" : "Sistemi Intelligenti & AI",
      icon: <FiZap />,
      skills: [
        { name: "Agentic Workflows", level: "Active" },
        { name: "LLM APIs Integration", level: "Production" },
        { name: "Autonomous Agents", level: "Specialized" },
        { name: "Prompt Architecture", level: "Advanced" },
        { name: "MCP Protocol", level: "Integrated" },
        { name: "AI Web Automation", level: "Production" }
      ]
    },
    {
      code: "03 // TOOLING & PIPELINES",
      title: language === 'en' ? "Engineering Environment" : "Ambiente & Tooling",
      icon: <FiTool />,
      skills: [
        { name: "Git & GitHub", level: "Daily Workflow" },
        { name: "VS Code / Antigravity", level: "Power User" },
        { name: "Vercel Cloud", level: "CI/CD & Deploy" },
        { name: "REST APIs & JSON", level: "Architecture" },
        { name: "Chrome DevTools", level: "Deep Auditing" },
        { name: "Microsoft Excel", level: "Data Processing" }
      ]
    },
    {
      code: "04 // GLOBAL COMMUNICATION",
      title: language === 'en' ? "Spoken Languages" : "Lingue Parlate",
      icon: <FiGlobe />,
      skills: [
        { name: language === 'en' ? "Italian" : "Italiano", level: language === 'en' ? "Native" : "Madrelingua" },
        { name: language === 'en' ? "Spanish" : "Spagnolo", level: "B2 Working Proficiency" },
        { name: language === 'en' ? "English" : "Inglese", level: "B1 Professional Technical" }
      ]
    }
  ];

  return (
    <section id="skills-section" className="section skills">
      <div className="section-header">
        <span className="section-badge">
          <FiCpu /> {t.Skills || 'Competenze'}
        </span>
        <h2>{t.SkillsTitle || 'Specimen Matrix & Tech Stack'}</h2>
        <p className="section-subtitle">
          {language === 'en' 
            ? "A disciplined technical inventory spanning modern frontend architectures, intelligent agentic workflows, and production-grade tooling."
            : "Un inventario tecnico disciplinato tra architetture frontend moderne, flussi agentici intelligenti e strumenti di produzione all'avanguardia."}
        </p>
      </div>
      
      <div className="skills-grid">
        {categories.map((cat, idx) => (
          <div key={idx} className="skill-category-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="font-mono-tag" style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>
                {cat.code}
              </span>
              <div className="skill-icon-wrap">{cat.icon}</div>
            </div>

            <h3 className="skill-cat-title" style={{ marginBottom: '1.25rem' }}>
              <span>{cat.title}</span>
            </h3>

            <div className="skill-pills">
              {cat.skills.map((s, sIdx) => (
                <div key={sIdx} className="skill-pill">
                  <span className="skill-name">{s.name}</span>
                  <span className="skill-level-badge">{s.level}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
