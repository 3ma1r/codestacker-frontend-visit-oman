# Visit Oman — CodeStacker Frontend Challenge

## Project Overview
Visit Oman is a two-part frontend experience: a server-rendered discovery site and a client-side trip planner.
It uses only the provided dataset to surface destinations, build routes, and explain choices.
The planner is deterministic and runs entirely in the browser with no backend services.
It enforces travel constraints and produces a clear day-by-day itinerary with costs and explanations.

## Tech Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Zustand (state + persistence)
- Leaflet / React-Leaflet (client-only map rendering)
- No backend services
- No external routing APIs
- Deterministic planning logic

## How to Run
Recommended: Node.js 18+

```bash
npm install
npm run dev
```

Other commands:
```bash
npm run lint
npm run build
```

## App Routes
- `/en`, `/ar` — SSR Discover
- `/{locale}/destinations` — SSR browse
- `/{locale}/destinations/[id]` — SSR details
- `/{locale}/planner` — CSR planner

## Data Source
All content is loaded from `data/data.json` (300 destinations).
IDs are unique; names can repeat.

## State & Persistence
Local state is persisted in `localStorage` under `visitoman:v1`.
Persisted keys:
- `savedInterests`
- `plannerInputs`
- `plannerResult`

## Planner Algorithm (Deterministic Pipeline)
- Phase A: **Region allocation** (`allocateRegions`)
  - If days >= 3, use at least 2 regions
  - No region exceeds `ceil(days / 2)`
  - Deterministic tie-break by fixed region order
- Phase B: **Day route build** (`buildDayRoute`)
  - Greedy insertion using detour-aware scoring
  - Validated by `validateDay` constraints
- Phase C: **Improvement** (`twoOptImprove`)
  - Deterministic 2-opt; only accepts strictly shorter routes that remain valid
- Phase D: **Scheduling** (`scheduleDay`)
  - Adds timestamps and travel minutes using a fixed average speed
- Phase E: **Explanations**
  - Top 2 scoring components per stop for explanation UI

## Scoring Model
Components:
- interest, seasonFit, detour, cost, crowd, diversity

All components are normalized to [0, 1]. Penalty components are subtracted.
DEFAULT_WEIGHTS:
- interest: 0.30
- seasonFit: 0.20
- detour: 0.18
- cost: 0.14
- crowd: 0.10
- diversity: 0.08

For explanations, penalties are converted to benefits (1 - value) before ranking.

## Constraints Enforced
- Max stops/day by intensity (relaxed 3, balanced 4, packed 5)
- Max visit time per day: 8 hours
- Max driving distance per day: 250 km
- Same region per day
- Category variety rule (deterministic primary-category count; max 2)
- Rest gap rule (no adjacent long stops > 90 minutes)
- Deterministic ordering and tie-breaks

## Budget & Feasibility
Cost breakdown: fuel + tickets + food + hotel.
Thresholds per tier:
- low: 60 OMR/day
- medium: 110 OMR/day
- luxury: 200 OMR/day

Adjustment pass (deterministic):
- Swap expensive paid stops with cheaper same-category alternatives
- Drop the most expensive paid stop only as a last resort

`overBudgetBy` is shown when total exceeds the threshold.

## Map
Client-only Leaflet map renders markers + polyline per day.
Active stop highlight syncs between the timeline and map.
Loaded via dynamic import with `ssr: false` to avoid SSR execution.

## Limitations / Future Improvements
- Fixed driving speed assumption (no live traffic)
- No road network routing (straight-line distance only)
- No lodging location model
- No time windows or operating hours per destination

## Compliance Checklist
- [x] Dataset-driven SSR pages (no hardcoded destinations)
- [x] CSR planner with deterministic computation in-browser
- [x] Haversine distance (no external routing APIs)
- [x] Constraint-aware itinerary generation
- [x] Two-phase planning (region allocation + intra-region routing)
- [x] Improvement strategy (deterministic 2-opt)
- [x] Local persistence (saved interests + planner state)
- [x] Explanation panel (top 2 score components)
