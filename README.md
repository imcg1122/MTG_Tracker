# MTG Tracker

A single-file, zero-dependency browser-based game companion for Magic: The Gathering. Open `index.html` in any modern browser — no install, no server, no account required.

Designed for landscape use on tablets and phones, and scales cleanly on desktop. Installable as an offline PWA (Progressive Web App) on any device.

---

## Features

### Format Modes
Switch between five modes using the buttons at the top. Each mode saves and restores its own state independently, so you can track a Commander game while also referencing a Dungeon without losing anything.

| Mode | Description |
|------|-------------|
| **Commander** | 40 life, commander damage tracking for up to 3 opponents |
| **Standard** | 20 life, Day/Night cycle toggle, Energy counter |
| **Simple Mana** | Stripped-down view — life total, dice, and mana pool only |
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
- **Poison** — tap to add, minus and reset buttons, color shifts red as you approach 10
- **Exp** — tap to add, minus and reset buttons
- **Storm** — tap to add, minus and reset buttons, rain cloud icon

### Day / Night (Standard mode)
- Toggle between Day and Night with a single tap
- Distinct visual states for each

### Energy (Standard mode)
- Tap to add, subtract and reset controls

### Status Toggles
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

## Hosting on GitHub Pages

1. Push all files to a GitHub repository (keep them all in the same directory):
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
2. Go to your repo → **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**, choose `main` (or `master`), and click **Save**
4. GitHub will give you a URL like `https://yourusername.github.io/your-repo-name/`
5. Share that URL with friends — anyone can install it directly from there

---

## Installing as an Offline App

Once hosted, the app can be installed on any device and used fully offline — no internet connection needed after the first visit.

### Android (Chrome or Edge)

1. Open the URL in **Chrome** or **Edge** on your Android device
2. Wait for the page to load — the browser may show an **"Add to Home Screen"** or **"Install app"** banner automatically at the bottom
3. If no banner appears, tap the **three-dot menu** (top-right in Chrome, bottom-right in Edge)
4. Tap **"Add to Home Screen"** or **"Install app"**
5. Tap **"Install"** on the confirmation dialog
6. The app appears on your home screen and launches in full-screen landscape mode with no browser chrome

> After the first visit, the app works completely offline — no Wi-Fi or data required.

---

### iPhone / iPad (Safari)

1. Open the URL in **Safari** (must be Safari — Chrome on iOS cannot install PWAs)
2. Tap the **Share button** (box with an arrow pointing up, at the bottom of the screen)
3. Scroll down and tap **"Add to Home Screen"**
4. Give it a name and tap **"Add"**
5. The app appears on your home screen and launches as a standalone app

> Offline support works on iOS Safari 11.3 and later.

---

### Desktop (Chrome or Edge)

1. Open the URL in **Chrome** or **Edge**
2. Look for the **install icon** in the address bar (a small monitor with a download arrow), or open the browser menu and look for **"Install MTG Playmat"** or **"Install app"**
3. Click **"Install"**
4. The app opens in its own window with no address bar

> In Edge, installed PWAs are manageable at `edge://apps`.  
> Firefox does not support PWA install but the app runs fine as a regular browser tab.

---

## Running Locally (no hosting required)

If you just want to use it on one device without hosting:

1. Download all five files to the same folder on your device
2. Open `index.html` in any modern browser

Note: the offline PWA install requires HTTPS, so it only works when hosted (GitHub Pages provides this automatically). Running locally from a file works fine as a regular webpage but won't prompt for install.

---

## Technical Notes

- **Single file** — all HTML, CSS, and JavaScript in one `index.html`, no external dependencies
- **No frameworks** — vanilla JS and CSS only
- **No storage** — state is in-memory per session; refreshing resets the game (by design)
- **PWA** — `manifest.json` and `sw.js` enable offline install on Android, iOS, and desktop
- **Responsive** — fluid layout from mobile landscape (~600px) through large desktop (1400px+)
- CSS custom properties used throughout for theming; the color theme system rewrites them at runtime

---

## License

MIT — do whatever you want with it.
