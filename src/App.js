import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import Header from './components/Header';

const Intro = lazy(() => import('./sections/Intro'));
const Skills = lazy(() => import('./sections/Skills'));
const Projects = lazy(() => import('./sections/Projects'));
const Contact = lazy(() => import('./sections/Contact'));
const Admin = lazy(() => import('./sections/Admin'));

function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Suspense fallback={<div className="loading-spinner">Caricamento...</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/intro" replace />} />
                <Route path="/intro" element={<Intro />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
