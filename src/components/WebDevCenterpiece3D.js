import React, { useState, useEffect, useRef } from 'react';
import './WebDevCenterpiece3D.css';
import { 
  FiRefreshCw, 
  FiLock, 
  FiTerminal, 
  FiCode, 
  FiMonitor, 
  FiSmartphone, 
  FiTablet, 
  FiZap, 
  FiExternalLink,
  FiCpu
} from 'react-icons/fi';

export default function WebDevCenterpiece3D({ t, onTriggerFlash }) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  
  // Interactive state
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'code' | 'terminal'
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [isWireframe, setIsWireframe] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [buildCount, setBuildCount] = useState(1);
  const [showFlash, setShowFlash] = useState(false);

  // Smooth mouse tilt state
  const mouseState = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    rafId: null,
  });

  // Synthesized Web Audio Click / Shutter Sound (Zero external audio file dependency)
  const playShutterSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // High click burst
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // AudioContext not allowed without prior user gesture or disabled
    }
  };

  // Compile / Shutter Trigger (Counterpart to Emma Parker's camera shutter!)
  const handleTriggerCompile = (e) => {
    if (e) e.stopPropagation();
    if (isCompiling) return;

    setIsCompiling(true);
    setShowFlash(true);
    playShutterSound();
    if (onTriggerFlash) onTriggerFlash();

    setTimeout(() => {
      setShowFlash(false);
    }, 280);

    setTimeout(() => {
      setIsCompiling(false);
      setBuildCount((prev) => prev + 1);
    }, 600);
  };

  // Mouse tilt tracking with smooth spring interpolation
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Normalize between -1 and 1
      const normX = Math.max(-1, Math.min(1, x / (rect.width / 2)));
      const normY = Math.max(-1, Math.min(1, y / (rect.height / 2)));

      // Max tilt degrees: 14 deg
      mouseState.current.targetX = normX * 14;
      mouseState.current.targetY = -normY * 12;
    };

    const handleMouseLeave = () => {
      mouseState.current.targetX = 0;
      mouseState.current.targetY = 0;
    };

    const container = containerRef.current;
    if (container) {
      window.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation loop for fluid 60fps damping
    const animate = () => {
      const state = mouseState.current;
      state.currentX += (state.targetX - state.currentX) * 0.08;
      state.currentY += (state.targetY - state.currentY) * 0.08;

      if (cardRef.current) {
        cardRef.current.style.transform = `
          perspective(1200px)
          rotateX(${state.currentY}deg)
          rotateY(${state.currentX}deg)
          translateZ(20px)
        `;
      }

      state.rafId = requestAnimationFrame(animate);
    };

    const currentMouseState = mouseState.current;
    currentMouseState.rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (container) container.removeEventListener('mouseleave', handleMouseLeave);
      if (currentMouseState.rafId) cancelAnimationFrame(currentMouseState.rafId);
    };
  }, []);

  return (
    <div 
      className={`webdev-3d-stage ${isMaximized ? 'is-maximized' : ''} ${isWireframe ? 'is-wireframe' : ''}`}
      ref={containerRef}
    >
      {/* Flash Shutter Effect Overlay */}
      {showFlash && <div className="shutter-flash-overlay" aria-hidden="true" />}

      {/* 3D Floating Perspective Card */}
      <div 
        className="webdev-3d-workstation"
        ref={cardRef}
        onClick={handleTriggerCompile}
        title="Click to trigger live compile & shutter flash"
      >
        {/* Floating 3D Tech Orbitals */}
        <div className="tech-orbital orbital-top-left" data-depth="60">
          <span className="orbital-dot" />
          <span className="orbital-tag">NEXT.JS 15</span>
        </div>

        <div className="tech-orbital orbital-top-right" data-depth="80">
          <span className="orbital-dot" />
          <span className="orbital-tag">REACT 18</span>
        </div>

        <div className="tech-orbital orbital-bottom-left" data-depth="70">
          <span className="orbital-dot" />
          <span className="orbital-tag">TAILWIND v4</span>
        </div>

        <div className="tech-orbital orbital-bottom-right" data-depth="90">
          <span className="orbital-dot" />
          <span className="orbital-tag">AI AGENTS</span>
        </div>

        {/* Browser Chrome Header */}
        <div className="workstation-chrome" onClick={(e) => e.stopPropagation()}>
          {/* Traffic Light Controls */}
          <div className="chrome-traffic-lights">
            <button 
              className="traffic-light light-red" 
              onClick={() => handleTriggerCompile()}
              title="Trigger Build & Flash"
              aria-label="Trigger Compile"
            />
            <button 
              className="traffic-light light-yellow" 
              onClick={() => setIsWireframe(!isWireframe)}
              title={isWireframe ? "Disable Wireframe Mode" : "Enable Wireframe Blueprint Mode"}
              aria-label="Toggle Wireframe Mode"
            />
            <button 
              className="traffic-light light-green" 
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? "Restore Size" : "Expand Viewport"}
              aria-label="Toggle Fullscreen"
            />
          </div>

          {/* Mode Switch Tabs */}
          <div className="chrome-mode-tabs">
            <button 
              className={`mode-tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              <FiMonitor className="tab-icon" />
              <span>LIVE PREVIEW</span>
            </button>
            <button 
              className={`mode-tab ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              <FiCode className="tab-icon" />
              <span>REACT.TSX</span>
            </button>
            <button 
              className={`mode-tab ${activeTab === 'terminal' ? 'active' : ''}`}
              onClick={() => setActiveTab('terminal')}
            >
              <FiTerminal className="tab-icon" />
              <span>SYSTEM LOG</span>
            </button>
          </div>

          {/* Device Breakpoint Selectors */}
          <div className="chrome-device-controls">
            <button 
              className={`device-btn ${deviceMode === 'desktop' ? 'active' : ''}`}
              onClick={() => setDeviceMode('desktop')}
              title="Desktop View (1440px)"
            >
              <FiMonitor />
            </button>
            <button 
              className={`device-btn ${deviceMode === 'tablet' ? 'active' : ''}`}
              onClick={() => setDeviceMode('tablet')}
              title="Tablet View (768px)"
            >
              <FiTablet />
            </button>
            <button 
              className={`device-btn ${deviceMode === 'mobile' ? 'active' : ''}`}
              onClick={() => setDeviceMode('mobile')}
              title="Mobile View (390px)"
            >
              <FiSmartphone />
            </button>
          </div>
        </div>

        {/* Address / Telemetry Bar */}
        <div className="workstation-url-bar" onClick={(e) => e.stopPropagation()}>
          <div className="url-container">
            <FiLock className="url-lock-icon" />
            <span className="url-protocol">https://</span>
            <span className="url-domain">andreaiacolare.dev</span>
            <span className="url-path">/projects/{activeTab}</span>
          </div>

          <div className="url-telemetry">
            <span className="telemetry-badge status-online">
              <span className="status-indicator-dot" />
              <span>200 OK</span>
            </span>
            <span className="telemetry-badge">12ms TTFB</span>
            <button 
              className={`url-reload-btn ${isCompiling ? 'spinning' : ''}`}
              onClick={handleTriggerCompile}
              title="Recompile & Flash"
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>

        {/* Interactive Viewport Display */}
        <div className={`workstation-viewport device-${deviceMode}`}>
          {activeTab === 'preview' && (
            <div className="viewport-inner preview-mode">
              {/* Mini Interactive Web App Showcase */}
              <div className="mini-web-header">
                <div className="mini-brand">
                  <span className="mini-logo">AI</span>
                  <span className="mini-title">SOUTHDV.STUDIO</span>
                </div>
                <div className="mini-nav">
                  <span className="mini-nav-item active">Overview</span>
                  <span className="mini-nav-item">Cases</span>
                  <span className="mini-nav-item">Deploy</span>
                </div>
                <span className="mini-badge-pill">NEXT.JS 15</span>
              </div>

              <div className="mini-web-hero">
                <div className="mini-hero-tagline">
                  <span className="tag-bracket">[</span>
                  <span>CREATIVE PRODUCTION STUDIO</span>
                  <span className="tag-bracket">]</span>
                </div>
                <h4 className="mini-hero-heading">
                  High-Performance Web & Digital Spaces.
                </h4>
                <p className="mini-hero-desc">
                  Engineered with React 18, ultra-smooth physics, and responsive architecture.
                </p>

                {/* Mini Metric Cards */}
                <div className="mini-cards-row">
                  <div className="mini-stat-card">
                    <span className="stat-num">100/100</span>
                    <span className="stat-label">LIGHTHOUSE</span>
                  </div>
                  <div className="mini-stat-card highlight">
                    <span className="stat-num">&lt; 80ms</span>
                    <span className="stat-label">EDGE LATENCY</span>
                  </div>
                  <div className="mini-stat-card">
                    <span className="stat-num">0.0s</span>
                    <span className="stat-label">CLS SCORE</span>
                  </div>
                </div>

                <div className="mini-cta-row">
                  <a 
                    href="https://southdvstudio.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mini-live-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>southdv.studio</span>
                    <FiExternalLink />
                  </a>

                  <button 
                    className="mini-compile-btn"
                    onClick={handleTriggerCompile}
                  >
                    <FiZap />
                    <span>{isCompiling ? 'COMPILING...' : `SHUTTER FLASH #${buildCount}`}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="viewport-inner code-mode">
              <div className="code-editor-header">
                <span className="file-name">PortfolioArchitecture.tsx</span>
                <span className="file-size">1.4 KB • TypeScript</span>
              </div>
              <pre className="code-display">
                <code>
{`// Andrea Iacolare - Modern Web Architecture
import { createDigitalExperience } from '@andrea/core';
import { Next15, React18, AgenticAI } from 'modern-web-stack';

export default async function Experience() {
  const system = await createDigitalExperience({
    architect: 'Andrea Iacolare',
    location: 'Salerno, Italy // 40.68° N',
    focus: ['Full-Stack', 'Creative Interaction', 'AI Systems'],
    performance: {
      lighthouse: 100,
      tti: 'instant',
      frameRate: '60fps steady'
    }
  });

  return (
    <SystemStage status="OPTIMAL" builds={${buildCount}}>
      <InteractiveCenterpiece mode="3D_WEB_CANVAS" />
      <SelectedWorks items={['southdv.studio', 'Foto Extracolor']} />
    </SystemStage>
  );
}`}
                </code>
              </pre>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="viewport-inner terminal-mode">
              <div className="terminal-log-stream">
                <p className="log-line text-dim font-mono">
                  [SYSTEM_INIT] Loading Next.js 15.1.0 & React 18.3.1 runtime...
                </p>
                <p className="log-line text-cyan font-mono">
                  [NETWORK] Handshake established with Vercel Edge Network (Rome node).
                </p>
                <p className="log-line text-white font-mono">
                  [BUILD] Bundling assets: southdvstudio.svg, CardStack.js, Interactive3D.js
                </p>
                <p className="log-line text-emerald font-mono">
                  ✓ Compiled in 38ms (1,420 modules)
                </p>
                <p className="log-line text-emerald font-mono">
                  ✓ Core Web Vitals: LCP 0.6s | FID 2ms | CLS 0.000
                </p>
                <p className="log-line text-amber font-mono">
                  ⚡ SHUTTER COMPILE TRIGGER READY: #{buildCount} [STATUS: ACTIVE]
                </p>
                <div className="terminal-cursor-line">
                  <span className="cursor-prompt">dev@andrea:~$</span>
                  <span className="cursor-cmd">deploy --prod --instant</span>
                  <span className="cursor-blink">█</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Workstation Footer Status Bar */}
        <div className="workstation-footer-bar" onClick={(e) => e.stopPropagation()}>
          <div className="footer-status-left">
            <span className="cpu-indicator">
              <FiCpu className="cpu-icon" />
              <span>CPU: OPTIMAL</span>
            </span>
            <span className="divider">/</span>
            <span className="fps-indicator">60 FPS</span>
          </div>

          <div className="footer-status-right">
            <button 
              className="footer-shutter-trigger"
              onClick={handleTriggerCompile}
              title="Trigger Compile Flash"
            >
              <FiZap className="shutter-bolt" />
              <span>[ TRIGGER COMPILE FLASH ]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
