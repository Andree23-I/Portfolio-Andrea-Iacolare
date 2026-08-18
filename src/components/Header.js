import React, { useContext, useState, useRef } from 'react';
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
  FiMail,
  FiMoreVertical,
  FiMoreHorizontal,
  FiSettings
} from 'react-icons/fi';
import './Header.css';

const navItems = [
  { path: '/intro', labelKey: 'Intro', icon: <FiUser /> },
  { path: '/skills', labelKey: 'Skills', icon: <FiCode /> },
  { path: '/projects', labelKey: 'Projects', icon: <FiLayers /> },
  { path: '/contact', labelKey: 'Contact', icon: <FiMail /> },
];

function Header() {
  const { 
    theme, 
    toggleTheme, 
    language, 
    toggleLanguage,
    dockPos,
    setDockPos,
    openSettings
  } = useContext(SettingsContext);

  const t = translations[language];

  const [isDragging, setIsDragging] = useState(false);
  const [dragCoords, setDragCoords] = useState({ x: 0, y: 0 });
  const [snapTarget, setSnapTarget] = useState(null);

  const dragStartRef = useRef({ startX: 0, startY: 0, didMove: false });
  const dockRef = useRef(null);

  // Robust Pointer Capture Drag Handling
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    // Do not initiate drag when clicking actual nav links or theme/lang/settings toggles
    if (e.target.closest('.nav-link') || e.target.closest('.btn-action-toggle')) {
      return;
    }

    const pointerId = e.pointerId;
    const startX = e.clientX;
    const startY = e.clientY;
    dragStartRef.current = { startX, startY, didMove: false };

    const targetEl = dockRef.current;
    if (!targetEl) return;

    const handlePointerMove = (moveEvent) => {
      const curX = moveEvent.clientX;
      const curY = moveEvent.clientY;
      const dx = curX - startX;
      const dy = curY - startY;

      if (!dragStartRef.current.didMove && Math.hypot(dx, dy) > 5) {
        dragStartRef.current.didMove = true;
        try {
          targetEl.setPointerCapture(pointerId);
        } catch (_) {}
        setIsDragging(true);
      }

      if (dragStartRef.current.didMove) {
        setDragCoords({ x: curX, y: curY });

        const width = window.innerWidth;
        const height = window.innerHeight;

        if (curX < width * 0.3) {
          setSnapTarget('left');
        } else if (curX > width * 0.7) {
          setSnapTarget('right');
        } else if (curY > height * 0.5) {
          setSnapTarget('bottom');
        } else {
          setSnapTarget('bottom');
        }
      }
    };

    const handlePointerUp = (upEvent) => {
      try {
        targetEl.releasePointerCapture(pointerId);
      } catch (_) {}

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      if (dragStartRef.current.didMove) {
        const width = window.innerWidth;
        const curX = upEvent.clientX;

        if (curX < width * 0.3) {
          setDockPos('left');
        } else if (curX > width * 0.7) {
          setDockPos('right');
        } else {
          setDockPos('bottom');
        }
      } else {
        // Quick click on the handle cycles position
        if (e.target.closest('.dock-handle')) {
          setDockPos(prev => {
            if (prev === 'bottom') return 'left';
            if (prev === 'left') return 'right';
            return 'bottom';
          });
        }
      }

      setIsDragging(false);
      setSnapTarget(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const isVertical = dockPos === 'left' || dockPos === 'right';

  return (
    <>
      {/* Snap Zones Indicators while dragging */}
      {isDragging && (
        <div className="dock-snap-zones">
          <div className={`snap-zone snap-left ${snapTarget === 'left' ? 'active' : ''}`}>
            <div className="snap-indicator"></div>
          </div>
          <div className={`snap-zone snap-bottom ${snapTarget === 'bottom' ? 'active' : ''}`}>
            <div className="snap-indicator"></div>
          </div>
          <div className={`snap-zone snap-right ${snapTarget === 'right' ? 'active' : ''}`}>
            <div className="snap-indicator"></div>
          </div>
        </div>
      )}

      <header 
        ref={dockRef}
        className={`mac-dock dock-${dockPos} ${isVertical ? 'dock-vertical' : 'dock-horizontal'} ${isDragging ? 'is-dragging' : ''}`} 
        role="navigation" 
        aria-label="Main Navigation"
        onPointerDown={handlePointerDown}
        style={{
          '--drag-x': `${dragCoords.x}px`,
          '--drag-y': `${dragCoords.y}px`
        }}
      >
        <div className="dock-content">
          {/* Subtle Drag & Cycle Handle */}
          <div 
            className="dock-handle" 
            title="Trascina la dock a Sinistra, Destra o in Basso (oppure fai click per cambiare lato)"
          >
            {isVertical ? <FiMoreHorizontal /> : <FiMoreVertical />}
          </div>

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
                {isVertical && (
                  <span className="dock-tooltip">
                    {t[item.labelKey] || item.labelKey}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="dock-divider"></div>

          <div className="toggles">
            {/* Direct Crystal-Clear Settings Button */}
            <button 
              onClick={openSettings} 
              className="btn-toggle btn-action-toggle btn-settings" 
              title={t.Settings || 'Impostazioni'}
              aria-label="Open settings"
            >
              <FiSettings className="settings-btn-icon" />
              {isVertical && (
                <span className="dock-tooltip">
                  {t.Settings || 'Impostazioni'}
                </span>
              )}
            </button>

            <button 
              onClick={toggleLanguage} 
              className="btn-toggle btn-action-toggle btn-lang" 
              title={language === 'en' ? 'Passa all\'Italiano' : 'Switch to English'}
              aria-label="Toggle language"
            >
              <FiGlobe />
              <span className="lang-badge">{language.toUpperCase()}</span>
            </button>
            
            <button 
              onClick={toggleTheme} 
              className="btn-toggle btn-action-toggle btn-theme" 
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun className="theme-icon sun" /> : <FiMoon className="theme-icon moon" />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
