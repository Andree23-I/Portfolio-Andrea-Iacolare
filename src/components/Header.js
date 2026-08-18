import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import { FiSun, FiMoon, FiGlobe, FiUser, FiCode, FiLayers, FiMail } from 'react-icons/fi';
import './Header.css';

const navItems = [
  { path: '/intro', labelKey: 'Intro', icon: <FiUser /> },
  { path: '/skills', labelKey: 'Skills', icon: <FiCode /> },
  { path: '/projects', labelKey: 'Projects', icon: <FiLayers /> },
  { path: '/contact', labelKey: 'Contact', icon: <FiMail /> },
];

function Header() {
  const { theme, toggleTheme, language, toggleLanguage } = useContext(SettingsContext);
  const t = translations[language];

  return (
    <header className="mac-dock" role="navigation" aria-label="Main Navigation">
      <div className="dock-content">
        <nav className="nav-links">
          {navItems.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              title={t[item.labelKey] || item.labelKey}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{t[item.labelKey] || item.labelKey}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dock-divider"></div>

        <div className="toggles">
          <button 
            onClick={toggleLanguage} 
            className="btn-toggle btn-lang" 
            title={language === 'en' ? 'Passa all\'Italiano' : 'Switch to English'}
            aria-label="Toggle language"
          >
            <FiGlobe />
            <span className="lang-badge">{language.toUpperCase()}</span>
          </button>
          <button 
            onClick={toggleTheme} 
            className="btn-toggle btn-theme" 
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun className="theme-icon sun" /> : <FiMoon className="theme-icon moon" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

