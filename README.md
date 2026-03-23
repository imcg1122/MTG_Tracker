# MTG Tracker

A single-file, zero-dependency browser-based game companion for Magic: The Gathering. Open `index.html` in any modern browser — no install, no server, no account required.

Designed for landscape use on tablets and phones, and scales cleanly on desktop.

---

## Features

### Format Modes
Switch between five modes using the buttons at the top. Each mode saves and restores its own state independently, so you can track a Commander game while also referencing a Dungeon without losing anything.

| Mode | Description |
|------|-------------|
| **Commander** | 40 life, commander damage tracking for up to 3 opponents |
| **Standard** | 20 life, Day/Night cycle toggle, Energy counter |
| **Simple Mana** | Stripped-down view — life total and mana pool only |
| **Dungeon** | Full SVG dungeon maps with room-by-room traversal |
| **The Ring** | Interactive Ring Tempts You emblem with bearer name input |

Active format buttons float to the front and display a dot badge when they have non-default state.

---

### Life Total
- ±1 and ±5 buttons
- Turns red when life drops to 5 or below

### Mana Pool
- 8 pool slots supporting White, Blue, Black, Red, Green, Colorless, and Hybrid mana
- Tap a pool card to spend mana, untap individually or all at once
- Tracks available vs. spent counts

### Add Mana Panel
- + and − buttons for each color
- Hybrid mana via guild presets (all 10 Ravnica guilds) or manual two-color picker

### Commander Damage
- Tracks damage from up to 3 opponents (P2, P3, P4)
- ±1 and ±5 buttons per opponent
- Value turns red at 21+

### Counters (right column)
- **Poison** — tap to add, reset button, color shifts red as you approach 10
- **Exp** — tap to add, minus and reset buttons
- **Storm** — tap to add, minus and reset buttons, rain cloud icon

### Day / Night (Standard mode)
- Toggle between Day and Night with a single tap
- Distinct visual states for each

### Energy (Standard mode)
- Tap to add, subtract and reset controls

### Status Toggles (bottom-left)
- **Goaded** — tap to toggle active state, lights up orange when active
- **Initiative** — tap to toggle, lights up gold when held
- **Monarch** — tap to toggle, lights up gold when held

### Dice Roller
- d4, d6, d8, d10, d12, d20
- Displays current roll with pop animation
- Shows last 3 rolls in history

### Dungeon Maps
Four fully accurate dungeons with branching paths rendered as interactive SVG maps:
- Dungeon of the Mad Mage
- Lost Mine of Phandelver
- Tomb of Annihilation
- Undercity

Tap rooms to venture forward, tap again to step back. Visited rooms, current room, and reachable rooms are all visually distinct. Completion banner shown on reaching the final room.

### The Ring Emblem
- Tap each stage to unlock as the Ring tempts you
- Tap an unlocked stage to revert
- Name input for your Ring-bearer
- "The Ring is fully powered" banner at stage 4

### UI Theme
Pick up to 3 mana colors for your deck's identity — the entire UI recolors to match. Colors blend when multiple are selected.

---

## Usage

1. Download `index.html`
2. Open it in any modern browser
3. No internet connection required after download

Works best in landscape orientation on phones and tablets. On narrow portrait phones, a rotate prompt is shown.

### Mobile / PWA
The file includes Apple PWA meta tags. On iOS, use **Share → Add to Home Screen** to run it as a standalone app with no browser chrome.

---

## Technical Notes

- **Single file** — all HTML, CSS, and JavaScript in one `index.html`, no external dependencies
- **No frameworks** — vanilla JS and CSS only
- **No storage** — state is in-memory per session; refreshing resets the game (by design)
- **Responsive** — fluid layout from mobile landscape (~600px) through large desktop (1400px+)
- CSS custom properties used throughout for theming; the color theme system rewrites them at runtime

---

## License

MIT — do whatever you want with it.
