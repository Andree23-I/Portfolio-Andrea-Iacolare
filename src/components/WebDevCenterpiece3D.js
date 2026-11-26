import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import './WebDevCenterpiece3D.css';
import { 
  FiMonitor, 
  FiSmartphone, 
  FiCode, 
  FiRefreshCw, 
  FiExternalLink
} from 'react-icons/fi';

export default function WebDevCenterpiece3D({ language = 'it' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Active focus mode: 'overview' | 'desktop' | 'mobile' | 'code'
  const [activeFocus, setActiveFocus] = useState('overview');
  const [isDragging, setIsDragging] = useState(false);

  // References for Three.js state & mutable animation values
  const threeRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    sculptureGroup: null,
    desktopMesh: null,
    mobileMesh: null,
    codeMesh: null,
    interactiveMeshes: [],
    raycaster: new THREE.Raycaster(),
    mouseVec: new THREE.Vector2(),
    halo1: null,
    halo2: null,
    orbitals: [],
    
    // Focus angles and camera targets
    activeMode: 'overview',
    baseRotX: 0.12,
    baseRotY: -0.22,
    targetRotX: 0.12,
    targetRotY: -0.22,
    curRotX: 0.12,
    curRotY: -0.22,
    
    targetCamX: 0,
    targetCamY: 0.1,
    targetCamZ: 5.4,
    
    targetLookAt: new THREE.Vector3(0, 0, 0),
    curLookAt: new THREE.Vector3(0, 0, 0),
    
    userDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    startRotX: 0,
    startRotY: 0,
    
    desktopTexture: null,
    mobileTexture: null,
    codeTexture: null
  });

  // Synthesized Soft Haptic Audio Click (Zero Flash)
  const playSoftClick = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }, []);

  // Update focus perspective on one of the devices
  const setFocus = useCallback((mode) => {
    setActiveFocus(mode);
    playSoftClick();
    const state = threeRef.current;
    if (!state.camera) return;

    state.activeMode = mode;
    const isMobileViewport = (containerRef.current?.clientWidth || window.innerWidth) < 768;

    if (mode === 'desktop') {
      // Zoom right into the Desktop Viewport showing southdvstudio.eu front & center
      state.baseRotX = 0.0;
      state.baseRotY = 0.0;
      state.targetCamX = 0;
      state.targetCamY = 0.0;
      state.targetCamZ = isMobileViewport ? 4.3 : 3.55;
      state.targetLookAt.set(0, 0, 0);
    } else if (mode === 'mobile') {
      // Rotate sculpture to bring the Mobile device front and center
      state.baseRotX = 0.02;
      state.baseRotY = -0.58;
      state.targetCamX = 0.25;
      state.targetCamY = -0.12;
      state.targetCamZ = isMobileViewport ? 3.9 : 3.25;
      state.targetLookAt.set(0.2, -0.1, 0);
    } else if (mode === 'code') {
      // Rotate sculpture to bring the React 18 / Next.js code panel front and center
      state.baseRotX = 0.02;
      state.baseRotY = 0.58;
      state.targetCamX = -0.25;
      state.targetCamY = 0.12;
      state.targetCamZ = isMobileViewport ? 4.1 : 3.35;
      state.targetLookAt.set(-0.2, 0.1, 0);
    } else {
      // Overview mode: complete 3D spatial multi-viewport perspective
      state.baseRotX = 0.12;
      state.baseRotY = -0.25;
      state.targetCamX = 0;
      state.targetCamY = 0.1;
      state.targetCamZ = isMobileViewport ? 6.3 : 5.4;
      state.targetLookAt.set(0, 0, 0);
    }

    // Immediately aim target rotations to the new base
    state.targetRotX = state.baseRotX;
    state.targetRotY = state.baseRotY;
  }, [playSoftClick]);

  // Procedural Textures for the 3 Screens with exact southdvstudio.eu
  const createTextures = useCallback(() => {
    // -------------------------------------------------------------
    // 1. Desktop Screen Texture (AUTHENTIC southdvstudio.eu)
    // -------------------------------------------------------------
    const dCanvas = document.createElement('canvas');
    dCanvas.width = 2048;
    dCanvas.height = 1280;
    const dCtx = dCanvas.getContext('2d');
    if (dCtx) {
      const width = 2048;
      const height = 1280;

      // Browser Chrome Topbar
      dCtx.fillStyle = '#0e111a';
      dCtx.fillRect(0, 0, width, 88);

      // Mac Window dots
      dCtx.fillStyle = '#ff5f56'; dCtx.beginPath(); dCtx.arc(48, 44, 10, 0, Math.PI * 2); dCtx.fill();
      dCtx.fillStyle = '#ffbd2e'; dCtx.beginPath(); dCtx.arc(80, 44, 10, 0, Math.PI * 2); dCtx.fill();
      dCtx.fillStyle = '#27c93f'; dCtx.beginPath(); dCtx.arc(112, 44, 10, 0, Math.PI * 2); dCtx.fill();

      // Real URL bar
      dCtx.fillStyle = '#1a1e2d';
      dCtx.beginPath();
      dCtx.roundRect(160, 20, 1100, 48, 8);
      dCtx.fill();

      dCtx.fillStyle = '#10b981';
      dCtx.font = 'bold 20px "Fira Code", monospace';
      dCtx.fillText('🔒 https://southdvstudio.eu', 190, 52);

      // Top Right Badge
      dCtx.fillStyle = '#1c9cf0';
      dCtx.font = 'bold 16px "Fira Code", monospace';
      dCtx.fillText('✦ NEXT.JS 15 • LIVE IN PRODUZIONE', 1600, 52);

      // Webpage Body (Exact Neo-Brutalist Layout of southdvstudio.eu)
      const bodyY = 88;
      const bodyH = height - bodyY;
      dCtx.fillStyle = '#ffffff';
      dCtx.fillRect(0, bodyY, width, bodyH);

      // Subtle Background Grid
      dCtx.strokeStyle = '#e2e8f0';
      dCtx.lineWidth = 1.5;
      for (let x = 0; x < width; x += 40) {
        dCtx.beginPath(); dCtx.moveTo(x, bodyY); dCtx.lineTo(x, height); dCtx.stroke();
      }
      for (let y = bodyY; y < height; y += 40) {
        dCtx.beginPath(); dCtx.moveTo(0, y); dCtx.lineTo(width, y); dCtx.stroke();
      }

      // Soft glow
      const grad = dCtx.createRadialGradient(1800, bodyY + 200, 20, 1800, bodyY + 200, 400);
      grad.addColorStop(0, 'rgba(28, 156, 240, 0.12)');
      grad.addColorStop(1, 'rgba(28, 156, 240, 0)');
      dCtx.fillStyle = grad;
      dCtx.fillRect(1400, bodyY, 648, 600);

      // Header Bar
      dCtx.fillStyle = '#ffffff';
      dCtx.fillRect(0, bodyY, width, 105);
      dCtx.strokeStyle = '#000000';
      dCtx.lineWidth = 4;
      dCtx.beginPath(); dCtx.moveTo(0, bodyY + 105); dCtx.lineTo(width, bodyY + 105); dCtx.stroke();

      // Brand Monogram S
      dCtx.fillStyle = '#000000';
      dCtx.fillRect(104, bodyY + 22, 64, 64);
      dCtx.fillStyle = '#1c9cf0';
      dCtx.fillRect(98, bodyY + 16, 64, 64);
      dCtx.strokeRect(98, bodyY + 16, 64, 64);

      dCtx.strokeStyle = '#ffffff';
      dCtx.lineWidth = 7;
      dCtx.beginPath();
      dCtx.moveTo(142, bodyY + 38);
      dCtx.lineTo(124, bodyY + 38);
      dCtx.lineTo(124, bodyY + 48);
      dCtx.lineTo(138, bodyY + 48);
      dCtx.lineTo(138, bodyY + 62);
      dCtx.lineTo(120, bodyY + 62);
      dCtx.stroke();

      // Brand Name
      dCtx.fillStyle = '#000000';
      dCtx.font = '900 34px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      dCtx.fillText('southdv', 180, bodyY + 62);
      dCtx.fillStyle = '#1c9cf0';
      dCtx.fillText('.studio', 315, bodyY + 62);

      // Salerno · IT Badge
      dCtx.fillStyle = '#000000';
      dCtx.fillRect(473, bodyY + 33, 140, 36);
      dCtx.fillStyle = '#1c9cf0';
      dCtx.fillRect(470, bodyY + 30, 140, 36);
      dCtx.strokeRect(470, bodyY + 30, 140, 36);
      dCtx.fillStyle = '#ffffff';
      dCtx.font = 'bold 15px "Fira Code", monospace';
      dCtx.fillText('SALERNO · IT', 486, bodyY + 54);

      // Nav Bar Mock
      dCtx.fillStyle = '#000000';
      dCtx.beginPath(); dCtx.roundRect(1324, bodyY + 28, 620, 52, 26); dCtx.fill();
      dCtx.fillStyle = '#ffffff';
      dCtx.beginPath(); dCtx.roundRect(1320, bodyY + 24, 620, 52, 26); dCtx.fill();
      dCtx.stroke();

      dCtx.fillStyle = '#1c9cf0';
      dCtx.beginPath(); dCtx.roundRect(1328, bodyY + 30, 110, 40, 20); dCtx.fill();
      dCtx.stroke();
      dCtx.fillStyle = '#ffffff';
      dCtx.font = 'bold 15px "Fira Code", monospace';
      dCtx.fillText('HOME', 1360, bodyY + 55);

      dCtx.fillStyle = '#475569';
      dCtx.fillText('TEST 0€', 1475, bodyY + 55);
      dCtx.fillText('RICHIEDI BOZZA', 1610, bodyY + 55);
      dCtx.fillText('CONTATTI', 1810, bodyY + 55);

      // Hero Tagline Pill
      const heroY = bodyY + 155;
      dCtx.fillStyle = '#000000';
      dCtx.fillRect(105, heroY + 5, 780, 48);
      dCtx.fillStyle = '#ffffff';
      dCtx.fillRect(100, heroY, 780, 48);
      dCtx.strokeRect(100, heroY, 780, 48);
      dCtx.fillStyle = '#000000';
      dCtx.font = 'bold 18px "Fira Code", monospace';
      dCtx.fillText('✦ SVILUPPO WEB PROFESSIONALE · CODICE 100% TUO', 125, heroY + 32);

      // Exact H1 Headline
      dCtx.fillStyle = '#000000';
      dCtx.font = '900 72px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      dCtx.fillText('Il tuo nuovo sito web.', 100, heroY + 125);
      dCtx.fillText('Tuo al 100%. Da ', 100, heroY + 205);
      
      dCtx.fillStyle = '#1c9cf0';
      dCtx.fillText('599,99€.', 690, heroY + 205);

      dCtx.fillStyle = '#000000';
      dCtx.font = '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      dCtx.fillText('Zero canoni obbligatori.', 100, heroY + 275);

      // Exact Subtitle paragraph
      dCtx.fillStyle = '#475569';
      dCtx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      dCtx.fillText('Dimentica i preventivi gonfiati da agenzia e le brutte sorprese. Creiamo il sito moderno per la tua attività in Next.js:', 100, heroY + 335);
      dCtx.fillText('codice tuo chiavi in mano con acquisto una tantum o formula abbonamento. Bozza reale in 7 giorni senza anticipo.', 100, heroY + 372);

      // Exact CTA Buttons
      const ctaY = heroY + 420;
      dCtx.fillStyle = '#000000';
      dCtx.fillRect(106, ctaY + 6, 360, 70);
      dCtx.fillStyle = '#1c9cf0';
      dCtx.fillRect(100, ctaY, 360, 70);
      dCtx.strokeRect(100, ctaY, 360, 70);
      dCtx.fillStyle = '#ffffff';
      dCtx.font = 'bold 22px "Fira Code", monospace';
      dCtx.fillText('Richiedi Bozza Gratuita →', 140, ctaY + 44);

      dCtx.fillStyle = '#000000';
      dCtx.fillRect(496, ctaY + 6, 350, 70);
      dCtx.fillStyle = '#ffffff';
      dCtx.fillRect(490, ctaY, 350, 70);
      dCtx.strokeRect(490, ctaY, 350, 70);
      dCtx.fillStyle = '#000000';
      dCtx.font = 'bold 22px "Fira Code", monospace';
      dCtx.fillText('Guarda i Siti Realizzati', 530, ctaY + 44);

      // Ticker Bar
      const tickerY = ctaY + 110;
      dCtx.fillStyle = '#000000';
      dCtx.fillRect(100, tickerY, width - 200, 52);
      dCtx.fillStyle = '#ffffff';
      dCtx.font = 'bold 17px "Fira Code", monospace';
      dCtx.fillText('NEXT.JS 15 ■ ACQUISTO UNA TANTUM ■ ZERO CANONI OBBLIGATORI ■ CODICE PROPRIETARIO 100% ■ CONSEGNA IN 7 GIORNI', 130, tickerY + 33);

      // 4 Neo-Brutalist Value Cards
      const cardsY = tickerY + 80;
      const cards = [
        { num: '0€', tit: 'Anticipo Iniziale', sub: 'Paghi solo a bozza approvata', color: '#1c9cf0', x: 100 },
        { num: '7 Giorni', tit: 'Consegna Media', sub: 'Dalla bozza al go-live online', color: '#000000', x: 570 },
        { num: '100%', tit: 'Proprietà Codice', sub: 'Nessun vincolo né lock-in', color: '#1c9cf0', x: 1040 },
        { num: '< 0.5s', tit: 'Velocità Mobile', sub: 'Massimo punteggio Lighthouse', color: '#000000', x: 1510 }
      ];

      cards.forEach(c => {
        dCtx.fillStyle = '#000000';
        dCtx.fillRect(c.x + 6, cardsY + 6, 430, 145);
        dCtx.fillStyle = '#ffffff';
        dCtx.fillRect(c.x, cardsY, 430, 145);
        dCtx.strokeRect(c.x, cardsY, 430, 145);

        dCtx.fillStyle = c.color;
        dCtx.font = '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        dCtx.fillText(c.num, c.x + 30, cardsY + 58);

        dCtx.fillStyle = '#000000';
        dCtx.font = 'bold 19px "Fira Code", monospace';
        dCtx.fillText(c.tit, c.x + 30, cardsY + 96);

        dCtx.fillStyle = '#64748b';
        dCtx.font = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        dCtx.fillText(c.sub, c.x + 30, cardsY + 125);
      });
    }

    const dTex = new THREE.CanvasTexture(dCanvas);
    dTex.colorSpace = THREE.SRGBColorSpace;
    dTex.minFilter = THREE.LinearMipmapLinearFilter;
    dTex.generateMipmaps = true;

    // Also attempt loading the high-res SVG image on top for maximum crispness
    const svgImg = new Image();
    svgImg.crossOrigin = 'anonymous';
    svgImg.onload = () => {
      if (dCtx) {
        dCtx.drawImage(svgImg, 0, 88, 2048, 1280 - 88);
        dTex.needsUpdate = true;
      }
    };
    svgImg.src = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/southdvstudio.svg` : '/southdvstudio.svg';

    // -------------------------------------------------------------
    // 2. Mobile Screen Texture (southdvstudio.eu Responsive View)
    // -------------------------------------------------------------
    const mCanvas = document.createElement('canvas');
    mCanvas.width = 640;
    mCanvas.height = 1280;
    const mCtx = mCanvas.getContext('2d');
    if (mCtx) {
      mCtx.fillStyle = '#ffffff';
      mCtx.fillRect(0, 0, 640, 1280);

      // Grid background
      mCtx.strokeStyle = '#e2e8f0';
      mCtx.lineWidth = 1.5;
      for (let x = 0; x < 640; x += 40) {
        mCtx.beginPath(); mCtx.moveTo(x, 0); mCtx.lineTo(x, 1280); mCtx.stroke();
      }
      for (let y = 0; y < 1280; y += 40) {
        mCtx.beginPath(); mCtx.moveTo(0, y); mCtx.lineTo(640, y); mCtx.stroke();
      }

      // Mobile Top notch & status
      mCtx.fillStyle = '#000000';
      mCtx.fillRect(0, 0, 640, 70);
      mCtx.fillStyle = '#10b981';
      mCtx.font = 'bold 18px "Fira Code", monospace';
      mCtx.fillText('9:41 • 5G // 200 OK', 30, 44);
      mCtx.fillStyle = '#ffffff';
      mCtx.fillText('100% 🔋', 530, 44);

      // URL bar
      mCtx.fillStyle = '#f1f5f9';
      mCtx.fillRect(24, 90, 592, 60);
      mCtx.strokeStyle = '#000000';
      mCtx.lineWidth = 2.5;
      mCtx.strokeRect(24, 90, 592, 60);
      mCtx.fillStyle = '#000000';
      mCtx.font = 'bold 20px "Fira Code", monospace';
      mCtx.fillText('🔒 https://southdvstudio.eu', 50, 128);

      // Mobile Brand Header
      mCtx.fillStyle = '#1c9cf0';
      mCtx.fillRect(24, 180, 50, 50);
      mCtx.strokeRect(24, 180, 50, 50);
      mCtx.fillStyle = '#000000';
      mCtx.font = '900 32px sans-serif';
      mCtx.fillText('southdv.studio', 90, 218);

      // Tagline pill
      mCtx.fillStyle = '#000000';
      mCtx.fillRect(28, 260, 584, 46);
      mCtx.fillStyle = '#ffffff';
      mCtx.fillRect(24, 256, 584, 46);
      mCtx.strokeRect(24, 256, 584, 46);
      mCtx.fillStyle = '#000000';
      mCtx.font = 'bold 16px "Fira Code", monospace';
      mCtx.fillText('✦ SVILUPPO WEB NEXT.JS 15', 50, 286);

      // Mobile Headline
      mCtx.fillStyle = '#000000';
      mCtx.font = '900 44px sans-serif';
      mCtx.fillText('Il tuo nuovo', 24, 360);
      mCtx.fillText('sito web.', 24, 410);
      mCtx.fillText('Da ', 24, 465);
      mCtx.fillStyle = '#1c9cf0';
      mCtx.fillText('599,99€.', 105, 465);
      mCtx.fillStyle = '#000000';
      mCtx.font = '900 30px sans-serif';
      mCtx.fillText('Zero canoni.', 24, 515);

      // Mobile CTA
      mCtx.fillStyle = '#000000';
      mCtx.fillRect(28, 560, 584, 68);
      mCtx.fillStyle = '#1c9cf0';
      mCtx.fillRect(24, 556, 584, 68);
      mCtx.strokeRect(24, 556, 584, 68);
      mCtx.fillStyle = '#ffffff';
      mCtx.font = 'bold 22px "Fira Code", monospace';
      mCtx.fillText('Richiedi Bozza Gratuita →', 90, 600);

      // 3 Mobile Metric Cards
      const mCards = [
        { val: '0€', lbl: 'Anticipo Iniziale', y: 660 },
        { val: '7 Giorni', lbl: 'Consegna Rapida', y: 780 },
        { val: '100%', lbl: 'Codice di Proprietà', y: 900 },
        { val: '< 0.5s', lbl: 'Velocità Mobile', y: 1020 }
      ];

      mCards.forEach(c => {
        mCtx.fillStyle = '#000000';
        mCtx.fillRect(28, c.y + 4, 584, 96);
        mCtx.fillStyle = '#ffffff';
        mCtx.fillRect(24, c.y, 584, 96);
        mCtx.strokeRect(24, c.y, 584, 96);

        mCtx.fillStyle = '#1c9cf0';
        mCtx.font = '900 36px sans-serif';
        mCtx.fillText(c.val, 50, c.y + 48);

        mCtx.fillStyle = '#000000';
        mCtx.font = 'bold 18px "Fira Code", monospace';
        mCtx.fillText(c.lbl, 50, c.y + 80);
      });
    }
    const mTex = new THREE.CanvasTexture(mCanvas);
    mTex.colorSpace = THREE.SRGBColorSpace;
    mTex.minFilter = THREE.LinearMipmapLinearFilter;
    mTex.generateMipmaps = true;

    // -------------------------------------------------------------
    // 3. Code Screen Texture (Architecture: southdv.studio)
    // -------------------------------------------------------------
    const cCanvas = document.createElement('canvas');
    cCanvas.width = 800;
    cCanvas.height = 1080;
    const cCtx = cCanvas.getContext('2d');
    if (cCtx) {
      cCtx.fillStyle = '#090a10';
      cCtx.fillRect(0, 0, 800, 1080);

      // Header Bar
      cCtx.fillStyle = '#141620';
      cCtx.fillRect(0, 0, 800, 64);
      cCtx.fillStyle = '#10b981';
      cCtx.font = 'bold 16px "Fira Code", monospace';
      cCtx.fillText('// Architecture: southdv.studio // Next.js 15', 28, 40);

      const codeLines = [
        { t: "import { createStudioInstance } from '@southdv/core';", c: '#00f0ff' },
        { t: "import { Next15, TailwindV4, React18 } from 'web-stack';", c: '#8b5cf6' },
        { t: "", c: '' },
        { t: "export default async function StudioDeployment() {", c: '#ff4b26' },
        { t: "  const studio = await createStudioInstance({", c: '#ffffff' },
        { t: "    domain: 'https://southdvstudio.eu',", c: '#10b981' },
        { t: "    location: 'Salerno, IT // 40.68° N',", c: '#10b981' },
        { t: "    pricing: {", c: '#f59e0b' },
        { t: "      unaTantum: '599,99€ (Codice 100% tuo)',", c: '#f59e0b' },
        { t: "      formulaAbbonamento: 'Zero anticipo',", c: '#f59e0b' },
        { t: "      consegnaBozza: '7 giorni lavorativi'", c: '#f59e0b' },
        { t: "    },", c: '#f59e0b' },
        { t: "    coreMetrics: {", c: '#00f0ff' },
        { t: "      lighthousePerformance: 100,", c: '#00f0ff' },
        { t: "      edgeTTFB: '< 80ms',", c: '#00f0ff' },
        { t: "      mobileSpeed: '< 0.5s'", c: '#00f0ff' },
        { t: "    },", c: '#00f0ff' },
        { t: "    status: 'PRODUCTION_VERIFIED'", c: '#10b981' },
        { t: "  });", c: '#ffffff' },
        { t: "", c: '' },
        { t: "  return <ProductionRenderer studio={studio} />;", c: '#ff4b26' },
        { t: "}", c: '#ff4b26' }
      ];

      codeLines.forEach((cl, idx) => {
        if (!cl.t) return;
        cCtx.fillStyle = cl.c;
        cCtx.font = '500 17px "Fira Code", monospace';
        cCtx.fillText(cl.t, 32, 115 + idx * 40);
      });
    }
    const cTex = new THREE.CanvasTexture(cCanvas);
    cTex.colorSpace = THREE.SRGBColorSpace;
    cTex.minFilter = THREE.LinearMipmapLinearFilter;
    cTex.generateMipmaps = true;

    return { dTex, mTex, cTex };
  }, []);

  // Three.js Scene Setup & Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const state = threeRef.current;

    // Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    state.renderer = renderer;

    const scene = new THREE.Scene();
    state.scene = scene;

    const isMobile = (container.clientWidth || window.innerWidth) < 768;
    const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 100);
    camera.position.set(0, 0.1, isMobile ? 6.3 : 5.4);
    state.camera = camera;
    state.targetCamZ = isMobile ? 6.3 : 5.4;

    // Studio Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.4));

    const solarKey = new THREE.DirectionalLight(0xff4b26, 2.8);
    solarKey.position.set(5, 6, 4);
    scene.add(solarKey);

    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 2.4);
    cyanRim.position.set(-5, -2, 3);
    scene.add(cyanRim);

    const topFill = new THREE.DirectionalLight(0xffffff, 1.6);
    topFill.position.set(0, 7, 2);
    scene.add(topFill);

    // Textures
    const { dTex, mTex, cTex } = createTextures();
    state.desktopTexture = dTex;
    state.mobileTexture = mTex;
    state.codeTexture = cTex;

    // Master Sculpture Group
    const sculptureGroup = new THREE.Group();
    state.sculptureGroup = sculptureGroup;

    // Glass material for frame borders
    const glassFrameMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.04
    });

    const edgeLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35
    });

    // 1. Center Desktop Screen Viewport (16:10)
    const desktopGroup = new THREE.Group();
    desktopGroup.name = 'desktop';

    const deskGeo = new THREE.BoxGeometry(3.6, 2.25, 0.07);
    const deskFrame = new THREE.Mesh(deskGeo, glassFrameMat);
    desktopGroup.add(deskFrame);
    desktopGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(deskGeo), edgeLineMat));

    const deskScreenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.52, 2.18),
      new THREE.MeshBasicMaterial({ map: dTex })
    );
    deskScreenMesh.position.z = 0.038;
    deskScreenMesh.name = 'desktop';
    desktopGroup.add(deskScreenMesh);
    sculptureGroup.add(desktopGroup);
    state.desktopMesh = deskScreenMesh;

    // 2. Mobile Viewport (Angled forward right)
    const mobileGroup = new THREE.Group();
    mobileGroup.name = 'mobile';
    mobileGroup.position.set(2.2, -0.2, 0.45);
    mobileGroup.rotation.y = THREE.MathUtils.degToRad(-18);

    const mobGeo = new THREE.BoxGeometry(1.15, 2.3, 0.06);
    const mobFrame = new THREE.Mesh(mobGeo, glassFrameMat);
    mobileGroup.add(mobFrame);
    mobileGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(mobGeo), edgeLineMat));

    const mobScreenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 2.24),
      new THREE.MeshBasicMaterial({ map: mTex })
    );
    mobScreenMesh.position.z = 0.033;
    mobScreenMesh.name = 'mobile';
    mobileGroup.add(mobScreenMesh);
    sculptureGroup.add(mobileGroup);
    state.mobileMesh = mobScreenMesh;

    // 3. Code Viewport (Angled back left)
    const codeGroup = new THREE.Group();
    codeGroup.name = 'code';
    codeGroup.position.set(-2.25, 0.25, -0.45);
    codeGroup.rotation.y = THREE.MathUtils.degToRad(20);

    const codeGeo = new THREE.BoxGeometry(1.8, 2.4, 0.06);
    const codeFrame = new THREE.Mesh(codeGeo, glassFrameMat);
    codeGroup.add(codeFrame);
    codeGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(codeGeo), edgeLineMat));

    const codeScreenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.74, 2.34),
      new THREE.MeshBasicMaterial({ map: cTex })
    );
    codeScreenMesh.position.z = 0.033;
    codeScreenMesh.name = 'code';
    codeGroup.add(codeScreenMesh);
    sculptureGroup.add(codeGroup);
    state.codeMesh = codeScreenMesh;

    state.interactiveMeshes = [deskScreenMesh, mobScreenMesh, codeScreenMesh];

    // 4. Double Gyroscopic Orbital Rings
    const halo1 = new THREE.Mesh(
      new THREE.TorusGeometry(3.4, 0.018, 16, 120),
      new THREE.MeshStandardMaterial({
        color: 0xff4b26,
        metalness: 0.9,
        roughness: 0.15,
        emissive: 0xff4b26,
        emissiveIntensity: 0.25
      })
    );
    halo1.rotation.x = Math.PI / 2.3;
    sculptureGroup.add(halo1);
    state.halo1 = halo1;

    const halo2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.014, 16, 120),
      new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        metalness: 0.9,
        roughness: 0.15,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.25
      })
    );
    halo2.rotation.x = -Math.PI / 2.6;
    halo2.rotation.y = Math.PI / 8;
    sculptureGroup.add(halo2);
    state.halo2 = halo2;

    // 5. Floating 3D Tech Tokens
    const techTokens = [
      { text: 'NEXT.JS 15', color: 0xffffff, pos: [-2.6, 1.6, 0.3] },
      { text: 'REACT 18', color: 0x00f0ff, pos: [2.5, 1.6, 0.2] },
      { text: 'SOUTHDV', color: 0x1c9cf0, pos: [2.3, -1.5, 0.6] },
      { text: 'TAILWIND', color: 0x8b5cf6, pos: [-2.4, -1.4, 0.5] }
    ];

    const tokenMeshes = techTokens.map(tok => {
      const g = new THREE.Group();
      g.position.set(...tok.pos);

      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.25, 0.25),
        new THREE.MeshStandardMaterial({
          color: tok.color,
          emissive: tok.color,
          emissiveIntensity: 0.3,
          roughness: 0.2,
          metalness: 0.8
        })
      );
      g.add(box);

      const wire = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, -tok.pos[1], -tok.pos[2])
        ]),
        new THREE.LineBasicMaterial({ color: tok.color, transparent: true, opacity: 0.25 })
      );
      g.add(wire);

      sculptureGroup.add(g);
      return { group: g, origPos: tok.pos, speed: Math.random() * 0.4 + 0.8 };
    });
    state.orbitals = tokenMeshes;

    scene.add(sculptureGroup);

    // Mouse & Touch Drag Handlers (Smooth Orbit & Additive Parallax)
    let pointerMoved = false;

    const onMouseDown = (e) => {
      state.userDragging = true;
      pointerMoved = false;
      setIsDragging(true);
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.startRotX = state.curRotX;
      state.startRotY = state.curRotY;
    };

    const onMouseMove = (e) => {
      if (state.userDragging) {
        const deltaX = e.clientX - state.dragStartX;
        const deltaY = e.clientY - state.dragStartY;
        if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
          pointerMoved = true;
        }
        state.targetRotY = state.startRotY + deltaX * 0.007;
        state.targetRotX = Math.max(-0.4, Math.min(0.5, state.startRotX + deltaY * 0.007));
        // Update base rotations so drag doesn't snap back
        state.baseRotX = state.targetRotX;
        state.baseRotY = state.targetRotY;
      } else {
        // Subtle additive parallax around the current baseRot!
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        state.targetRotY = state.baseRotY + normX * 0.07;
        state.targetRotX = state.baseRotX - normY * 0.04;
      }
    };

    const onMouseUp = (e) => {
      // Direct raycast click detection on the screens in the 3D canvas
      if (!pointerMoved && e.target === canvas) {
        const rect = canvas.getBoundingClientRect();
        state.mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        state.mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        state.raycaster.setFromCamera(state.mouseVec, camera);
        
        const intersects = state.raycaster.intersectObjects(state.interactiveMeshes, false);
        if (intersects.length > 0) {
          const hitName = intersects[0].object.name;
          if (hitName === 'desktop' || hitName === 'mobile' || hitName === 'code') {
            setFocus(hitName);
          }
        }
      }

      state.userDragging = false;
      setIsDragging(false);
    };

    // Mobile Touch
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        state.userDragging = true;
        setIsDragging(true);
        state.dragStartX = e.touches[0].clientX;
        state.dragStartY = e.touches[0].clientY;
        state.startRotX = state.curRotX;
        state.startRotY = state.curRotY;
      }
    };

    const onTouchMove = (e) => {
      if (state.userDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - state.dragStartX;
        const deltaY = e.touches[0].clientY - state.dragStartY;
        state.targetRotY = state.startRotY + deltaX * 0.007;
        state.targetRotX = Math.max(-0.4, Math.min(0.5, state.startRotX + deltaY * 0.007));
        state.baseRotX = state.targetRotX;
        state.baseRotY = state.targetRotY;
      }
    };

    const onTouchEnd = () => {
      state.userDragging = false;
      setIsDragging(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    // Responsive Canvas Resizing
    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 560;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w < 768 ? 52 : 38;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // 60 FPS Render Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Smooth interpolation of sculpture rotation
      state.curRotX += (state.targetRotX - state.curRotX) * 0.09;
      state.curRotY += (state.targetRotY - state.curRotY) * 0.09;

      // Gentle continuous organic breathing sway only in overview mode
      const isOverview = state.activeMode === 'overview';
      const idleSway = isOverview ? Math.sin(time * 0.7) * 0.012 : 0;
      sculptureGroup.rotation.x = state.curRotX + idleSway;
      sculptureGroup.rotation.y = state.curRotY;
      sculptureGroup.position.y = isOverview ? Math.sin(time * 1.1) * 0.04 : 0;

      // Rotate gyroscopic rings
      if (state.halo1) state.halo1.rotation.z += 0.003;
      if (state.halo2) state.halo2.rotation.z -= 0.002;

      // Floating tech tokens
      state.orbitals.forEach((tok, i) => {
        tok.group.position.y = tok.origPos[1] + Math.sin(time * tok.speed + i) * 0.06;
        tok.group.rotation.y += 0.015;
      });

      // Smooth camera position interpolation
      camera.position.x += (state.targetCamX - camera.position.x) * 0.08;
      camera.position.y += (state.targetCamY - camera.position.y) * 0.08;
      camera.position.z += (state.targetCamZ - camera.position.z) * 0.08;

      // Smooth lookAt interpolation
      state.curLookAt.lerp(state.targetLookAt, 0.08);
      camera.lookAt(state.curLookAt);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);

      // Clean up Three.js allocations
      deskGeo.dispose();
      mobGeo.dispose();
      codeGeo.dispose();
      glassFrameMat.dispose();
      edgeLineMat.dispose();
      dTex.dispose();
      mTex.dispose();
      cTex.dispose();
      renderer.dispose();
    };
  }, [createTextures, setFocus]);

  return (
    <div className="webdev-3d-sculpture-wrapper" ref={containerRef}>
      {/* Three.js 3D WebGL Canvas */}
      <canvas 
        ref={canvasRef} 
        className={`webdev-3d-sculpture-canvas ${isDragging ? 'is-dragging' : ''}`}
        title="Trascina per ruotare o clicca sui viewport per fare zoom"
      />

      {/* Floating 3D Navigation Controls */}
      <div className="sculpture-ui-command-bar font-mono">
        <div className="sculpture-view-group">
          <button 
            type="button"
            className={`sculpture-view-btn ${activeFocus === 'overview' ? 'active' : ''}`}
            onClick={() => setFocus('overview')}
            title="Vista Panoramica 3D"
          >
            <span>[ 3D OVERVIEW ]</span>
          </button>

          <button 
            type="button"
            className={`sculpture-view-btn ${activeFocus === 'desktop' ? 'active' : ''}`}
            onClick={() => setFocus('desktop')}
            title="Zoom sul Viewport Desktop (southdvstudio.eu)"
          >
            <FiMonitor />
            <span>DESKTOP 16:9</span>
          </button>

          <button 
            type="button"
            className={`sculpture-view-btn ${activeFocus === 'mobile' ? 'active' : ''}`}
            onClick={() => setFocus('mobile')}
            title="Zoom sul Viewport Mobile"
          >
            <FiSmartphone />
            <span>MOBILE CORE</span>
          </button>

          <button 
            type="button"
            className={`sculpture-view-btn ${activeFocus === 'code' ? 'active' : ''}`}
            onClick={() => setFocus('code')}
            title="Zoom sul Codice Next.js / React 18"
          >
            <FiCode />
            <span>REACT 18 CODE</span>
          </button>
        </div>

        <div className="sculpture-action-group">
          <button 
            type="button"
            className="sculpture-reset-btn"
            onClick={() => setFocus('overview')}
            title="Ripristina Vista Panoramica 3D"
          >
            <FiRefreshCw />
            <span>RESET 3D</span>
          </button>

          <a 
            href="https://southdvstudio.eu" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="sculpture-live-link"
            title="Apri southdvstudio.eu in una nuova scheda"
          >
            <span>southdvstudio.eu</span>
            <FiExternalLink />
          </a>
        </div>
      </div>

      {/* Subtle Hint Badge */}
      <div className="sculpture-hint-badge font-mono">
        <span className="hint-bracket">[</span>
        <span className="hint-text">
          {language === 'en'
            ? '✦ CLICK BUTTONS OR DRAG 360° • INTERACTIVE MULTI-VIEWPORT SCULPTURE'
            : '✦ CLICCA I PULSANTI O TRASCINA A 360° • SCULTURA 3D MULTI-VIEWPORT'}
        </span>
        <span className="hint-bracket">]</span>
      </div>
    </div>
  );
}
