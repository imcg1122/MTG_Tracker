# Codebase Modernization Spec — Module Split with Single-File Output

**Status:** Ready to execute. Written to be handed to any capable model (or done by hand) as a
self-contained work order. Do this AFTER v98 is deployed and stable — it churns every line of
the app, so it needs a calm baseline.

## Goal

Develop in ~15 focused ES modules; still ship the exact same artifact we ship today — **one
self-contained `index.html`** with zero runtime dependencies, working offline. Nothing about
deployment or the PWA changes.

## Tooling

- Node 22+, Vite 5+, `vite-plugin-singlefile` (inlines all JS/CSS into one HTML at build).
- `npm create vite@latest` — vanilla template, no framework. **Do not add React/Vue/etc.**
- Dev loop: `vite dev` (instant HMR). Release: `vite build` → `dist/index.html`, copy to `Prod/`.
- Add `vitest` for unit tests and `@playwright/test` for one smoke suite.

## Target structure

```
src/
  main.js               entry: imports everything, runs init (the code currently at the
                        bottom of the <script> block: buildManaGrid, renderAll, a11yInit,
                        tryOfferResume, SW registration)
  styles.css            entire current <style> block, verbatim
  state.js              fmtState, FORMATS, live vars, saveState/loadState, persistence
                        (schedulePersist/persistNow/tryOfferResume/accept/declineResume)
  util.js               sanitizeHTML, h2r/r2h/blendHex/hexToGlow/darken/ha, eKey,
                        fmtLogTime, fmtElapsed, spawnPop, closeOutside
  data/lexicon.js       LEXICON array (export const)   ← plain data, no logic
  data/dungeons.js      DUNGEONS
  data/rules.js         RULES_CONTENT
  data/constants.js     ICONS, CM, MANA_KEYS, GUILDS, POOL_SLOTS, MODULE_CONFIG,
                        KEYWORD_DATA, PHASES, MULTI_COLORS, PRIMARY_BOARDS
  boards/life.js        adjLife, life log/undo, deferredAdjLife
  boards/mana.js        renderMana, add/remove Col/Hybrid/AllColors, mana picker
  boards/commander.js   renderCmd, adjCmd, resetCmd, player name modal
  boards/tokens.js      token pool + combat area (largest board; keep together)
  boards/dungeon.js     renderDungeon, ventureRoom, resetDungeon, wrapText
  boards/ring.js        renderRing, temptRing, resetRing
  boards/lexicon.js     renderLexicon, filters, detail pane
  boards/multi.js       Table board (renderMulti, adjMultiLife, setMultiCount…)
  modules/trackers.js   poison/xp/storm/energy/speed/goaded/init/monarch/dayNight/
                        turnPhase + module row + right column + module picker
  features/dice.js      roll, first-player randomizer
  features/theme.js     theme grid, applyTheme/resetTheme, sv/updateDots
  features/wakelock.js  requestWakeLock + listeners
```

## Execution order (each step must leave the app working)

1. **Scaffold** Vite project at repo root (`src/`, `vite.config.js` with `singlefile` plugin,
   `outDir: 'dist'`). Point `index.html` (Vite root copy) at `src/main.js`. Keep `Prod/` as the
   deploy folder — CI later builds `dist/index.html` → `Prod/index.html`.
2. **Move CSS** verbatim into `src/styles.css`; import from `main.js`. Verify visual parity.
3. **Extract data files first** (`data/*`) — zero logic, lowest risk, cuts the main file in half.
4. **Extract `util.js` + `state.js`.** Everything imports state via functions, not globals.
5. **Boards one at a time**, testing after each: dungeon → ring → lexicon → multi → dice/theme →
   commander → mana → trackers → tokens (last; most entangled with trackers via combatArea).
6. **Inline handlers → listeners.** As each file is extracted, replace `onclick="fn()"` with
   `data-action` attributes + one delegated listener (module scope kills `window.fn` references —
   this step is forced by the migration, which is why CSP tightening belongs here).
7. **Tighten CSP**: once no inline handlers remain, drop `'unsafe-inline'` from `script-src`
   (Vite singlefile emits one inline `<script>`; allow it with a hash, which the plugin supports).
8. **Tests**: Vitest units for mana pool math, token combat resolution (including the
   re-indexing cases fixed in v98 — see `endCombatPhase`), save/load round-trip, life log
   merge/undo. Playwright smoke: load, click every format button, tap every counter once,
   assert no console errors.
9. **CI**: extend `.github/workflows/deploy.yml` with a build step (`npm ci && npm run build`,
   copy `dist/index.html` into the site assembly) and run tests before deploy.

## Invariants that must not break

- **Single-file output**, no runtime network dependencies, PWA installable, works offline.
- The **three version references** stay in sync (`npm run bump` handles it).
- **Dual-ID pattern**: every tracker updates both plain and `module-` prefixed elements.
- **Never clone DOM nodes** for module slots — move originals (clones break getElementById).
- Remove buttons for modules are injected dynamically, never hardcoded.
- `defaultState()` in resetAll stays base-20-life; per-format overrides live in resetAll.
- State persistence key `mtgPlaymatState_v1` — bump the suffix if the shape changes, and
  handle old shapes by discarding (never crash on stale storage).

## Definition of done

`vite build` output deployed to the dev URL (`play-mtg.com/dev/`) is indistinguishable from
prod in a side-by-side test of all nine boards, offline mode included, and all tests pass in CI.
