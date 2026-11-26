import React, { Suspense, lazy, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { SettingsProvider, SettingsContext } from './contexts/SettingsContext';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import HangingGlassPortal from './components/HangingGlassPortal';

const Intro = lazy(() => import('./sections/Intro'));
const Skills = lazy(() => import('./sections/Skills'));
const Projects = lazy(() => import('./sections/Projects'));
const Contact = lazy(() => import('./sections/Contact'));
const Admin = lazy(() => import('./sections/Admin'));

function AppContent() {
  const { isPortalOpen, closePortal, openPortal, language } = useContext(SettingsContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectDestination = (dest) => {
    closePortal();
    if (!dest) return;

    // Direct routing if different path, or smooth scroll
    if (dest.path && dest.path !== location.pathname) {
      navigate(dest.path);
    } else {
      if (location.pathname !== '/intro' && location.pathname !== '/') {
        navigate('/intro');
        setTimeout(() => {
          const el = document.getElementById(dest.sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(dest.sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="app-container">
      {/* 21st.dev Hanging Glass Gallery Entrance Portal */}
      <HangingGlassPortal 
        isOpen={isPortalOpen}
        onClose={closePortal}
        onSelectDestination={handleSelectDestination}
        language={language}
      />

      <Header onOpenPortal={openPortal} />
      <SettingsModal />
      <main className="main-content">
        <Suspense fallback={<div className="loading-spinner">Caricamento...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/intro" replace />} />
            <Route path="/intro" element={<Intro onOpenPortal={openPortal} />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <Router>
        <AppContent />
      </Router>
    </SettingsProvider>
  );
}

export default App;
