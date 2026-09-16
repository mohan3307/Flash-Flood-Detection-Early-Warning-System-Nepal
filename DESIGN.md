# Design System: SENSORA Alpine Tactical Warning

## 1. Visual Theme & Atmosphere
A high-stakes, cockpit-dense tactical telemetry command center engineered for life-safety hydrological surveillance in steep Himalayan river catchments (Sindhupalchok, Nepal). The aesthetic blends defense-grade glassmorphism, cold tactical precision, and aviation HUD instrumentation. Low-reflective oceanic midnight slate backgrounds eliminate visual fatigue during prolonged watch shifts, allowing high-contrast hazard signals to pierce through with cognitive immediacy.

## 2. Color Palette & Roles
- **Canvas Base (`#0B1326` / `#060E20`)** — Primary tactical operations ground, anti-reflective deep slate
- **Surface Layer 1 (`#131B2E` / `#171F33`)** — Docked telemetry trays, chart containers, and GIS map frames
- **Surface Layer 2 (`#222A3D` / `#2D3449`)** — Elevated sensor pods, incident cards, interactive panels
- **Border Hairline (`#334155` / `#3D494C`)** — 1px tactical gridlines and bounding box reticles
- **Telemetry Cyan (`#06B6D4` / `#4CD7F6`)** — Live telemetry streams, radar sweeps, active sensor pings, primary CTAs
- **Hazard Crimson (`#EF4444` / `#93000A`)** — Critical flash flood breach, bankfull overtopping, siren broadcast
- **Urgent Amber (`#FFB95F` / `#E79400`)** — Surge advisory watch, cloudburst warning, sensor link degraded
- **Nominal Emerald (`#10B981`)** — Safe baseflow stages, nominal radio link, verified stations
- **Telemetry Monospace Text (`#DAE2FD` / `#BCC9CD`)** — High-legibility data values, coordinates, and timestamps

## 3. Typographic Architecture
- **Display & Section Headers:** `Space Grotesk` — Technical, authoritative, tight letter-spacing (`-0.02em`)
- **Operational Interface:** `Inter` — High-clarity microcopy, incident descriptions, and SOP checklists
- **Telemetry & Instrument Streams:** `JetBrains Mono` — Fixed-pitch numeric cells preventing character jitter during rapid streaming updates
- **Styling Rules:** All label tiers use uppercase transformations with tracking (`letter-spacing: 0.06em`) to enforce military HUD telemetry standards.

## 4. Component Stylings
- **Command Stepper:** High-visibility horizontal 6-step demo bar with active scenario highlights and hotkey triggers.
- **Alert Banner:** High-priority crimson hazard pod with pulsating hazard border, estimated warning lead-time countdown, and dual-column SOP action checklist.
- **Flood Risk Card:** Large visual risk gauge with dynamic chromatic aura, ensemble confidence score, and momentum vector.
- **Explainable AI (XAI):** 4-bar feature attribution progress meters breaking down the model's physical drivers.
- **Multi-Sensor Charts:** High-contrast streaming time-series plots on slate backdrops with cyan/amber/crimson line plots and 10m/30m/1h filters.
- **GIS Catchment Map:** CartoDB dark-themed Himalayan river corridor map with color-coded risk markers and interactive popup telemetry inspectors.
- **Node Diagnostics Grid:** 4-column node monitoring table displaying battery %, LoRaWAN RSSI, and fault simulation toggles.
