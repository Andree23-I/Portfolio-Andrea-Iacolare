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

  // Focus modes: 'desktop' | 'mobile' | 'code' | 'overview'
  const [activeFocus, setActiveFocus] = useState('overview');
  const [isDragging, setIsDragging] = useState(false);

  // References for Three.js state
  const threeRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    sculptureGroup: null,
    desktopGroup: null,
    mobileGroup: null,
    codeGroup: null,
    halo1: null,
    halo2: null,
    orbitals: [],
    targetRotX: 0.1,
    targetRotY: -0.2,
    curRotX: 0.1,
    curRotY: -0.2,
    userDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    startRotX: 0,
    startRotY: 0,
    targetCamX: 0,
    targetCamY: 0.1,
    targetCamZ: 5.4,
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
      osc.frequency.setValueAtTime(620, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }, []);

  // Set focus perspective on one of the devices
  const setFocus = useCallback((mode) => {
    setActiveFocus(mode);
    playSoftClick();
    const state = threeRef.current;

    if (mode === 'desktop') {
      state.targetRotX = 0.05;
      state.targetRotY = 0;
      state.targetCamZ = 4.6;
    } else if (mode === 'mobile') {
      state.targetRotX = 0.08;
      state.targetRotY = -0.55;
      state.targetCamZ = 4.8;
    } else if (mode === 'code') {
      state.targetRotX = 0.08;
      state.targetRotY = 0.55;
      state.targetCamZ = 4.8;
    } else {
      // overview
      state.targetRotX = 0.1;
      state.targetRotY = -0.2;
      state.targetCamZ = 5.4;
    }
  }, [playSoftClick]);

  // Procedural Textures for the 3 Screens
  const createTextures = useCallback(() => {
    // 1. Desktop Screen Texture (southdv.studio)
    const dCanvas = document.createElement('canvas');
    dCanvas.width = 1024;
    dCanvas.height = 640;
    const dCtx = dCanvas.getContext('2d');
    if (dCtx) {
      dCtx.fillStyle = '#090a10';
      dCtx.fillRect(0, 0, 1024, 640);

      // Grid pattern
      dCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      dCtx.lineWidth = 1;
      for (let x = 0; x < 1024; x += 40) {
        dCtx.beginPath();
        dCtx.moveTo(x, 0);
        dCtx.lineTo(x, 640);
        dCtx.stroke();
      }

      // Title bar
      dCtx.fillStyle = '#12141e';
      dCtx.fillRect(0, 0, 1024, 64);
      dCtx.fillStyle = '#ff5f56';
      dCtx.beginPath(); dCtx.arc(32, 32, 8, 0, Math.PI * 2); dCtx.fill();
      dCtx.fillStyle = '#ffbd2e';
      dCtx.beginPath(); dCtx.arc(58, 32, 8, 0, Math.PI * 2); dCtx.fill();
      dCtx.fillStyle = '#27c93f';
      dCtx.beginPath(); dCtx.arc(84, 32, 8, 0, Math.PI * 2); dCtx.fill();

      // Address bar
      dCtx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      dCtx.beginPath(); dCtx.roundRect(120, 14, 520, 36, 6); dCtx.fill();
      dCtx.fillStyle = '#10b981';
      dCtx.font = '600 16px "Fira Code", monospace';
      dCtx.fillText('🔒 https://southdvstudio.vercel.app', 136, 38);

      dCtx.fillStyle = '#ff4b26';
      dCtx.font = '700 14px "Fira Code", monospace';
      dCtx.fillText('NEXT.JS 15 PROD', 840, 38);

      // Hero content
      dCtx.fillStyle = '#ff4b26';
      dCtx.font = '700 16px "Fira Code", monospace';
      dCtx.fillText('[ ARCHITECTURE // CREATIVE DIGITAL STUDIO ]', 60, 130);

      dCtx.fillStyle = '#ffffff';
      dCtx.font = '800 52px "Syne", sans-serif';
      dCtx.fillText('southdv.studio', 60, 195);

      dCtx.fillStyle = '#9da2b4';
      dCtx.font = '400 20px "Outfit", sans-serif';
      dCtx.fillText('High-performance web architecture, tactile physics & modern e-commerce.', 60, 240);

      // Metric Badges
      const badges = [
        { label: 'LIGHTHOUSE', val: '100/100', col: '#10b981', x: 60 },
        { label: 'EDGE TTFB', val: '< 80ms', col: '#ff4b26', x: 300 },
        { label: 'RESPONSIVE', val: 'FLUID CSS', col: '#00f0ff', x: 540 }
      ];
      badges.forEach(b => {
        dCtx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        dCtx.beginPath(); dCtx.roundRect(b.x, 280, 210, 100, 8); dCtx.fill();
        dCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        dCtx.stroke();

        dCtx.fillStyle = b.col;
        dCtx.font = '800 28px "Fira Code", monospace';
        dCtx.fillText(b.val, b.x + 20, 332);

        dCtx.fillStyle = '#616575';
        dCtx.font = '600 13px "Fira Code", monospace';
        dCtx.fillText(b.label, b.x + 20, 362);
      });

      // Bottom Wireframe Graphic
      dCtx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      dCtx.lineWidth = 2;
      dCtx.strokeRect(60, 420, 904, 160);
      dCtx.fillStyle = 'rgba(0, 240, 255, 0.04)';
      dCtx.fillRect(60, 420, 904, 160);

      dCtx.fillStyle = '#00f0ff';
      dCtx.font = '600 15px "Fira Code", monospace';
      dCtx.fillText('✦ LIVE PRODUCTION READY • FULL-STACK DEPLOYMENT ACTIVE', 80, 510);
    }
    const dTex = new THREE.CanvasTexture(dCanvas);
    dTex.colorSpace = THREE.SRGBColorSpace;

    // 2. Mobile Screen Texture
    const mCanvas = document.createElement('canvas');
    mCanvas.width = 480;
    mCanvas.height = 960;
    const mCtx = mCanvas.getContext('2d');
    if (mCtx) {
      mCtx.fillStyle = '#090a10';
      mCtx.fillRect(0, 0, 480, 960);

      // Top notch / status
      mCtx.fillStyle = '#10b981';
      mCtx.font = '700 14px "Fira Code", monospace';
      mCtx.fillText('9:41 • 5G // 200 OK', 30, 45);

      // URL
      mCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      mCtx.beginPath(); mCtx.roundRect(24, 70, 432, 44, 8); mCtx.fill();
      mCtx.fillStyle = '#ffffff';
      mCtx.font = '600 15px "Fira Code", monospace';
      mCtx.fillText('🔒 andreaiacolare.dev', 44, 98);

      // Mobile Content Card
      mCtx.fillStyle = '#ff4b26';
      mCtx.font = '700 14px "Fira Code", monospace';
      mCtx.fillText('[ MOBILE ARCHITECTURE ]', 30, 160);

      mCtx.fillStyle = '#ffffff';
      mCtx.font = '800 32px "Syne", sans-serif';
      mCtx.fillText('Responsive Core', 30, 205);

      mCtx.fillStyle = '#9da2b4';
      mCtx.font = '400 16px "Outfit", sans-serif';
      mCtx.fillText('Zero layout shift, instant tap response.', 30, 240);

      // Mobile metric pills
      const mPills = [
        { label: 'REACT 18', col: '#00f0ff', y: 300 },
        { label: 'TAILWIND v4', col: '#8b5cf6', y: 400 },
        { label: 'EDGE CACHED', col: '#10b981', y: 500 },
        { label: 'AI AUTOMATIONS', col: '#f59e0b', y: 600 }
      ];
      mPills.forEach(p => {
        mCtx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        mCtx.beginPath(); mCtx.roundRect(24, p.y, 432, 75, 10); mCtx.fill();
        mCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        mCtx.stroke();

        mCtx.fillStyle = p.col;
        mCtx.font = '700 20px "Fira Code", monospace';
        mCtx.fillText(`✦ ${p.label}`, 48, p.y + 45);
      });
    }
    const mTex = new THREE.CanvasTexture(mCanvas);
    mTex.colorSpace = THREE.SRGBColorSpace;

    // 3. Code Screen Texture
    const cCanvas = document.createElement('canvas');
    cCanvas.width = 720;
    cCanvas.height = 960;
    const cCtx = cCanvas.getContext('2d');
    if (cCtx) {
      cCtx.fillStyle = '#090a10';
      cCtx.fillRect(0, 0, 720, 960);

      // Header
      cCtx.fillStyle = '#141620';
      cCtx.fillRect(0, 0, 720, 56);
      cCtx.fillStyle = '#616575';
      cCtx.font = '600 15px "Fira Code", monospace';
      cCtx.fillText('// ArchitectureEngine.tsx', 24, 34);

      const codeLines = [
        { t: "import { createModernSystem } from '@andrea/core';", c: '#00f0ff' },
        { t: "import { Next15, React18, AI } from 'web-stack';", c: '#8b5cf6' },
        { t: "", c: '' },
        { t: "export default async function Portfolio() {", c: '#ff4b26' },
        { t: "  const experience = await createModernSystem({", c: '#ffffff' },
        { t: "    architect: 'Andrea Iacolare',", c: '#10b981' },
        { t: "    location: 'Salerno, IT // 40.68° N',", c: '#10b981' },
        { t: "    performance: {", c: '#f59e0b' },
        { t: "      lighthouse: 100,", c: '#f59e0b' },
        { t: "      edgeTTFB: '<80ms',", c: '#f59e0b' },
        { t: "      cls: 0.000", c: '#f59e0b' },
        { t: "    },", c: '#f59e0b' },
        { t: "    focus: ['Creative Engineering', 'Full-Stack'],", c: '#00f0ff' },
        { t: "    status: 'PRODUCTION_VERIFIED'", c: '#10b981' },
        { t: "  });", c: '#ffffff' },
        { t: "", c: '' },
        { t: "  return <SculptureStage stage={experience} />;", c: '#ff4b26' },
        { t: "}", c: '#ff4b26' }
      ];

      codeLines.forEach((cl, idx) => {
        if (!cl.t) return;
        cCtx.fillStyle = cl.c;
        cCtx.font = '500 16px "Fira Code", monospace';
        cCtx.fillText(cl.t, 32, 100 + idx * 36);
      });
    }
    const cTex = new THREE.CanvasTexture(cCanvas);
    cTex.colorSpace = THREE.SRGBColorSpace;

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

    const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 100);
    camera.position.set(0, 0.1, 5.4);
    state.camera = camera;

    // Studio Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.4));

    const solarKey = new THREE.DirectionalLight(0xff4b26, 3.0);
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
    state.desktopGroup = desktopGroup;

    const deskGeo = new THREE.BoxGeometry(3.6, 2.25, 0.07);
    const deskFrame = new THREE.Mesh(deskGeo, glassFrameMat);
    desktopGroup.add(deskFrame);
    desktopGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(deskGeo), edgeLineMat));

    const deskScreenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.52, 2.18),
      new THREE.MeshBasicMaterial({ map: dTex })
    );
    deskScreenMesh.position.z = 0.038;
    desktopGroup.add(deskScreenMesh);
    sculptureGroup.add(desktopGroup);

    // 2. Mobile Viewport (Angled forward right)
    const mobileGroup = new THREE.Group();
    state.mobileGroup = mobileGroup;
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
    mobileGroup.add(mobScreenMesh);
    sculptureGroup.add(mobileGroup);

    // 3. Code Viewport (Angled back left)
    const codeGroup = new THREE.Group();
    state.codeGroup = codeGroup;
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
    codeGroup.add(codeScreenMesh);
    sculptureGroup.add(codeGroup);

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
      { text: 'NEXT.JS', color: 0xffffff, pos: [-2.6, 1.6, 0.3] },
      { text: 'REACT 18', color: 0x00f0ff, pos: [2.5, 1.6, 0.2] },
      { text: 'AI AGENTS', color: 0xff4b26, pos: [2.3, -1.5, 0.6] },
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

    // Mouse & Touch Drag Handlers (Smooth Orbit)
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
        state.targetRotY = state.startRotY + deltaX * 0.007;
        state.targetRotX = Math.max(-0.4, Math.min(0.5, state.startRotX + deltaY * 0.007));
      } else {
        // Natural subtle mouse parallax across hero
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        state.targetRotY = -0.2 + normX * 0.22;
        state.targetRotX = 0.1 - normY * 0.14;
      }
    };

    const onMouseUp = () => {
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
        state.startRotX = state.targetRotX;
        state.startRotY = state.targetRotY;
      }
    };

    const onTouchMove = (e) => {
      if (state.userDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - state.dragStartX;
        const deltaY = e.touches[0].clientY - state.dragStartY;
        state.targetRotY = state.startRotY + deltaX * 0.007;
        state.targetRotX = Math.max(-0.4, Math.min(0.5, state.startRotX + deltaY * 0.007));
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
      camera.position.z = w < 768 ? 6.2 : 5.4;
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

      // Smooth interpolation
      state.curRotX += (state.targetRotX - state.curRotX) * 0.08;
      state.curRotY += (state.targetRotY - state.curRotY) * 0.08;

      // Gentle continuous organic breathing sway
      const idleSway = Math.sin(time * 0.7) * 0.015;
      sculptureGroup.rotation.x = state.curRotX + idleSway;
      sculptureGroup.rotation.y = state.curRotY;
      sculptureGroup.position.y = Math.sin(time * 1.1) * 0.05;

      // Rotate gyroscopic rings
      if (state.halo1) state.halo1.rotation.z += 0.003;
      if (state.halo2) state.halo2.rotation.z -= 0.002;

      // Floating tech tokens
      state.orbitals.forEach((tok, i) => {
        tok.group.position.y = tok.origPos[1] + Math.sin(time * tok.speed + i) * 0.06;
        tok.group.rotation.y += 0.015;
      });

      // Smooth camera zoom
      camera.position.z += (state.targetCamZ - camera.position.z) * 0.06;

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
  }, [createTextures]);

  return (
    <div className="webdev-3d-sculpture-wrapper" ref={containerRef}>
      {/* Three.js 3D WebGL Canvas */}
      <canvas 
        ref={canvasRef} 
        className={`webdev-3d-sculpture-canvas ${isDragging ? 'is-dragging' : ''}`}
        title="Trascina per ruotare la scultura 3D a 360°"
      />

      {/* Floating 3D Navigation Controls */}
      <div className="sculpture-ui-command-bar font-mono">
        <div className="sculpture-view-group">
          <button 
            className={`sculpture-view-btn ${activeFocus === 'overview' ? 'active' : ''}`}
            onClick={() => setFocus('overview')}
            title="Vista Panoramica 3D"
          >
            <span>[ 3D OVERVIEW ]</span>
          </button>

          <button 
            className={`sculpture-view-btn ${activeFocus === 'desktop' ? 'active' : ''}`}
            onClick={() => setFocus('desktop')}
            title="Focus sul Viewport Desktop"
          >
            <FiMonitor />
            <span>DESKTOP 16:9</span>
          </button>

          <button 
            className={`sculpture-view-btn ${activeFocus === 'mobile' ? 'active' : ''}`}
            onClick={() => setFocus('mobile')}
            title="Focus sul Viewport Mobile"
          >
            <FiSmartphone />
            <span>MOBILE CORE</span>
          </button>

          <button 
            className={`sculpture-view-btn ${activeFocus === 'code' ? 'active' : ''}`}
            onClick={() => setFocus('code')}
            title="Focus sull'Architettura del Codice"
          >
            <FiCode />
            <span>REACT 18 CODE</span>
          </button>
        </div>

        <div className="sculpture-action-group">
          <button 
            className="sculpture-reset-btn"
            onClick={() => setFocus('overview')}
            title="Ripristina Angolatura 3D Iniziale"
          >
            <FiRefreshCw />
            <span>RESET 3D</span>
          </button>

          <a 
            href="https://southdvstudio.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="sculpture-live-link"
            title="Visita southdv.studio"
          >
            <span>southdv.studio</span>
            <FiExternalLink />
          </a>
        </div>
      </div>

      {/* Subtle Hint Badge */}
      <div className="sculpture-hint-badge font-mono">
        <span className="hint-bracket">[</span>
        <span className="hint-text">
          {language === 'en'
            ? '✦ DRAG TO ROTATE 360° • INTERACTIVE 3D RESPONSIVE VIEWPORT SCULPTURE'
            : '✦ TRASCINA PER RUOTARE A 360° • SCULTURA 3D RESPONSIVE VIEWPORT'}
        </span>
        <span className="hint-bracket">]</span>
      </div>
    </div>
  );
}
