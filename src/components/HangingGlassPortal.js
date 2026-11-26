import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import './HangingGlassPortal.css';
import { FiX, FiArrowRight, FiCheck } from 'react-icons/fi';

// Pseudo-random generator for procedural shards
function createRng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

// Sutherland-Hodgman polygon clipping
function clipRect(poly, width, height) {
  const edges = [
    [pt => pt[0] >= 0, (p1, p2) => [0, p1[1] + (0 - p1[0]) / (p2[0] - p1[0]) * (p2[1] - p1[1])]],
    [pt => pt[0] <= width, (p1, p2) => [width, p1[1] + (width - p1[0]) / (p2[0] - p1[0]) * (p2[1] - p1[1])]],
    [pt => pt[1] >= 0, (p1, p2) => [p1[0] + (0 - p1[1]) / (p2[1] - p1[1]) * (p2[0] - p1[0]), 0]],
    [pt => pt[1] <= height, (p1, p2) => [p1[0] + (height - p1[1]) / (p2[1] - p1[1]) * (p2[0] - p1[0]), height]]
  ];

  let output = poly;
  for (const [inside, intersect] of edges) {
    const input = output;
    output = [];
    for (let i = 0; i < input.length; i++) {
      const cur = input[i];
      const next = input[(i + 1) % input.length];
      const curIn = inside(cur);
      const nextIn = inside(next);
      if (curIn) output.push(cur);
      if (curIn !== nextIn) output.push(intersect(cur, next));
    }
    if (!output.length) break;
  }
  return output;
}

// Polygon area calculation
function getPolyArea(poly) {
  let total = 0;
  for (let i = 0; i < poly.length; i++) {
    const p1 = poly[i];
    const p2 = poly[(i + 1) % poly.length];
    total += p1[0] * p2[1] - p2[0] * p1[1];
  }
  return Math.abs(total) / 2;
}

// Generate spiderweb radial cracks & polygon shards
function generateShatterShards(width, height, hitX, hitY, seed = 7) {
  const rng = createRng(seed);
  const ringCount = 14;
  const maxRadius = Math.hypot(Math.max(hitX, width - hitX), Math.max(hitY, height - hitY)) * 1.05;
  const radii = [0, 0.045, 0.1, 0.17, 0.26, 0.37, 0.5, 0.67, 1].map(f => f * maxRadius);
  const baseAngle = rng() * Math.PI * 2;
  
  const angles = radii.map(() => 
    Array.from({ length: ringCount }, (_, idx) => 
      baseAngle + (idx + 0.5 * (rng() - 0.5)) / ringCount * Math.PI * 2
    )
  );

  const getPointAt = (rIdx, aIdx) => {
    const angle = angles[rIdx][aIdx];
    const dist = rIdx === radii.length - 1
      ? (radii[rIdx] / Math.cos(Math.PI / ringCount)) * 1.15
      : radii[rIdx] * (rIdx === 0 ? 0 : 0.88 + rng() * 0.24);
    return [hitX + Math.cos(angle) * dist, hitY + Math.sin(angle) * dist];
  };

  const grid = radii.map((_, rIdx) => {
    const ringPts = Array.from({ length: ringCount }, (_, aIdx) => getPointAt(rIdx, aIdx));
    ringPts.push(ringPts[0]);
    return ringPts;
  });

  const polygons = [];
  for (let r = 0; r < radii.length - 1; r++) {
    for (let a = 0; a < ringCount; a++) {
      const quad = r === 0 
        ? [grid[0][0], grid[1][a], grid[1][a + 1]]
        : [grid[r][a], grid[r + 1][a], grid[r + 1][a + 1], grid[r][a + 1]];
      const clipped = clipRect(quad, width, height);
      if (clipped.length >= 3 && getPolyArea(clipped) > 1e-5) {
        polygons.push(clipped);
      }
    }
  }
  return polygons;
}

// Crack / Shutter animation phase timings
function calculateStrikePhases(timeElapsed) {
  const crack = timeElapsed < 0 ? 0 : Math.min(1, timeElapsed / 0.32);
  const burst = timeElapsed < 0.42 ? 0 : Math.min(1, (timeElapsed - 0.42) / 1.8);
  const reform = timeElapsed < 1.95 ? 0 : Math.min(1, (timeElapsed - 1.95) / 0.55);
  const done = timeElapsed >= 2.5;
  return { crack, burst, reform, done };
}

// Rounded rectangle path helper
function createRoundedRectPath(w, h, radius, path = new THREE.Shape()) {
  const x = -w / 2;
  const y = -h / 2;
  path.moveTo(x + radius, y);
  path.lineTo(x + w - radius, y);
  path.quadraticCurveTo(x + w, y, x + w, y + radius);
  path.lineTo(x + w, y + h - radius);
  path.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  path.lineTo(x + radius, y + h);
  path.quadraticCurveTo(x, y + h, x, y + h - radius);
  path.lineTo(x, y + radius);
  path.quadraticCurveTo(x, y, x + radius, y);
  return path;
}

export default function HangingGlassPortal({ isOpen, onClose, onSelectDestination, language = 'it' }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentPaneIdx, setCurrentPaneIdx] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Portal destinations data
  const destinations = useMemo(() => [
    {
      id: "work",
      sectionId: "work",
      num: "01",
      tag: "SELECTED WORKS",
      title: language === 'en' ? "PROJECTS & LIVE WEB" : "PROGETTI & SITI WEB",
      subtitle: "southdv.studio • Foto Extracolor",
      desc: language === 'en' 
        ? "Explore live high-performance websites, 3D card stack showcase, and client applications."
        : "Esplora i siti web realizzati, carosello 3D card stack ed applicazioni complete.",
      accent: "#ff4b26",
      tech: "NEXT.JS 15 • REACT 18 • TAILWIND"
    },
    {
      id: "hero",
      sectionId: "hero",
      num: "02",
      tag: "INTERACTIVE CENTERPIECE",
      title: language === 'en' ? "3D CYBER WORKSTATION" : "WORKSTATION 3D // HERO",
      subtitle: language === 'en' ? "Interactive 3D Web Engine" : "Motore Web 3D & Mirino HUD",
      desc: language === 'en'
        ? "Dynamic 3D tilt tracking, macOS window controls, live preview, and compile shutter flash."
        : "Inclinazione 3D dinamica, controlli macOS, live preview e shutter flash di compilazione.",
      accent: "#00f0ff",
      tech: "3D PERSPECTIVE • WEBAUDIO • LIVE ENGINE"
    },
    {
      id: "craft",
      sectionId: "craft",
      num: "03",
      tag: "TECHNICAL ARSENAL",
      title: language === 'en' ? "CRAFT & ARCHITECTURE" : "COMPETENZE & STACK",
      subtitle: language === 'en' ? "Frontend, AI & Backend" : "Frontend, Agenti AI & Cloud",
      desc: language === 'en'
        ? "Engineering breakdown of modern web apps, LLM workflows, robust APIs, and edge performance."
        : "Architetture web moderne, workflow di agenti AI, API resilienti e performance edge.",
      accent: "#8b5cf6",
      tech: "AI AGENTS • TYPESCRIPT • NODE.JS"
    },
    {
      id: "journey",
      sectionId: "journey",
      num: "04",
      tag: "CAREER TIMELINE",
      title: language === 'en' ? "THE JOURNEY SO FAR" : "IL MIO PERCORSO",
      subtitle: "2022 — 2026 Milestones",
      desc: language === 'en'
        ? "From early web development foundations to international internships and enterprise studio launches."
        : "Dalle prime basi di programmazione allo stage a Siviglia fino ai lanci di produzione 2026.",
      accent: "#f59e0b",
      tech: "2022 • 2023 • 2024 • 2025 • 2026"
    },
    {
      id: "contact",
      sectionId: "contact",
      num: "05",
      tag: "DIRECT COLLABORATION",
      title: language === 'en' ? "LET'S BUILD TOGETHER" : "PARLA CON ME // CONTATTO",
      subtitle: language === 'en' ? "Available for Commissions" : "Disponibile per Nuovi Progetti",
      desc: language === 'en'
        ? "Direct email, WhatsApp chat, and availability for freelance development and consulting."
        : "Email rapida, chat WhatsApp e disponibilità per contratti web freelance e consulenze.",
      accent: "#10b981",
      tech: "EMAIL • WHATSAPP • GITHUB • LINKEDIN"
    },
    {
      id: "all",
      sectionId: "hero",
      num: "06",
      tag: "COMPLETE EXPERIENCE",
      title: language === 'en' ? "FULL ARCHITECTURAL TOUR" : "TOUR COMPLETO DEL SITO",
      subtitle: language === 'en' ? "Complete Portfolio" : "Esperienza Completa",
      desc: language === 'en'
        ? "Enter and experience the entire editorial portfolio from top to bottom."
        : "Entra ed esplora tutte le sezioni del portfolio in sequenza cinematografica.",
      accent: "#ffffff",
      tech: "CONTINUOUS CINEMATIC SCROLL"
    }
  ], [language]);

  // Audio effect for glass crack and shatter burst
  const playShatterSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Crack impulse
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1400, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.12);
      gain1.gain.setValueAtTime(0.25, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.16);

      // Shard shimmer
      setTimeout(() => {
        try {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(800, ctx.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.25);
          gain2.gain.setValueAtTime(0.12, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.3);
        } catch {}
      }, 50);
    } catch {
      // Audio autoplay restrictions fallback
    }
  }, []);

  // Handle destination selection and smooth transition
  const handleSelect = useCallback((dest) => {
    setIsFadingOut(true);
    playShatterSound();

    setTimeout(() => {
      if (onSelectDestination) {
        onSelectDestination(dest);
      }
      if (onClose) {
        onClose();
      }
      setIsFadingOut(false);
    }, 650);
  }, [onSelectDestination, onClose, playShatterSound]);

  // Procedural Canvas Poster Textures for each destination
  const textures = useMemo(() => {
    return destinations.map(dest => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1360;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      // Deep dark gradient background
      const grad = ctx.createLinearGradient(0, 0, 0, 1360);
      grad.addColorStop(0, '#0c0d12');
      grad.addColorStop(0.5, '#07080b');
      grad.addColorStop(1, '#020304');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1360);

      // Ambient radial glow matching destination accent
      const radGrad = ctx.createRadialGradient(512, 680, 50, 512, 680, 560);
      radGrad.addColorStop(0, `${dest.accent}33`);
      radGrad.addColorStop(0.6, `${dest.accent}0a`);
      radGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, 1024, 1360);

      // Precision grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 60; x < 1024; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x, 60);
        ctx.lineTo(x, 1300);
        ctx.stroke();
      }
      for (let y = 60; y < 1360; y += 120) {
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(964, y);
        ctx.stroke();
      }

      // Border outline
      ctx.strokeStyle = `${dest.accent}66`;
      ctx.lineWidth = 3;
      ctx.strokeRect(60, 60, 904, 1240);

      // Corner technical marks [ + ]
      ctx.fillStyle = dest.accent;
      ctx.font = '700 28px "Fira Code", monospace';
      ctx.fillText('+', 80, 100);
      ctx.fillText('+', 920, 100);
      ctx.fillText('+', 80, 1280);
      ctx.fillText('+', 920, 1280);

      // Top Tag
      ctx.fillStyle = dest.accent;
      ctx.font = '700 24px "Fira Code", monospace';
      ctx.letterSpacing = '2px';
      ctx.fillText(`[ ${dest.tag} ]`, 100, 160);

      // Large Number
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.font = '900 130px "Syne", sans-serif';
      ctx.fillText(dest.num, 100, 310);

      // Main Title
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 58px "Syne", sans-serif';
      const words = dest.title.split(' ');
      if (words.length > 2) {
        ctx.fillText(words.slice(0, 2).join(' '), 100, 420);
        ctx.fillText(words.slice(2).join(' '), 100, 490);
      } else {
        ctx.fillText(dest.title, 100, 440);
      }

      // Subtitle
      ctx.fillStyle = dest.accent;
      ctx.font = '600 32px "Fira Code", monospace';
      ctx.fillText(dest.subtitle, 100, 560);

      // Decorative divider
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(100, 600, 824, 2);

      // Description text
      ctx.fillStyle = '#9da2b4';
      ctx.font = '400 32px "Outfit", sans-serif';
      const descLines = [
        dest.desc.slice(0, 45),
        dest.desc.slice(45, 90),
        dest.desc.slice(90)
      ];
      descLines.forEach((line, lIdx) => {
        if (line.trim()) ctx.fillText(line.trim(), 100, 670 + lIdx * 48);
      });

      // Bottom Tech Pill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(100, 1150, 824, 64, 12);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 24px "Fira Code", monospace';
      ctx.fillText(`✦ ${dest.tech}`, 130, 1192);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    });
  }, [destinations]);

  // Main Three.js Scene Lifecycle
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

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
    renderer.setClearColor(0x070606, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x070606, 8, 22);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    camera.position.set(0, 0.1, 6.1);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(-3, 6, 7);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xff4b26, 1.2);
    dirLight2.position.set(4, -2, 5);
    scene.add(dirLight2);

    // Dimensions of each hanging glass pane
    const paneConfig = {
      w: 2.7,
      h: 3.5,
      d: 0.3,
      rim: 0.2,
      round: 0.16
    };

    // Row positions
    const paneOffsets = [
      { x: 0, y: 0, z: 0, s: 1 },
      { x: 3.2, y: 0.5, z: -2.4, s: 0.75 },
      { x: 6.4, y: -0.2, z: -1.2, s: 0.85 },
      { x: 9.6, y: 0.7, z: -4.2, s: 0.5 },
      { x: 12.2, y: 0, z: -0.6, s: 0.95 },
      { x: 15.4, y: 0.8, z: -2.8, s: 0.6 }
    ];
    const totalRowSpan = 18.4;

    // Build geometry for thick clear acrylic frame
    const W = paneConfig.w + paneConfig.rim * 2;
    const Y = paneConfig.h + paneConfig.rim * 2;
    const frameShape = createRoundedRectPath(W, Y, paneConfig.round);
    frameShape.holes.push(createRoundedRectPath(paneConfig.w, paneConfig.h, 0.02, new THREE.Path()));

    const extrudeGeo = new THREE.ExtrudeGeometry(frameShape, {
      depth: paneConfig.d,
      bevelEnabled: true,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      bevelSegments: 3,
      curveSegments: 6
    });
    extrudeGeo.translate(0, 0, -paneConfig.d / 2);

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.03,
      transparent: true,
      opacity: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      envMapIntensity: 3.2,
      depthWrite: false
    });

    const edgeLineGeo = new THREE.EdgesGeometry(extrudeGeo, 28);
    const edgeLineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });

    const photoGeo = new THREE.PlaneGeometry(paneConfig.w, paneConfig.h);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xb5b9c6, transparent: true, opacity: 0.35 });
    const clampGeo = new THREE.BoxGeometry(0.32, 0.42, paneConfig.d + 0.18);
    const clampMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.35 });
    const boltGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.14, 12);
    const boltMat = new THREE.MeshStandardMaterial({ color: 0xd8dbe2, metalness: 0.9, roughness: 0.25 });

    // Spawn 6 hanging glass panes
    const paneObjects = paneOffsets.map((offset, idx) => {
      const group = new THREE.Group();
      group.scale.setScalar(offset.s);

      // Photo plane
      const photoMat = new THREE.MeshBasicMaterial({ map: textures[idx % textures.length] });
      const photoMesh = new THREE.Mesh(photoGeo, photoMat);
      photoMesh.userData.frameIndex = idx;
      group.add(photoMesh);

      // Glass Frame
      const glassGroup = new THREE.Group();
      const glassMesh = new THREE.Mesh(extrudeGeo, glassMaterial);
      glassMesh.renderOrder = 2;
      glassGroup.add(glassMesh);
      glassGroup.add(new THREE.LineSegments(edgeLineGeo, edgeLineMat));
      group.add(glassGroup);

      // Suspension wires and brackets
      const topEdgeY = Y / 2;
      for (const side of [-1, 1]) {
        const wireX = side * paneConfig.w * 0.34;
        const clamp = new THREE.Mesh(clampGeo, clampMat);
        clamp.position.set(wireX, topEdgeY - 0.08, 0);
        clamp.renderOrder = 4;
        group.add(clamp);

        const bolt = new THREE.Mesh(boltGeo, boltMat);
        bolt.position.set(wireX, topEdgeY + 0.2, 0);
        group.add(bolt);

        const wireGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(wireX, topEdgeY + 0.27, 0),
          new THREE.Vector3(wireX * 0.55, 38, 0)
        ]);
        group.add(new THREE.Line(wireGeo, wireMat));
      }

      scene.add(group);
      return {
        group,
        photo: photoMesh,
        photoMat,
        glass: glassGroup,
        idx,
        swayOffset: idx * 1.7,
        lean: 0,
        hit: null
      };
    });

    // Crack & Shatter strike animation
    const triggerStrike = (pane, hitU, hitV, curTime) => {
      if (pane.hit) return;

      const hitX = hitU * paneConfig.w;
      const hitY = hitV * paneConfig.h;
      const shardPolys = generateShatterShards(paneConfig.w, paneConfig.h, hitX, hitY, Math.floor(curTime * 1000));
      
      const shardRng = createRng(Math.floor(curTime * 9999));
      const shards = shardPolys.map(poly => {
        const shape = new THREE.Shape(poly.map(([px, py]) => new THREE.Vector2(px, py)));
        const geo = new THREE.ShapeGeometry(shape);
        geo.translate(-paneConfig.w / 2, -paneConfig.h / 2, 0.02);
        const mesh = new THREE.Mesh(geo, pane.photoMat);
        mesh.userData.home = mesh.position.clone();
        pane.group.add(mesh);
        return mesh;
      });

      const velocities = shardPolys.map(() => {
        const randAngle = shardRng() * Math.PI * 2;
        const speed = 0.8 + shardRng() * 1.6;
        return new THREE.Vector3(
          Math.cos(randAngle) * speed,
          Math.sin(randAngle) * speed + 0.4,
          (0.8 + shardRng() * 1.5) * 2.2
        );
      });

      const spins = shardPolys.map(() => new THREE.Vector3(
        (shardRng() - 0.5) * 6,
        (shardRng() - 0.5) * 6,
        (shardRng() - 0.5) * 4
      ));

      pane.hit = {
        t0: curTime,
        shards,
        velocities,
        spins
      };

      // Select this destination and transition!
      handleSelect(destinations[pane.idx]);
    };

    // Interaction state
    const pointerState = {
      drag: false,
      touched: false,
      downX: 0,
      lastX: 0,
      moved: 0,
      pan: 0,
      vel: 0,
      hover: -1,
      px: 0,
      py: 0,
      cx: 0,
      cy: 0
    };

    // Raycaster for picking
    const raycaster = new THREE.Raycaster();
    const pickRay = (x, y) => {
      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((x - rect.left) / rect.width) * 2 - 1,
        -((y - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);
      const meshes = paneObjects.map(p => p.photo);
      const intersects = raycaster.intersectObjects(meshes);
      if (intersects.length > 0 && intersects[0].uv) {
        return {
          idx: intersects[0].object.userData.frameIndex,
          u: intersects[0].uv.x,
          v: intersects[0].uv.y
        };
      }
      return null;
    };

    const onPointerDown = (e) => {
      pointerState.drag = true;
      pointerState.touched = true;
      pointerState.downX = pointerState.lastX = e.clientX;
      pointerState.moved = 0;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      const hit = pickRay(e.clientX, e.clientY);
      pointerState.hover = hit ? hit.idx : -1;
      const rect = canvas.getBoundingClientRect();
      pointerState.px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerState.py = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      canvas.style.cursor = hit && !pointerState.drag ? 'pointer' : '';

      if (!pointerState.drag) return;
      const delta = e.clientX - pointerState.lastX;
      pointerState.lastX = e.clientX;
      pointerState.moved += Math.abs(delta);
      pointerState.pan -= delta * 0.012;
      pointerState.vel = -delta * 0.6;
    };

    const onPointerUp = (e) => {
      pointerState.drag = false;
      if (pointerState.moved < 8) {
        const hit = pickRay(e.clientX, e.clientY);
        if (hit) {
          triggerStrike(paneObjects[hit.idx], hit.u, hit.v, performance.now() / 1000);
        }
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);

    // Resize Observer
    const onResize = () => {
      const w = root.clientWidth || window.innerWidth;
      const h = root.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = camera.aspect < 0.8 ? 58 : 42;
      camera.position.z = camera.aspect < 0.8 ? 7.6 : 6.1;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(root);
    onResize();

    // Render loop
    let animId = 0;
    let lastTime = performance.now();
    let simTime = 0;

    const animate = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      simTime += dt;

      // Inertia & slow ambient drift
      if (!pointerState.drag) {
        pointerState.vel *= Math.exp(-dt * 3);
        pointerState.pan += (pointerState.touched ? 0.04 : 0.08) * dt + pointerState.vel * dt * 0.02;
      }

      // Smooth camera perspective tilt following pointer
      pointerState.cx += (pointerState.px - pointerState.cx) * Math.min(1, dt * 3);
      pointerState.cy += (pointerState.py - pointerState.cy) * Math.min(1, dt * 3);
      camera.position.x = pointerState.cx * 0.35;
      camera.position.y = 0.1 - pointerState.cy * 0.2;
      camera.lookAt(camera.position.x * 0.5, 0.1, -2);

      // Update each hanging pane
      let closestDist = Infinity;
      let centerIdx = 0;

      paneObjects.forEach((pane, idx) => {
        const offset = paneOffsets[idx];
        const paneX = ((offset.x - pointerState.pan * 3) % totalRowSpan + totalRowSpan * 1.5) % totalRowSpan - totalRowSpan / 2;
        const sway = Math.sin(simTime * 0.7 + pane.swayOffset);

        // Turn towards camera when hovered
        const targetLean = pointerState.hover === idx && !pane.hit ? 1 : 0;
        pane.lean += (targetLean - pane.lean) * Math.min(1, dt * 6);

        const rotY = (-0.5 + paneX * -0.04 + sway * 0.06) * (1 - pane.lean * 0.85);
        pane.group.position.set(paneX, offset.y + sway * 0.04, offset.z + pane.lean * 0.45);
        pane.group.rotation.set(0.04 * sway, rotY, 0.02 * sway * (1 - pane.lean));

        const distFromCenter = Math.abs(paneX) + Math.abs(offset.z) * 0.5;
        if (distFromCenter < closestDist) {
          closestDist = distFromCenter;
          centerIdx = idx;
        }

        // Shard physics animation if hit
        if (pane.hit) {
          const phases = calculateStrikePhases(simTime - pane.hit.t0);
          const burstProgress = phases.burst;
          const burstDist = burstProgress * 1.8;
          const curve = (1 - Math.exp(-2.6 * burstDist)) / 2.6;

          pane.hit.shards.forEach((shard, sIdx) => {
            const home = shard.userData.home;
            const vel = pane.hit.velocities[sIdx];
            const spin = pane.hit.spins[sIdx];

            shard.position.set(
              home.x + vel.x * curve * 2.2,
              home.y + vel.y * curve * 2.2 - 1.5 * burstDist * burstDist * 0.5,
              home.z + vel.z * curve * 2.4
            );
            shard.rotation.set(
              spin.x * curve * 2,
              spin.y * curve * 2,
              spin.z * curve * 2
            );
          });
        }
      });

      setCurrentPaneIdx(centerIdx);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);

      // Clean up Three.js allocations
      paneObjects.forEach(p => {
        if (p.hit) {
          p.hit.shards.forEach(s => s.geometry.dispose());
        }
        p.photoMat.dispose();
      });
      extrudeGeo.dispose();
      glassMaterial.dispose();
      edgeLineGeo.dispose();
      edgeLineMat.dispose();
      photoGeo.dispose();
      wireMat.dispose();
      clampGeo.dispose();
      clampMat.dispose();
      boltGeo.dispose();
      boltMat.dispose();
      renderer.dispose();
    };
  }, [isOpen, destinations, textures, handleSelect]);

  if (!isOpen) return null;

  const activeDest = destinations[currentPaneIdx] || destinations[0];

  return (
    <div 
      className={`hanging-glass-portal-overlay ${isFadingOut ? 'portal-fading-out' : ''}`}
      ref={rootRef}
    >
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="hgg-canvas" aria-hidden="true" />

      {/* Top Bar: Portal Brand & Quick Skip */}
      <div className="portal-top-bar">
        <div className="portal-badge font-mono">
          <span className="portal-live-dot" />
          <span>ARCHITECTURAL PORTAL // 2026</span>
        </div>

        <button 
          className="portal-skip-btn font-mono"
          onClick={() => handleSelect(destinations[0])}
          title="Salta introduzione ed entra nel sito"
        >
          <span>{language === 'en' ? 'ENTER PORTFOLIO (SKIP)' : 'ENTRA NEL SITO (SALTA)'}</span>
          <FiArrowRight />
        </button>

        <button 
          className="portal-close-icon-btn"
          onClick={onClose}
          aria-label="Close Portal"
        >
          <FiX />
        </button>
      </div>

      {/* Bottom Editorial Copy & Controls */}
      <div className="portal-bottom-copy">
        <div className="copy-left">
          <span className="copy-eyebrow font-mono">
            [ {activeDest.tag} ]
          </span>
          <h2 className="copy-title">
            {language === 'en' ? 'What would you like to explore?' : 'Cosa vuoi esplorare?'}
          </h2>
          <p className="copy-caption">
            {language === 'en'
              ? 'Tap any glass pane to break the frame and land directly into the chosen section.'
              : 'Tocca o clicca su una lastra di vetro per rompere il diaframma ed entrare nella sezione.'}
          </p>

          <div className="active-destination-chip font-mono" style={{ borderColor: activeDest.accent }}>
            <span className="dest-dot" style={{ background: activeDest.accent }} />
            <span className="dest-name">{activeDest.title}</span>
            <span className="dest-action">✦ {language === 'en' ? 'Click pane to enter' : 'Clicca per entrare'}</span>
          </div>
        </div>

        <div className="copy-right font-mono">
          <div className="destination-counter">
            <span className="counter-num">{activeDest.num}</span>
            <span className="counter-sep">/</span>
            <span className="counter-total">06</span>
          </div>

          <button 
            className="direct-enter-btn font-mono"
            style={{ background: activeDest.accent }}
            onClick={() => handleSelect(activeDest)}
          >
            <span>{language === 'en' ? 'ENTER SECTION' : 'ENTRA NELLA SEZIONE'}</span>
            <FiCheck />
          </button>
        </div>
      </div>
    </div>
  );
}
