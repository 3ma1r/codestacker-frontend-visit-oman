# Visit Oman — CodeStacker Frontend Challenge

A two-phase frontend platform for discovering Oman destinations and generating constraint-aware trip itineraries. Built for the CodeStacker 2026 Frontend Development Challenge.

---

## 1. Project Overview

**Visit Oman** combines a server-rendered discovery experience with a client-side intelligent trip planner.

- **Part 1 (SSR):** Marketing discovery — landing page, browsable destination catalogue, and destination details. Designed to inspire interest and collect user preferences.
- **Part 2 (CSR):** Trip planner — deterministic itinerary generator that converts saved interests and user inputs into a realistic multi-day route. Runs entirely in the browser with no backend.

The app uses a **hybrid rendering architecture (SSR + CSR)**. All content is derived from the provided dataset; no hardcoded itineraries or external routing APIs are used.

---

## 2. Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** (App Router) | Hybrid SSR/CSR, routing, layouts |
| **TypeScript** | Full type safety |
| **Tailwind CSS** | Styling |
| **Zustand** | State management + `localStorage` persistence |
| **Leaflet / React-Leaflet** | Client-only map visualization in planner |

**Constraints:**
- No backend services
- No external routing or distance APIs
- Deterministic planner (no randomness)

---

## 3. How to Run

**Recommended:** Node.js 18+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Other commands:**
```bash
npm run build
npm run lint
```

Production build verified successfully with `npm run build`.

---

## 4. App Routes

| Route | Rendering | Description |
|-------|-----------|-------------|
| `/{locale}` | SSR | Landing page — hero, categories, featured destinations |
| `/{locale}/destinations` | SSR | Browse catalogue with filters (category, region, season) and sort |
| `/{locale}/destinations/[id]` | SSR | Destination details — description, map preview, save interest |
| `/{locale}/planner` | CSR | Trip planner — inputs, itinerary generation, map, cost breakdown |
| `/{locale}/saved` | CSR | Saved destinations list |

Supported locales: `en`, `ar`.

---

## 5. Data Source

- **Single source:** `data/data.json` — 300 destinations
- **IDs:** Unique per destination
- **Names:** Some destination names repeat; IDs distinguish them
- **Images:** Resolved from `public/images/destinations/{id}.{ext}` (jpg, jpeg, png, webp, avif, gif). Falls back to same-name match if no image for ID; otherwise `/globe.svg`
- Duplicate destination names are handled using ID-based routing, and same-name image fallback is used when needed.

---

## 6. State & Persistence

**Storage key:** `visitoman:v1` (localStorage)

**Persisted state:**
- `savedInterests` — IDs of destinations the user saved
- `plannerInputs` — trip duration, budget tier, month, intensity, preferred categories
- `plannerResult` — generated itinerary, cost breakdown, explanations

State persists across refresh and navigation. The planner reads saved interests and stored inputs without additional user action.

---

## 7. SSR vs CSR Boundaries

| Area | Strategy |
|------|----------|
| **Homepage** | SSR — hero, categories, featured destinations from dataset |
| **Destinations browse** | SSR — filter/sort reflected in URL query params |
| **Destination details** | SSR — pre-renderable; map preview uses Google Maps embed iframe (no Leaflet) |
| **Planner** | CSR — client-only; requires Zustand and user interaction |
| **Planner map** | CSR — Leaflet loaded via dynamic import with `ssr: false` |
| **Saved page** | CSR — reads from Zustand store |

---

## 8. Planner Algorithm

The planner uses a **deterministic pipeline** with five phases:

### Phase A: Region Allocation
- Allocates trip days across regions to maximize utility and diversity
- **Constraints:** ≥2 regions if days ≥3; no region exceeds `ceil(days / 2)` days
- Season fit influences allocation; tie-breaks use a fixed region order

### Phase B: Day Route Building
- For each region block, builds an ordered list of stops per day
- Greedy insertion with detour-aware scoring
- Validated by `validateDay` (time, distance, category variety, rest gap)

### Phase C: Improvement (2-opt)
- Deterministic 2-opt local search on each day’s route
- Only accepts strictly shorter routes that still pass validation
- Applied per day; does not cross day boundaries

### Phase D: Scheduling
- Assigns timestamps and travel minutes using a fixed average driving speed
- Produces day-by-day schedule with stop durations and inter-stop distances

### Phase E: Explanations
- Top 2 contributing score components per stop for the explanation panel
- Penalties (cost, crowd, detour) are converted to benefits (`1 - value`) before ranking

### Budget Adjustment Pass
- If total cost exceeds the budget threshold, a deterministic adjustment pass runs:
  - Swap expensive paid stops with cheaper same-category alternatives
  - Drop the most expensive paid stop only as a last resort
- Category coverage is preserved as much as possible

---

## 9. Scoring Model

**Formula:**
```
score(i) =
  w_interest  * Jaccard(categories_user, categories_i)
+ w_seasonFit * SeasonFit(month, recommended_months_i)
- w_crowd     * Normalize(crowd_level_i)
- w_cost      * Normalize(ticket_cost_omr_i)
- w_detour    * DetourPenalty(i, current_route)
+ w_diversity * DiversityGain(i, selected_set)
```

**Weights (DEFAULT_WEIGHTS):**

| Component | Weight | Rationale |
|-----------|--------|-----------|
| interest | 0.30 | Highest — user preferences drive selection |
| seasonFit | 0.20 | Strong — seasonal fit (Khareef, etc.) matters |
| detour | 0.18 | Route efficiency — avoid long detours |
| cost | 0.14 | Budget awareness |
| crowd | 0.10 | Prefer less crowded |
| diversity | 0.08 | Encourage category variety |

**Normalization:** All components are normalized to `[0, 1]` before weighting. Cost and crowd use min–max over the dataset; detour uses `clamp01(detourKm / 50)`.

**Penalty convention:** Cost, crowd, and detour are subtracted; interest, seasonFit, and diversity are added.

**Top-2 explanations:** Components are ranked by `weight × benefit` (penalties converted to benefits). The top 2 are shown per stop.

---

## 10. Constraints Enforced

| Constraint | Value |
|------------|-------|
| Max daily driving distance | 250 km |
| Max daily visit time | 8 hours |
| Region consistency | Each day starts and ends in the same region |
| Category variety | Same category max 2× per day (unless user selected only one) |
| Rest gap | Two long stops (>90 min) cannot be adjacent without a short stop (<45 min) between |
| Stop limits by intensity | relaxed: 3, balanced: 4, packed: 5 stops/day |
| Ordering | Deterministic tie-breaks throughout |

---

## 11. Budget & Cost Logic

**Cost breakdown:**
- **Fuel:** `total_km × 0.03` OMR (fixed cost per km)
- **Tickets:** `sum(ticket_cost_omr)` over all stops
- **Food:** `6 OMR × days`
- **Hotel:** Per night by tier — low: 20, medium: 45, luxury: 90 OMR

**Budget thresholds (per tier × days):**
- low: 60 OMR/day
- medium: 110 OMR/day
- luxury: 200 OMR/day

**Over-budget adjustment:**
- Swap expensive paid stops with cheaper same-category alternatives
- Drop most expensive paid stop only as last resort
- `overBudgetBy` = `max(0, total - threshold)` — shown when total exceeds threshold

---

## 12. Map

**Leaflet** is used only in the planner for route visualization.

**Features:**
- Markers for all planned stops
- Polyline per day
- Active stop highlight synced with itinerary UI
- Day switching while keeping route visible

No external routing or distance APIs are used. All distance calculations are computed locally using **Haversine** (`lib/geo/haversine.ts`). Helpers: `totalKm(route)`, `detourKm(route, candidate)`.

**Destination details page** uses a Google Maps embed iframe for a simple preview — no Leaflet, SSR-safe.

---

## 13. Performance Considerations

- **Small local dataset** — 300 destinations; filtering, search, and pagination remain fast in-browser.
- **Pure local computation** — no backend round trips
- **Pre-grouping** — destinations grouped by region for fast lookups
- **Helper reuse** — `totalKm`, `detourKm`, `computeStats` reused across phases
- **Deterministic, bounded algorithms** — 2-opt limited to per-day routes; no unbounded search
- **Dynamic import** — Leaflet loaded only on planner page with `ssr: false`

---

## 14. Why 2-opt Was Chosen

- **Deterministic** — same input always yields same output; no randomness
- **Simple and reliable** — easy to implement and reason about
- **Good fit for small day routes** — typical 3–5 stops per day; 2-opt is efficient
- **Improves path quality** — reduces travel distance without heavy complexity
- **Constraint-aware** — only accepts improvements that still pass validation (time, rest gap, etc.)

---

## 15. Limitations & Tradeoffs

- **Fixed travel speed** — assumes constant average speed; no live traffic
- **No road network routing** — straight-line Haversine distance only
- **Static dataset** — 300 destinations; no dynamic updates
- **Image availability** — depends on local assets in `public/images/destinations`; fallback to globe.svg if missing
- **Destination details map** — simplified Google Maps embed; planner map is richer (Leaflet, polyline, markers)

---

## 16. Compliance Checklist

- [x] Dataset-driven SSR pages (no hardcoded destinations)
- [x] CSR planner with deterministic in-browser computation
- [x] Haversine distance (no external routing APIs)
- [x] Constraint-aware itinerary generation
- [x] Two-phase planning (region allocation + intra-region routing)
- [x] Improvement strategy (deterministic 2-opt)
- [x] Local persistence (saved interests + planner state)
- [x] Explanation panel (top 2 score components)
- [x] Budget-aware cost estimation and over-budget adjustment
- [x] Map with markers, polyline, active stop, day switching
- [x] Bilingual support (en, ar)

This project was built to satisfy the CodeStacker Frontend Challenge requirements while keeping the itinerary generation fully deterministic, local, and explainable.
