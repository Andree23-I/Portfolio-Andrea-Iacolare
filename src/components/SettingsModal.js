import React, { useContext, useEffect } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { translations } from '../translations';
import { 
  FiX, 
  FiMoon, 
  FiSun, 
  FiGlobe, 
  FiSliders, 
  FiCheck,
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
  FiInfo
} from 'react-icons/fi';
import './SettingsModal.css';

function SettingsModal() {
  const { 
    theme, 
    setTheme, 
    language, 
    setLanguage, 
    dockPos, 
    setDockPos, 
    isSettingsOpen, 
    closeSettings 
  } = useContext(SettingsContext);

  const t = translations[language];

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSettings();
      }
    };
    if (isSettingsOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isSettingsOpen, closeSettings]);

  if (!isSettingsOpen) return null;

  return (
    <div className="settings-overlay" onClick={closeSettings}>
      <div 
        className="settings-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        {/* Header */}
        <div className="settings-modal-header">
          <div className="settings-title-wrap">
            <div className="settings-icon-glow">
              <FiSliders />
            </div>
            <div>
              <h3 id="settings-title">{t.SettingsTitle || 'Preferenze & Personalizzazione'}</h3>
              <p className="settings-subtitle">{t.SettingsSubtitle || 'Personalizza tema, lingua e dock come preferisci.'}</p>
            </div>
          </div>
          <button 
            className="settings-close-btn" 
            onClick={closeSettings}
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="settings-modal-body">
          {/* 1. Theme Option */}
          <div className="settings-group">
            <label className="settings-group-label">
              <span>{t.ThemeTitle || 'Tema Visivo'}</span>
            </label>
            <div className="settings-grid-2">
              <button 
                type="button"
                className={`settings-card ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <div className="settings-card-icon dark-icon">
                  <FiMoon size={22} />
                </div>
                <div className="settings-card-content">
                  <span className="settings-card-name">{t.ThemeDark || 'Modalità Scura'}</span>
                  <span className="settings-card-desc">Obsidian & Emerald Glow</span>
                </div>
                {theme === 'dark' && <div className="settings-check"><FiCheck /></div>}
              </button>

              <button 
                type="button"
                className={`settings-card ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <div className="settings-card-icon light-icon">
                  <FiSun size={22} />
                </div>
                <div className="settings-card-content">
                  <span className="settings-card-name">{t.ThemeLight || 'Modalità Chiara'}</span>
                  <span className="settings-card-desc">Luminous Porcelain</span>
                </div>
                {theme === 'light' && <div className="settings-check"><FiCheck /></div>}
              </button>
            </div>
          </div>

          {/* 2. Language Option */}
          <div className="settings-group">
            <label className="settings-group-label">
              <span>{t.LangTitle || 'Lingua Interfaccia'}</span>
            </label>
            <div className="settings-grid-2">
              <button 
                type="button"
                className={`settings-card ${language === 'it' ? 'active' : ''}`}
                onClick={() => setLanguage('it')}
              >
                <div className="settings-card-flag">🇮🇹</div>
                <div className="settings-card-content">
                  <span className="settings-card-name">{t.LangIT || 'Italiano'}</span>
                  <span className="settings-card-desc">Lingua predefinita</span>
                </div>
                {language === 'it' && <div className="settings-check"><FiCheck /></div>}
              </button>

              <button 
                type="button"
                className={`settings-card ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                <div className="settings-card-flag">🇬🇧</div>
                <div className="settings-card-content">
                  <span className="settings-card-name">{t.LangEN || 'English'}</span>
                  <span className="settings-card-desc">English version</span>
                </div>
                {language === 'en' && <div className="settings-check"><FiCheck /></div>}
              </button>
            </div>
          </div>

          {/* 3. Dock Position Option */}
          <div className="settings-group">
            <label className="settings-group-label">
              <span>{t.DockLayoutTitle || 'Posizione Barra di Navigazione (Dock)'}</span>
            </label>
            <div className="settings-grid-3">
              <button 
                type="button"
                className={`settings-card settings-pos-card ${dockPos === 'bottom' ? 'active' : ''}`}
                onClick={() => setDockPos('bottom')}
              >
                <div className="dock-preview-box preview-bottom">
                  <div className="preview-bar-bottom"></div>
                </div>
                <span className="settings-card-name">{t.DockBottom || 'In Basso'}</span>
                <span className="settings-card-desc">Orizzontale</span>
                {dockPos === 'bottom' && <div className="settings-check"><FiCheck /></div>}
              </button>

              <button 
                type="button"
                className={`settings-card settings-pos-card ${dockPos === 'left' ? 'active' : ''}`}
                onClick={() => setDockPos('left')}
              >
                <div className="dock-preview-box preview-left">
                  <div className="preview-bar-left"></div>
                </div>
                <span className="settings-card-name">{t.DockLeft || 'A Sinistra'}</span>
                <span className="settings-card-desc">Verticale</span>
                {dockPos === 'left' && <div className="settings-check"><FiCheck /></div>}
              </button>

              <button 
                type="button"
                className={`settings-card settings-pos-card ${dockPos === 'right' ? 'active' : ''}`}
                onClick={() => setDockPos('right')}
              >
                <div className="dock-preview-box preview-right">
                  <div className="preview-bar-right"></div>
                </div>
                <span className="settings-card-name">{t.DockRight || 'A Destra'}</span>
                <span className="settings-card-desc">Verticale</span>
                {dockPos === 'right' && <div className="settings-check"><FiCheck /></div>}
              </button>
            </div>
          </div>

          {/* Interactive Tip */}
          <div className="settings-tip-box">
            <FiInfo className="tip-icon" />
            <p>{t.DockTip || 'Suggerimento: puoi anche trascinare la dock tenendo premuto con il mouse e rilasciandola su qualsiasi bordo dello schermo!'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="settings-modal-footer">
          <button 
            type="button"
            className="btn-primary settings-done-btn"
            onClick={closeSettings}
          >
            <FiCheck size={18} />
            <span>{t.SettingsClose || 'Fatto'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
