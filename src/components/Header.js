import React, { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  { path: '/intro', sectionId: 'hero', labelKey: 'Intro', num: '01', icon: <FiUser /> },
  { path: '/skills', sectionId: 'craft', labelKey: 'Skills', num: '02', icon: <FiCode /> },
  { path: '/projects', sectionId: 'work', labelKey: 'Projects', num: '03', icon: <FiLayers /> },
  { path: '/contact', sectionId: 'contact', labelKey: 'Contact', num: '04', icon: <FiMail /> },
];

function Header() {
  const { 
    theme, 
    toggleTheme, 
    language, 
    toggleLanguage
  } = useContext(SettingsContext);

  const location = useLocation();
  const navigate = useNavigate();
  const t = translations[language] || translations.it;

  const handleLinkClick = (e, item) => {
    // If on intro page and section element exists, smooth scroll to it
    if (location.pathname === '/intro' || location.pathname === '/') {
      const element = document.getElementById(item.sectionId);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // Otherwise standard navigation
    navigate(item.path);
  };

  return (
    <header className="command-bar-wrapper" role="banner">
      <nav className="command-bar" aria-label="Main Navigation">
        {/* Brand Monogram */}
        <NavLink 
          to="/intro" 
          className="command-brand" 
          title="Andrea Iacolare | Portfolio"
          onClick={(e) => {
            if (location.pathname === '/intro' || location.pathname === '/') {
              const el = document.getElementById('hero');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }}
        >
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
              onClick={(e) => handleLinkClick(e, item)}
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
