# MTG Tracker — Claude Code Project File

> Single-file PWA companion for Magic: The Gathering  
> Live at: **play-mtg.com** | Repo: **imcg1122/MTG_Tracker** | Ko-fi: **ko-fi.com/imcg1122**

---

## Project Overview

MTG Tracker is a free, open-source, ad-free Progressive Web App (PWA) that works fully offline. It is built as a single HTML file (`index.html`) with no external dependencies, plus three PWA support files. It is hosted on GitHub Pages and installable on Android, iOS, and desktop via "Add to Home Screen."

---

## File Structure

The deployable site lives in **`Prod/`**; GitHub Actions publishes it as the Pages site root
(main branch → play-mtg.com, dev branch → play-mtg.com/dev/). Missing any of the five site
files causes silent PWA install failure.

```
Prod/index.html      ← The entire app: all HTML, CSS, and JS in one file (~4,500 lines)
Prod/sw.js           ← Service worker: caches all assets for offline use
Prod/manifest.json   ← PWA metadata: name, icons, display mode
Prod/icon192.png     ← PWA icon (no hyphens in filename)
Prod/icon512.png     ← PWA icon (no hyphens in filename)
scripts/             ← bump-version.mjs (version sync), update-lexicon.mjs (Scryfall check)
infra/assets-cdn.yml ← CloudFormation: S3+CloudFront asset CDN + $10/mo budget alarm
.github/workflows/   ← deploy.yml (prod+dev Pages), lexicon-check.yml (monthly)
docs/                ← DEVELOPMENT.md (environments/assets), MODERNIZATION.md (module-split spec)
```

---

## ⚠️ CRITICAL: Version Increment Rules

**Every time `index.html` is modified, THREE version references must be incremented together:**

| File | Location | Pattern |
|---|---|---|
| `index.html` | Line ~4225 | `navigator.serviceWorker.register('./sw.js?vXX')` |
| `sw.js` | Line 1 | `const CACHE = 'mtg-playmat-vXX'` |
| `index.html` | Line ~1590 | `const APP_VERSION='XX'` |

**Current version: v103**

All three must be updated to the same number in the same session — run **`npm run bump`**
(scripts/bump-version.mjs) to update all three at once. The deploy workflow fails the build if
they disagree. Commit `index.html` and `sw.js` together; never one without the other.

The SW query string (`?vXX`) forces the browser to re-download the service worker. The `CACHE` constant triggers cleanup of old cached assets. `APP_VERSION` is displayed in the app's Resources → App Info tab.

**To diagnose PWA install issues:** Chrome/Edge DevTools → Application → Manifest

---

## v98 Additions (July 2026)

- **Security**: CSP `<meta>` tag; player names sanitized at render in `renderCmd()`; ring-bearer stored raw (double-encode fix); pinch-zoom restored (`touch-action:manipulation` on controls instead).
- **Identification**: format buttons carry `data-fmt`, commander rows carry `data-player` — never match buttons/rows by parsing text or `onclick` strings.
- **Persistence + resume modal** (see State Management Rules) and **screen wake lock** (`requestWakeLock()`, re-acquired on visibility change).
- **Life log/undo**: `logLifeChange()` merges taps within 2.5s; `undoLife()` reverts the last entry; rendered by `renderLifeLog()` in the life card.
- **Table board** (`multi`): `renderMulti()`/`adjMultiLife()`; away-facing seats get class `flipped`.
- `prefers-reduced-motion` support, ARIA labels via `a11yInit()`. (v98's Turn/Phase module and first-player randomizer were removed in v102 at user request.)
- **Token combat**: `combatArea` is saved per-format and re-indexed on token removal (`removeTokenFromStack`, `endCombatPhase` use *spliced* indices only).
- Dev/prod flow, version bump script, and asset strategy: see `docs/DEVELOPMENT.md`. Module-split plan: `docs/MODERNIZATION.md`.

---

## Format Modes

The app has 10 board modes, switched via the format button bar. Each format saves and restores its own independent state.

| Format key | Button label | Starting life | Notes |
|---|---|---|---|
| `commander` | Commander | 40 | Shows commander damage card in right column |
| `standard` | Standard | 20 | Shows Day/Night + Energy in right column; 7 module slots |
| `simple` | Mobile | 20 | Landscape phone layout; module row at bottom; 3 visible module slots |
| `multi` | Table | 40 | Local multiplayer: 2–4 split-screen life counters, away-facing seats rotated 180°; per-seat ⚔ commander damage |
| `mana` | Mana | — | Fullscreen mana-only tracker: 3×2 grid into `#manaBoardGrid` (`renderMana()` picks the grid by `fmt`), big untap bar, no scrolling (`body.mana-fs`) |

`PRIMARY_BOARDS = ['commander','standard','simple','multi','mana']` — interacting with one of these locks it as the active board and hides the other four (`markBoardUsed()` → `updateGameBoardButtonVisibility()`).
| `tokens` | Tokens | 20 | Token combat tracker |
| `dungeon` | Dungeon | 20 | 4 SVG dungeon maps |
| `ring` | The Ring | 20 | 4-stage emblem tracker |
| `lexicon` | Lexicon | — | MTG keyword search/reference |
| `rules` | Resources | — | App info and rules reference |

---

## Layout (3-column grid)

```
┌─────────────┬──────────────┬──────────────┐
│ Col 1       │ Col 2        │ Col 3        │
│ Life card   │ Mana Pool    │ Right Column │
│ (shrink)    │ (6 slots)    │ (format-dep) │
│             │              │              │
│ Dice card   │              │ Module rows  │
│ (flex:1)    │              │ (Poison, XP, │
│             │              │  Storm, etc) │
└─────────────┴──────────────┴──────────────┘
[Mobile board only: module row below the 3 columns]
```

There is no bottom row — the layout was intentionally condensed for tablets.

---

## Key Global State Variables (line ~1673)

These are the live, in-memory state variables for the active format:

```javascript
let fmt          // active format key: 'commander', 'standard', 'simple', etc.
let life         // current life total
let poison       // poison counters (0–10; 10 = DEAD)
let xp           // experience counters
let energy       // energy counters
let storm        // storm count
let speed        // speed (1–4; 1=grey, 2=red, 3=yellow, 4=green+glow)
let initiative   // boolean: holding initiative
let goaded       // boolean: goaded
let monarch      // boolean: is the monarch
let isDay        // boolean: day/night cycle
let manaEntries  // array of mana pool objects
let cmdDmg       // object: commander damage per opponent
let diceHist     // array: dice roll history strings
let activeModules // array of module IDs for the current format ('' = empty slot)
```

### Per-Format State Persistence (`fmtState` object, line ~1621)

When you switch formats, `saveState()` writes all live variables back to `fmtState[fmt]`, and `loadState()` reads the new format's saved state into the live variables. This is how each format preserves its own counters independently.

**Module slot counts per format (in `fmtState`):**
- `commander`: 5 slots
- `standard`: 7 slots
- `simple` / `tokens` / `dungeon` / `ring` / `lexicon` / `rules`: 5 slots each

**`resetAll()` (line ~3108) overrides slot counts:**  
`standard` is explicitly set to 7 slots. All others inherit the `defaultState()` base of 5 slots. Do **not** change `defaultState()` directly — use the per-format override pattern in `resetAll()`.

---

## Key Functions Reference

| Function | Line | Purpose |
|---|---|---|
| `saveState()` | ~1638 | Writes live variables → `fmtState[fmt]` |
| `loadState()` | ~1655 | Reads `fmtState[fmt]` → live variables |
| `setFormat(f, el)` | ~3026 | Switches format: saves old state, loads new, calls `renderAll()` + `renderModuleRow()` |
| `renderAll()` | ~3141 | Re-renders everything via `requestAnimationFrame`; calls `renderRightColumn()` and `renderModuleRow()` |
| `renderMana()` | ~1817 | Rebuilds the mana pool grid (6 slots) |
| `renderCmd()` | ~1963 | Renders commander damage rows |
| `renderRightColumn()` | ~4100 | Renders Col 3 content (commander damage card OR Day/Night+Energy, then module rows for Commander/Standard) |
| `renderModuleRow()` | ~3160 | Renders the Mobile board's bottom module row (only active when `fmt === 'simple'`) |
| `adjLife(d)` | ~1779 | Adjusts life by `d`; `adjLife(0)` forces a UI refresh |
| `adjPoison(d)` | ~1698 | Adjusts poison; updates both standard and `module-` prefixed IDs |
| `adjXp(d)` | ~1700 | Adjusts XP; updates both standard and `module-` prefixed IDs |
| `adjStorm(d)` | ~2076 | Adjusts storm count; updates both standard and `module-` prefixed IDs |
| `adjEnergy(d)` | ~1681 | Adjusts energy; updates both standard and `module-` prefixed IDs |
| `toggleInit()` | ~2051 | Toggles initiative state and UI |
| `toggleGoaded()` | ~2073 | Toggles goaded state and calls `applyGoadedUI()` |
| `toggleMonarch()` | ~2079 | Toggles monarch state and calls `applyMonarchUI()` |
| `toggleSpeed()` | ~2110 | Increments speed (1→2→3→4, wraps/stops at 4) |
| `adjSpeed(d)` | ~2111 | Adjusts speed by `d`, clamped 1–4 |
| `applyGoadedUI()` | ~3081 | Applies/removes fire border animation for Goaded |
| `applyMonarchUI()` | ~2080 | Applies/removes golden glow for Monarch |
| `applyInitUI()` | (inside toggleInit) | Applies/removes blue glow for Initiative |
| `applySpeedUI()` | ~2113 | Updates speed card color class (speed-1 through speed-4) |
| `openManaPicker(slotIdx)` | ~1918 | Opens the color picker modal for a mana pool slot |
| `addCol(c)` | ~1807 | Adds a mono-color mana entry |
| `addHybrid(c1, c2)` | ~1809 | Adds a hybrid mana entry |
| `roll(n)` | ~2142 | Rolls a d`n`, animates the d20 icon (1.5s), updates history |
| `spawnPop(anchorId, emoji, color)` | ~1685 | Creates a floating emoji pop animation anchored to an element |
| `markBoardUsed(boardName)` | ~1704 | Marks a format as "used" for activity badge display |
| `updateActivityBadges()` | ~2736 | Updates the dot badges on format buttons |
| `resetAll()` | ~3108 | Resets all format states to defaults |

---

## Module System

Modules are optional tracker cards that can be added to any format's right column (Commander/Standard) or Mobile board's bottom row. Each module has a unique `id` string.

### Available Module IDs (in `MODULE_CONFIG`, line ~1592)

| id | Label | Type | Behavior |
|---|---|---|---|
| `poison` | Poison | Counter | Tap+1, has −/↺ buttons; turns red at 10 (= DEAD) |
| `xp` | Exp | Counter | Tap+1, has −/↺ buttons |
| `storm` | Storm | Counter | Tap+1, has −/↺ buttons |
| `energy` | Energy | Counter | Tap+1, has −/↺ buttons |
| `speed` | Speed | Toggle | Tap cycles 1→2→3→4 (grey/orange/yellow/green+glow — orange is colorblind-safe); has −/↺ buttons |
| `goaded` | Goaded | Toggle | Tap to toggle; shows fire border animation when active |
| `init` | Initiative | Toggle | Tap to toggle; shows blue pulse when active |
| `monarch` | Monarch | Toggle | Tap to toggle; shows golden glow when active |
| `dayNight` | Day/Night | Toggle | Tap to toggle ☀️/🌙 |

(A `turnPhase` module existed v98–v101 and was removed in v102 — `loadState()` migrates it out of persisted `activeModules`. A module can occupy only ONE slot; `openModulePicker()` hides already-active modules and `setActiveModuleSafe()` enforces it.)

### Module Slot Behavior
- Empty slots show a "+" tile → tap to open the module picker modal
- Filled slots show the module card + an injected X button (remove)
- Remove buttons are **always injected dynamically** by `renderRightColumn()` / `renderModuleRow()`. Never hardcode remove buttons in HTML — it creates duplicates.

---

## Dual-ID Pattern (CRITICAL for Mobile Board)

Counter and toggle functions must update **two sets of DOM elements simultaneously**:

- **Standard IDs**: Used by Commander/Standard right column (e.g., `poisonBtn`, `poisonNum`, `energyCard`, `energyNum`)
- **`module-` prefixed IDs**: Used by the Mobile board's module row (e.g., `module-poison`, `module-poisonNum`, `module-energyNum`)

Every counter function (`adjPoison`, `adjXp`, `adjStorm`, `adjEnergy`, etc.) and every toggle function (`toggleInit`, `toggleGoaded`, `toggleMonarch`) queries **both** IDs and updates both. If you add a new module, it must follow this same pattern.

`spawnPop()` should prefer the `module-` prefixed element when it exists (Mobile board is active).

---

## Visual Effects Reference

| Effect | Trigger | Implementation |
|---|---|---|
| Goaded fire border | `goaded === true` | Rotating `conic-gradient` orange/red animation on card border |
| Monarch glow | `monarch === true` | Slow breathing golden box-shadow on card |
| Initiative glow | `initiative === true` | Blue pulsing box-shadow + background highlight |
| Speed glow | `speed === 4` | Green `box-shadow` animation on speed card |
| Mana spend burst | Tap filled mana slot | Fixed-position color burst div (survives DOM re-render) |
| Life decrease | `adjLife(negative)` | Red diagonal slash animation |
| Life increase | `adjLife(positive)` | Green floating `+N` heal animation |
| Commander damage | Player row | Same slash/heal effects as life |
| Poison tap | `adjPoison(+1)` | ☠️ skull floats up via `spawnPop()` |
| XP tap | `adjXp(+1)` | ✦ XP floats up (purple) via `spawnPop()` |
| Storm tap | `adjStorm(+1)` | ⚡ floats up (blue) via `spawnPop()` |
| Dice roll | `roll(n)` | d20 icon spins for 1.5s then result appears |

---

## Mana Pool

- 6 slots (`POOL_SLOTS = 6`). Grid: 2 columns × 3 rows on Commander/Standard (narrow middle column), 3 columns × 2 rows in `simple-mode`. The `minmax(0,1fr)` columns are what stop filled cards from blowing the layout out sideways.
- "Untap all" is a full-width bar (`.untap-all-bar`) below the grid, not a header button. The Turn/Phase module auto-untaps the pool when it wraps into a new turn (`advancePhase()`).
- Table board: seats are filled with mana-card visuals (`MULTI_CM=['w','u','r','g']` → `CM` colors + `pool-glow` breathing). Commander damage = always-visible chips on each seat, one per opponent, colored like the attacker's seat (tap +1, hold 500ms −1, via `adjMultiCmd(i,j,d)`, stored in `multiPlayers[i].cmd`); 21+ from one opponent marks the seat dead (`multiSeatDead()`), and damage mirrors onto the seat's life. No modal.
- Empty slot → "Tap to add mana" → opens color picker modal
- Filled slot → shows mana card with inline +/−/↺ buttons, breathing inner glow animation
- Colors: White (☀️ sun), Blue (💧 drop), Black (💀 skull), Red (⛰ peak), Green (🌿 leaf), Colorless (◆ diamond)
- Hybrid mana supported (2-color combinations)
- White and white-hybrid use **dark text** for readability (light background)
- Mana pool scope: Commander and Standard boards only; not shown in Mobile/Simple layout

---

## Theme System

- Up to 3 mana colors can be selected → recolors the entire UI via CSS custom properties
- Multi-color selections use blended colors
- Manual color selection overrides automatic theme detection

---

## State Management Rules

- **In-memory first, localStorage as crash net**: live state is `fmtState` in memory. It is
  mirrored (debounced ~500ms via `schedulePersist()` in `updateActivityBadges()`, plus
  `pagehide`/`visibilitychange`) to localStorage key `mtgPlaymatState_v1`. On load, if the
  snapshot is <12h old and has activity, a "Resume game?" modal offers restore; "Reset game"
  and "New game" clear it. If the persisted shape changes, bump the key suffix.
- `saveState()` and `loadState()` are called by `setFormat()` on every format switch
- `renderAll()` should be called after any state change that requires a UI refresh
- `resetAll()` wipes all format states to their starting defaults
- **Don't use `defaultState()` directly for per-format overrides** — put overrides in `resetAll()` after calling `defaultState()`

---

## Development Rules & Gotchas

### Before making any changes
1. **Read first, then implement.** Inspect the relevant section of `index.html` before writing code.
2. **Propose before executing.** Summarize what will change (in plain English, not code) and wait for explicit approval.
3. **Use `str_replace` edits**, not full-file rewrites. Preserve all unrelated code.

### CSS rules
- Scope all CSS changes to avoid cross-board regressions. Example: `.mat:not(.simple-mode)` scopes to Commander/Standard only.
- Make one CSS change at a time. Validate across all boards before proceeding.
- The app uses inline `<script>` and `<style>` tags throughout. Any CSP must include `'unsafe-inline'`.

### DOM rules
- Show/hide **original DOM elements directly**. Never clone them — clones break counter updates, toggle behavior, and `getElementById()` lookups.
- Remove buttons for modules are always injected dynamically. Never hardcode them in HTML.

### Shared function blast radius
- `defaultState()` is used by ALL formats in `resetAll()`. Modifying its base definition breaks every format.
- `renderAll()` triggers `renderRightColumn()` AND `renderModuleRow()`. Changes to either affect what happens on every state refresh.

### Testing
- No build step, no bundler. Open `index.html` directly in the browser to test.
- Chrome extension for browser preview has been unreliable — open the file directly.
- PWA diagnostics: Chrome/Edge DevTools → Application → Manifest

---

## Deployment Checklist

Before any deploy:

- [ ] Increment SW version in `index.html`: `./sw.js?vXX` → `./sw.js?v(XX+1)`
- [ ] Increment CACHE in `sw.js`: `'mtg-playmat-vXX'` → `'mtg-playmat-v(XX+1)'`
- [ ] Increment `APP_VERSION` in `index.html`: `const APP_VERSION='XX'` → `'XX+1'`
- [ ] All three numbers match
- [ ] Upload `index.html` AND `sw.js` in the same GitHub commit
- [ ] Verify all 5 files exist at repo root: `index.html`, `sw.js`, `manifest.json`, `icon192.png`, `icon512.png`

DNS/CDN note: Cloudflare caches `index.html` with a 2-hour TTL and assets with a 7-day TTL.
