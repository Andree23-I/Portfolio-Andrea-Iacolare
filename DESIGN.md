# DESIGN SYSTEM SPECIFICATION: KINETIC HYPER-EDITORIAL ARCHITECTURE

> **Visual Thesis:** Transform Andrea Iacolare's portfolio from a generic 2023 AI-template into an award-winning (Awwwards/FWA caliber) brutalist-editorial experience. A high-contrast, kinetic identity celebrating engineering precision, architectural typography, and immersive tactile interactions.

---

## 1. Brand Essence & Adjectives
- **Architectural**: Disciplined grids, technical metadata brackets `[ + ]`, razor-sharp lines, and intentional whitespace.
- **Kinetic**: Purposeful physics-based motion with spring transitions, micro-reveals, and fluid card interactions.
- **Monumental**: Colossal, bold display typography (**Syne** 800/900) paired with technical monospace accents (**Space Grotesk** / **Fira Code**).
- **Tactile**: Crisp border outlines, ambient lighting, interactive duotone image frames, and responsive feedback.
- **Unapologetic**: Zero generic AI gradient blobs, zero fake terminal tabs, zero blobby radii.

---

## 2. Typography Strategy
- **Display / Hero Headings**: `Syne`, sans-serif (weights: 700, 800, 900) — distinctive, sculptural, futuristic.
- **Subheadings & Technical Accents**: `Space Grotesk`, monospace/grotesk (weights: 500, 600, 700) — precision tracking, uppercase labels.
- **Body & Prose**: `Plus Jakarta Sans`, sans-serif (weights: 400, 500, 600) — ultra-legible, refined modern geometry.
- **Code & Metadata**: `Fira Code`, monospace (weights: 400, 500).

### Modular Type Scale
- `fs-hero`: `clamp(3.2rem, 8.5vw, 7.5rem)` / line-height: `0.94` / letter-spacing: `-0.04em`
- `fs-h1`: `clamp(2.4rem, 5.5vw, 4.2rem)` / line-height: `1.02` / letter-spacing: `-0.03em`
- `fs-h2`: `clamp(1.8rem, 3.8vw, 2.8rem)` / line-height: `1.12` / letter-spacing: `-0.025em`
- `fs-h3`: `clamp(1.25rem, 2.4vw, 1.75rem)` / line-height: `1.25`
- `fs-body`: `1.05rem` / line-height: `1.65`
- `fs-caption`: `0.82rem` / line-height: `1.4` / letter-spacing: `0.06em`

---

## 3. Color & Materials (OKLCH System)

### Dark Theme (Obsidian Titanium & Solar Flare)
- `--bg-canvas`: `#08080a` (Deep Obsidian Void)
- `--bg-surface`: `rgba(18, 18, 24, 0.85)` (Smoked Titanium)
- `--bg-card`: `rgba(24, 24, 32, 0.9)` (Elevated Carbon)
- `--border-subtle`: `rgba(255, 255, 255, 0.08)` (Technical Hairline)
- `--border-strong`: `rgba(255, 255, 255, 0.2)`
- `--border-active`: `#ff4b26` (Solar Flare)
- `--text-primary`: `#ffffff` (Pure Optical White)
- `--text-secondary`: `#9da2b4` (Steel Mist)
- `--text-tertiary`: `#616575` (Muted Technical)
- `--accent-primary`: `#ff4b26` (Solar Amber / Kinetic Heat)
- `--accent-secondary`: `#ff8400`
- `--accent-cyan`: `#00f0ff` (Cyber Hologram Accent)

### Light Theme (Architectural Porcelain)
- `--bg-canvas`: `#f8f9fc` (Pristine Architectural White)
- `--bg-surface`: `rgba(255, 255, 255, 0.92)`
- `--bg-card`: `rgba(245, 247, 252, 0.95)`
- `--border-subtle`: `rgba(0, 0, 0, 0.08)`
- `--border-strong`: `rgba(0, 0, 0, 0.18)`
- `--border-active`: `#e03512`
- `--text-primary`: `#0a0b10`
- `--text-secondary`: `#474b5c`
- `--text-tertiary`: `#8c90a2`
- `--accent-primary`: `#e03512`

---

## 4. Architectural Signatures
1. **Live System Telemetry Header**: Real-time European clock (`CET`), operational status indicator, location coordinates `[ 40.6824° N, 14.7681° E // SALERNO ]`.
2. **Editorial Asymmetrical Hero**: Massive sculptural typography with interactive duotone portrait frame and reactive floating tech beacons.
3. **Floating Island Command Bar**: Pill-shaped frosted glass navigation bar with smooth route indicator, language switcher, and theme toggle.
4. **Interactive 3D Card Stack**: Ruixen UI 3D carousel with dynamic perspective, drag gestures, and active project spotlight ledger.
5. **Specimen Matrix Skills Grid**: Clean, laboratory-style technical cards with categorical indexing (`01 // ARCHITECTURE`, `02 // AI & AGENTS`, etc.).
6. **Chronological Ledger Experience**: High-fashion resume timeline with bulleted deliverables and metric highlights.
