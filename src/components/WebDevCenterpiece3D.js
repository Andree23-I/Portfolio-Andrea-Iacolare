import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import './WebDevCenterpiece3D.css';
import { 
  FiMonitor, 
  FiCode, 
  FiTerminal, 
  FiZap, 
  FiRefreshCw, 
  FiExternalLink
} from 'react-icons/fi';

export default function WebDevCenterpiece3D({ t, onTriggerFlash }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Interactive modes
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'code' | 'terminal'
  const [buildCount, setBuildCount] = useState(1);
  const [isCompiling, setIsCompiling] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // References for Three.js state
  const threeRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    workstationGroup: null,
    screenMesh: null,
    screenCanvas: null,
    screenCtx: null,
    screenTexture: null,
    particles: null,
    orbitals: [],
    targetRotX: 0.15,
    targetRotY: -0.25,
    curRotX: 0.15,
    curRotY: -0.25,
    userDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    startRotX: 0,
    startRotY: 0,
    burstProgress: 1,
    particleVels: []
  });

  // Synthesized Web Audio Click / Shutter Sound
  const playAudioFeedback = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio autoplay restrictions
    }
  }, []);

  // Redraw the 3D screen texture on the laptop display
  const updateScreenTexture = useCallback((tab, buildNum, compiling) => {
    const state = threeRef.current;
    if (!state.screenCanvas || !state.screenCtx || !state.screenTexture) return;

    const ctx = state.screenCtx;
    const w = state.screenCanvas.width;
    const h = state.screenCanvas.height;

    // Background
    ctx.fillStyle = '#08090e';
    ctx.fillRect(0, 0, w, h);

    // Subtle background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top Chrome Window Bar
    ctx.fillStyle = '#12141c';
    ctx.fillRect(0, 0, w, 56);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(0, 56);
    ctx.lineTo(w, 56);
    ctx.stroke();

    // macOS Traffic Light dots
    const dots = [
      { color: '#ff5f56', x: 28 },
      { color: '#ffbd2e', x: 52 },
      { color: '#27c93f', x: 76 }
    ];
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, 28, 7, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.fill();
    });

    // Address Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(110, 12, 540, 32, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = '600 14px "Fira Code", monospace';
    ctx.fillText('🔒 https://', 124, 33);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('andreaiacolare.dev', 232, 33);
    ctx.fillStyle = '#616575';
    ctx.fillText(`/${tab}`, 400, 33);

    // Active Tab Pill in Chrome
    ctx.fillStyle = '#ff4b26';
    ctx.beginPath();
    ctx.roundRect(670, 14, 115, 28, 4);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 12px "Fira Code", monospace';
    ctx.fillText(tab.toUpperCase(), 685, 33);

    // Status Ping
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(765, 28, 4, 0, Math.PI * 2);
    ctx.fill();

    // Body content based on tab
    if (tab === 'preview') {
      // Mini Website Showcase (southdv.studio)
      ctx.fillStyle = '#ff4b26';
      ctx.font = '700 13px "Fira Code", monospace';
      ctx.fillText('[ CASE // 01 • CREATIVE PRODUCTION STUDIO ]', 36, 100);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 32px "Syne", sans-serif';
      ctx.fillText('southdv.studio', 36, 146);

      ctx.fillStyle = '#9da2b4';
      ctx.font = '400 15px "Outfit", sans-serif';
      ctx.fillText('Modern web architecture, tactile physics and high conversion.', 36, 178);

      // Metric Cards
      const metrics = [
        { label: 'LIGHTHOUSE', val: '100/100', color: '#10b981', x: 36 },
        { label: 'EDGE TTFB', val: '< 80ms', color: '#ff4b26', x: 220 },
        { label: 'ARCHITECTURE', val: 'NEXT.JS 15', color: '#00f0ff', x: 404 }
      ];
      metrics.forEach(m => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.beginPath();
        ctx.roundRect(m.x, 210, 168, 80, 8);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.stroke();

        ctx.fillStyle = m.color;
        ctx.font = '800 22px "Fira Code", monospace';
        ctx.fillText(m.val, m.x + 16, 250);

        ctx.fillStyle = '#616575';
        ctx.font = '600 11px "Fira Code", monospace';
        ctx.fillText(m.label, m.x + 16, 274);
      });

      // Bottom Status Line
      ctx.fillStyle = compiling ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(36, 320, 536, 44, 6);
      ctx.fill();

      ctx.fillStyle = compiling ? '#000000' : '#ffffff';
      ctx.font = '700 14px "Fira Code", monospace';
      ctx.fillText(
        compiling ? '⚡ RE-COMPILING EDGE BUNDLE...' : `⚡ BUILD #${buildNum} DEPLOYED // CLICK TO COMPILE`,
        54, 347
      );
    } else if (tab === 'code') {
      // Syntax Highlighted React Code
      ctx.fillStyle = '#616575';
      ctx.font = '500 13px "Fira Code", monospace';
      ctx.fillText('// Andrea Iacolare - FullStackExperience.tsx', 36, 95);

      const codeLines = [
        { text: "import { createModernWebEngine } from '@andrea/core';", color: '#00f0ff' },
        { text: "import { Next15, React18, AgenticAI } from 'modern-stack';", color: '#8b5cf6' },
        { text: "", color: '' },
        { text: "export default async function Experience() {", color: '#ff4b26' },
        { text: "  const architecture = await createModernWebEngine({", color: '#ffffff' },
        { text: "    architect: 'Andrea Iacolare',", color: '#10b981' },
        { text: "    performance: { lighthouse: 100, ttfb: '<80ms' },", color: '#f59e0b' },
        { text: `    buildCount: ${buildNum}, status: 'PRODUCTION_READY'`, color: '#00f0ff' },
        { text: "  });", color: '#ffffff' },
        { text: "  return <ArchitectureRenderer stage={architecture} />;", color: '#ff4b26' },
        { text: "}", color: '#ff4b26' }
      ];

      codeLines.forEach((cl, idx) => {
        if (!cl.text) return;
        ctx.fillStyle = cl.color;
        ctx.font = '500 13px "Fira Code", monospace';
        ctx.fillText(cl.text, 36, 125 + idx * 24);
      });
    } else if (tab === 'terminal') {
      // Terminal Log Stream
      ctx.fillStyle = '#64748b';
      ctx.font = '500 13px "Fira Code", monospace';
      ctx.fillText('[SYSTEM] Initializing Next.js 15.1 Production Server...', 36, 95);
      ctx.fillStyle = '#00f0ff';
      ctx.fillText('[NETWORK] Connected to Vercel Rome Edge CDN (12ms ping)', 36, 125);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('[BUNDLER] Compiling 1,420 ES Modules in parallel...', 36, 155);
      ctx.fillStyle = '#10b981';
      ctx.fillText(`✓ Compiled successfully in 34ms (Build #${buildNum})`, 36, 185);
      ctx.fillStyle = '#10b981';
      ctx.fillText('✓ Core Web Vitals: LCP 0.6s | CLS 0.000 | FID 2ms', 36, 215);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`⚡ SHUTTER FLASH READY: ${compiling ? 'TRIGGERED [OK]' : 'STANDBY'}`, 36, 245);
      
      ctx.fillStyle = '#ff4b26';
      ctx.fillText('dev@andrea:~$ deploy --prod --instant █', 36, 290);
    }

    state.screenTexture.needsUpdate = true;
  }, []);

  // Compile Trigger & 3D Shutter Flash
  const handleTriggerCompile = useCallback((e) => {
    if (e) e.stopPropagation();
    if (isCompiling) return;

    setIsCompiling(true);
    setShowFlash(true);
    playAudioFeedback();
    if (onTriggerFlash) onTriggerFlash();

    // Trigger 3D particle burst
    const state = threeRef.current;
    state.burstProgress = 0;

    setTimeout(() => {
      setShowFlash(false);
    }, 250);

    setTimeout(() => {
      setIsCompiling(false);
      setBuildCount(prev => {
        const next = prev + 1;
        updateScreenTexture(activeTab, next, false);
        return next;
      });
    }, 550);

    updateScreenTexture(activeTab, buildCount, true);
  }, [isCompiling, playAudioFeedback, onTriggerFlash, activeTab, buildCount, updateScreenTexture]);

  // Tab switch handler
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    updateScreenTexture(tab, buildCount, isCompiling);
    playAudioFeedback();
  };

  // Reset 3D Rotation
  const handleResetRotation = () => {
    const state = threeRef.current;
    state.targetRotX = 0.15;
    state.targetRotY = -0.25;
  };

  // Three.js 3D WebGL Workstation Initialization
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
    renderer.toneMappingExposure = 1.2;
    state.renderer = renderer;

    // Scene & Camera
    const scene = new THREE.Scene();
    state.scene = scene;

    const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 100);
    camera.position.set(0, 0.2, 5.2);
    state.camera = camera;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const solarKeyLight = new THREE.DirectionalLight(0xff4b26, 3.2);
    solarKeyLight.position.set(4, 5, 4);
    scene.add(solarKeyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00f0ff, 2.4);
    cyanRimLight.position.set(-4, -2, 3);
    scene.add(cyanRimLight);

    // Procedural Screen Texture Canvas
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 800;
    screenCanvas.height = 500;
    const screenCtx = screenCanvas.getContext('2d');
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;

    state.screenCanvas = screenCanvas;
    state.screenCtx = screenCtx;
    state.screenTexture = screenTexture;

    // Build 3D Workstation / Laptop Geometry
    const workstationGroup = new THREE.Group();
    state.workstationGroup = workstationGroup;

    // 1. Laptop Base / Keyboard Chassis
    const baseGeo = new THREE.BoxGeometry(3.3, 0.14, 2.2);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      metalness: 0.88,
      roughness: 0.22
    });
    const baseMesh = new THREE.Mesh(baseGeo, chassisMat);
    workstationGroup.add(baseMesh);

    // Trackpad cutout
    const trackpadGeo = new THREE.PlaneGeometry(0.9, 0.6);
    const trackpadMat = new THREE.MeshStandardMaterial({
      color: 0x12141c,
      metalness: 0.9,
      roughness: 0.3
    });
    const trackpadMesh = new THREE.Mesh(trackpadGeo, trackpadMat);
    trackpadMesh.rotation.x = -Math.PI / 2;
    trackpadMesh.position.set(0, 0.075, 0.55);
    workstationGroup.add(trackpadMesh);

    // Keyboard bed
    const kbGeo = new THREE.PlaneGeometry(2.8, 1.1);
    const kbMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d13,
      metalness: 0.7,
      roughness: 0.4
    });
    const kbMesh = new THREE.Mesh(kbGeo, kbMat);
    kbMesh.rotation.x = -Math.PI / 2;
    kbMesh.position.set(0, 0.075, -0.35);
    workstationGroup.add(kbMesh);

    // 2. Display Lid (Tilted at 105 degrees)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.07, -1.05);

    const lidGeo = new THREE.BoxGeometry(3.3, 2.15, 0.08);
    const lidMesh = new THREE.Mesh(lidGeo, chassisMat);
    lidMesh.position.set(0, 1.075, 0);
    lidGroup.add(lidMesh);

    // Display Screen Mesh with Canvas Texture
    const displayGeo = new THREE.PlaneGeometry(3.08, 1.95);
    const displayMat = new THREE.MeshBasicMaterial({
      map: screenTexture
    });
    const displayMesh = new THREE.Mesh(displayGeo, displayMat);
    displayMesh.position.set(0, 1.075, 0.045);
    lidGroup.add(displayMesh);
    state.screenMesh = displayMesh;

    // Glossy Glass Screen Overlay for specular reflections
    const glassOverlayGeo = new THREE.PlaneGeometry(3.1, 1.98);
    const glassOverlayMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.04
    });
    const glassMesh = new THREE.Mesh(glassOverlayGeo, glassOverlayMat);
    glassMesh.position.set(0, 1.075, 0.048);
    lidGroup.add(glassMesh);

    // Tilt lid back
    lidGroup.rotation.x = THREE.MathUtils.degToRad(-15);
    workstationGroup.add(lidGroup);

    // 3. Floating 3D Cyber Wireframe Grid beneath the Workstation
    const gridHelper = new THREE.GridHelper(6, 16, 0xff4b26, 0x222638);
    gridHelper.position.set(0, -0.65, 0);
    workstationGroup.add(gridHelper);

    // 4. Floating 3D Orbital Tech Beacons (React, Next, AI, Tailwind)
    const orbitalData = [
      { tag: 'NEXT.JS 15', color: 0xffffff, pos: [-2.4, 1.4, 0.5] },
      { tag: 'REACT 18', color: 0x00f0ff, pos: [2.4, 1.5, 0.4] },
      { tag: 'AI AGENTS', color: 0xff4b26, pos: [2.2, -0.3, 1.2] },
      { tag: 'TAILWIND v4', color: 0x8b5cf6, pos: [-2.2, -0.3, 1.1] }
    ];

    const orbitalMeshes = orbitalData.map(orb => {
      const orbGroup = new THREE.Group();
      orbGroup.position.set(...orb.pos);

      // Core cube
      const cubeGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const cubeMat = new THREE.MeshStandardMaterial({
        color: orb.color,
        emissive: orb.color,
        emissiveIntensity: 0.4,
        roughness: 0.2
      });
      orbGroup.add(new THREE.Mesh(cubeGeo, cubeMat));

      // Glow wireframe ring
      const ringGeo = new THREE.RingGeometry(0.18, 0.22, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: orb.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      orbGroup.add(ringMesh);

      workstationGroup.add(orbGroup);
      return { group: orbGroup, origPos: orb.pos, speed: Math.random() * 0.5 + 0.8 };
    });
    state.orbitals = orbitalMeshes;

    // 5. Shutter Compile Burst Particles (150 particles)
    const pCount = 150;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pVels = [];
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = 0;
      pPositions[i * 3 + 1] = 1.0;
      pPositions[i * 3 + 2] = 0;
      pVels.push(new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4 + 0.5,
        Math.random() * 5 + 1
      ));
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.08,
      transparent: true,
      opacity: 0
    });
    const pPoints = new THREE.Points(pGeo, pMat);
    workstationGroup.add(pPoints);
    state.particles = pPoints;
    state.particleVels = pVels;

    scene.add(workstationGroup);

    // Initial Screen Draw
    updateScreenTexture('preview', 1, false);

    // Mouse Tracking & Drag Orbit Handlers
    const onMouseDown = (e) => {
      state.userDragging = true;
      setIsDragging(true);
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.startRotX = state.targetRotX;
      state.startRotY = state.targetRotY;
    };

    const onMouseMove = (e) => {
      if (state.userDragging) {
        const deltaX = e.clientX - state.dragStartX;
        const deltaY = e.clientY - state.dragStartY;
        state.targetRotY = state.startRotY + deltaX * 0.008;
        state.targetRotX = Math.max(-0.4, Math.min(0.6, state.startRotX + deltaY * 0.008));
      } else {
        // Natural gentle mouse tracking across screen
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        state.targetRotY = -0.25 + normX * 0.28;
        state.targetRotX = 0.15 - normY * 0.18;
      }
    };

    const onMouseUp = () => {
      state.userDragging = false;
      setIsDragging(false);
    };

    // Touch support for mobile devices
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        state.userDragging = true;
        setIsDragging(true);
        state.dragStartX = e.touches[0].clientX;
        state.dragStartY = e.touches[0].clientY;
        state.startRotX = state.targetRotX;
        state.startRotY = state.targetRotY;
      }
    };

    const onTouchMove = (e) => {
      if (state.userDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - state.dragStartX;
        const deltaY = e.touches[0].clientY - state.dragStartY;
        state.targetRotY = state.startRotY + deltaX * 0.008;
        state.targetRotX = Math.max(-0.4, Math.min(0.6, state.startRotX + deltaY * 0.008));
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
      const h = container.clientHeight || 520;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w < 768 ? 52 : 38;
      camera.position.z = w < 768 ? 6.2 : 5.2;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // 60 FPS Render Loop with Physics
    let animId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const dt = Math.min(0.05, clock.getDelta());
      const time = clock.getElapsedTime();

      // Smooth interpolation for 3D rotation
      state.curRotX += (state.targetRotX - state.curRotX) * 0.08;
      state.curRotY += (state.targetRotY - state.curRotY) * 0.08;

      // Gentle continuous breathing sway
      const idleSway = Math.sin(time * 0.8) * 0.02;
      workstationGroup.rotation.x = state.curRotX + idleSway;
      workstationGroup.rotation.y = state.curRotY;
      workstationGroup.position.y = Math.sin(time * 1.2) * 0.06;

      // Orbitals floating animation
      state.orbitals.forEach((orb, i) => {
        orb.group.position.y = orb.origPos[1] + Math.sin(time * orb.speed + i) * 0.08;
        orb.group.rotation.y += 0.02;
        orb.group.rotation.x += 0.01;
      });

      // Particle explosion animation during shutter compile
      if (state.burstProgress < 1) {
        state.burstProgress += dt * 1.8;
        const prog = state.burstProgress;
        const posAttr = state.particles.geometry.attributes.position;
        const posArr = posAttr.array;

        state.particles.material.opacity = Math.max(0, 1 - prog * 1.2);

        for (let i = 0; i < pCount; i++) {
          const v = state.particleVels[i];
          posArr[i * 3] = v.x * prog * 1.2;
          posArr[i * 3 + 1] = 1.0 + v.y * prog * 1.2;
          posArr[i * 3 + 2] = v.z * prog * 1.4;
        }
        posAttr.needsUpdate = true;
      } else {
        state.particles.material.opacity = 0;
      }

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

      // Dispose Three.js objects
      baseGeo.dispose();
      chassisMat.dispose();
      trackpadGeo.dispose();
      trackpadMat.dispose();
      kbGeo.dispose();
      kbMat.dispose();
      lidGeo.dispose();
      displayGeo.dispose();
      displayMat.dispose();
      glassOverlayGeo.dispose();
      glassOverlayMat.dispose();
      gridHelper.dispose();
      pGeo.dispose();
      pMat.dispose();
      screenTexture.dispose();
      renderer.dispose();
    };
  }, [updateScreenTexture]);

  return (
    <div className="webdev-3d-workstation-container" ref={containerRef}>
      {/* Visual Flash Burst Overlay on Shutter Click */}
      {showFlash && <div className="workstation-flash-overlay" aria-hidden="true" />}

      {/* 3D WebGL Canvas */}
      <canvas 
        ref={canvasRef} 
        className={`webdev-3d-canvas ${isDragging ? 'is-dragging' : ''}`}
        onClick={handleTriggerCompile}
        title="Clicca o trascina per ruotare la workstation 3D a 360°"
      />

      {/* Floating 3D Control Strip */}
      <div className="workstation-ui-floating-bar font-mono">
        <div className="ui-tabs-group">
          <button 
            className={`ui-mode-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('preview')}
          >
            <FiMonitor />
            <span>01 // LIVE SHOWCASE</span>
          </button>

          <button 
            className={`ui-mode-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('code')}
          >
            <FiCode />
            <span>02 // REACT 18 CODE</span>
          </button>

          <button 
            className={`ui-mode-btn ${activeTab === 'terminal' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('terminal')}
          >
            <FiTerminal />
            <span>03 // BUILD LOG</span>
          </button>
        </div>

        <div className="ui-action-group">
          <button 
            className="ui-reset-btn"
            onClick={handleResetRotation}
            title="Ripristina Angolatura 3D Iniziale"
          >
            <FiRefreshCw />
            <span>RESET 3D</span>
          </button>

          <a 
            href="https://southdvstudio.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="ui-launch-btn"
            title="Visita southdv.studio"
          >
            <span>southdv.studio</span>
            <FiExternalLink />
          </a>

          <button 
            className={`ui-compile-trigger-btn ${isCompiling ? 'compiling' : ''}`}
            onClick={handleTriggerCompile}
            title="Attiva lo shutter di compilazione e il flash"
          >
            <FiZap />
            <span>{isCompiling ? 'COMPILING...' : `COMPILE & FLASH #${buildCount}`}</span>
          </button>
        </div>
      </div>

      {/* Hint Badge for Interactivity */}
      <div className="workstation-3d-hint font-mono">
        <span className="hint-bracket">[</span>
        <span className="hint-text">✦ DRAG TO ROTATE 360° • CLICK TO COMPILE & SHUTTER FLASH</span>
        <span className="hint-bracket">]</span>
      </div>
    </div>
  );
}
