import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('it');
  const [dockPos, setDockPos] = useState('bottom');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('lifeplanner_theme');
    const savedLang = localStorage.getItem('lifeplanner_lang');
    const savedDock = localStorage.getItem('portfolio_dock_position');

    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
    if (savedDock) setDockPos(savedDock);
  }, []);

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
    localStorage.setItem('lifeplanner_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lifeplanner_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('portfolio_dock_position', dockPos);
  }, [dockPos]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'it' : 'en');
  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <SettingsContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme, 
      language, 
      setLanguage, 
      toggleLanguage,
      dockPos,
      setDockPos,
      isSettingsOpen,
      setIsSettingsOpen,
      openSettings,
      closeSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

