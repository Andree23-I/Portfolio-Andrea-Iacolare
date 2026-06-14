import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import { FiSun, FiMoon, FiGlobe } from 'react-icons/fi';
import './Header.css';

const navItems = [
  { path: '/intro', labelKey: 'Intro' },
  { path: '/skills', labelKey: 'Skills' },
  { path: '/projects', labelKey: 'Projects' },
  { path: '/contact', labelKey: 'Contact' },
];

function Header() {
  const { theme, toggleTheme, language, toggleLanguage } = useContext(SettingsContext);
  const t = translations[language];
  
  return (
    <header className="top-navbar glass-panel">
      <div className="navbar-content">
        <h1 className="brand">AI.</h1>
        
        <nav className="nav-links">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {t[item.labelKey] || item.labelKey}
            </NavLink>
          ))}
        </nav>

        <div className="toggles">
          <button onClick={toggleLanguage} className="btn-toggle" title="Change Language">
            <FiGlobe /> {language.toUpperCase()}
          </button>
          <button onClick={toggleTheme} className="btn-toggle" title="Toggle Theme">
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
