import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import { 
  FiSun, 
  FiMoon, 
  FiGlobe, 
  FiUser, 
  FiCode, 
  FiLayers, 
  FiMail
} from 'react-icons/fi';
import './Header.css';

const navItems = [
  { path: '/intro', labelKey: 'Intro', num: '01', icon: <FiUser /> },
  { path: '/skills', labelKey: 'Skills', num: '02', icon: <FiCode /> },
  { path: '/projects', labelKey: 'Projects', num: '03', icon: <FiLayers /> },
  { path: '/contact', labelKey: 'Contact', num: '04', icon: <FiMail /> },
];

function Header() {
  const { 
    theme, 
    toggleTheme, 
    language, 
    toggleLanguage
  } = useContext(SettingsContext);

  const t = translations[language] || translations.it;

  return (
    <header className="command-bar-wrapper" role="banner">
      <nav className="command-bar" aria-label="Main Navigation">
        {/* Brand Monogram */}
        <NavLink to="/intro" className="command-brand" title="Andrea Iacolare | Portfolio">
          <span className="brand-bracket">[</span>
          <span className="brand-monogram">AI</span>
          <span className="brand-divider">{'//'}</span>
          <span className="brand-year">26</span>
          <span className="brand-bracket">]</span>
          <span className="brand-status-indicator" title="System Operational & Available" />
        </NavLink>

        <div className="command-divider" />

        {/* Navigation Links */}
        <div className="command-nav-links">
          {navItems.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => isActive ? 'command-link active' : 'command-link'}
              title={t[item.labelKey] || item.labelKey}
            >
              <span className="command-link-num">{item.num}</span>
              <span className="command-link-icon">{item.icon}</span>
              <span className="command-link-text">{t[item.labelKey] || item.labelKey}</span>
            </NavLink>
          ))}
        </div>

        <div className="command-divider" />

        {/* Global Controls: Language & Theme */}
        <div className="command-actions">
          <button 
            onClick={toggleLanguage} 
            className="command-btn command-btn-lang" 
            title={language === 'en' ? 'Passa all\'Italiano' : 'Switch to English'}
            aria-label="Toggle language"
          >
            <FiGlobe className="command-btn-icon" />
            <span className="command-lang-code">{language.toUpperCase()}</span>
          </button>
          
          <button 
            onClick={toggleTheme} 
            className="command-btn command-btn-theme" 
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun className="command-btn-icon theme-sun" /> : <FiMoon className="command-btn-icon theme-moon" />}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
