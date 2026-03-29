# MTG Playmat Universal

A single-file, zero-dependency browser-based game companion for Magic: The Gathering. Open `index.html` in any modern browser — no install, no server, no account required.

Designed for landscape use on tablets and phones, and scales cleanly on desktop. **Installable as an offline PWA (Progressive Web App)** on any device — play completely offline after the first visit.

![Features Overview](#features)

## Quick Start

1. **Online**: Visit [play-mtg.com](https://play-mtg.com) (or your GitHub Pages URL)
2. **Install as App**: 
   - **Android (Chrome/Edge)**: Tap the install banner or menu → "Add to Home Screen"
   - **iPhone/iPad (Safari)**: Tap Share → "Add to Home Screen"
   - **Desktop (Chrome/Edge)**: Click the install icon in the address bar
3. **Play Offline**: Works completely offline after first visit — no internet needed

Alternatively, download all files locally and open `index.html` in your browser.

---

## Features

### Format Modes

Switch between **8 game modes** using the buttons at the top. Each mode saves and restores its own state independently.

| Mode | Description |
|------|-------------|
| **Commander** | 40 life, commander damage tracking for up to 4 players, all counters |
| **Standard** | 20 life, Day/Night cycle toggle, Energy counter, all standard counters |
| **Mobile** | Stripped-down view — life total, dice roller, and mana pool only |
| **Tokens** | Token stack management with combat state tracking (unblocked/exhausted/blocked/killed) |
| **Dungeon** | Four fully accurate SVG dungeon maps (Mad Mage, Lost Mine, Tomb of Annihilation, Undercity) with room-by-room traversal |
| **The Ring** | Interactive Ring Tempts You emblem with 4 stages and bearer name input |
| **Lexicon** | ~188 searchable keyword entries organized by category (All, Combat, Mechanics, Casting, Resources) |
| **Rules** | Quick reference for Standard and Commander rule summaries |

**Active format buttons float to the front and display a dot badge** when they have non-default state.

---

### Life Total

- **±1 and ±5 buttons** for fast life adjustments
- **Red styling** when life drops to 5 or below
- **Visual damage animation** — red diagonal slash when taking damage
- **Visual healing animation** — green floating `+N` when gaining life

---

### Mana Pool

- **8 pool slots** supporting:
  - Mono-color mana (White, Blue, Black, Red, Green, Colorless)
  - All 10 Ravnica guild hybrid combinations
  - Custom two-color hybrid picker
- **Tap to spend** mana from any slot
- **Inline controls per slot**: `+` (add), `−` (remove), `↺` (untap)
- **Untap All button** for quick reset
- **Color-breathing glow animation** per mana color
- **White/hybrid-white cards use gold shimmer** for better readability on light backgrounds
- **Tracked counts**: Available vs. spent mana displayed on each card

#### Add Mana Panel
- Tap any empty mana slot to open the color picker
- Quick buttons for all mono-colors (W/U/B/R/G/C)
- Guild preset buttons for instant hybrid mana
- Manual two-color picker for custom hybrids
- `+` / `−` and full clear buttons

---

### Commander Damage

- **Tracks damage** from up to 4 opponents (P1, P2, P3, P4)
- **You (P1) gets special styling** and is linked to your life total
- **±1 and ±5 buttons** per opponent
- **Value turns red at 21+** to highlight lethal commander damage
- **Reset button** clears individual players

---

### Tokens Board & Combat Area

**Token stacks** use a smart model: identical tokens (same power/toughness, color, keywords, name) automatically stack into one slot with a counter (`remaining/total`).

#### Token States (4-state cycling per mini-token)
- **Unblocked** → Not yet assigned to block
- **Exhausted** → Assigned to attack (only this state counts toward combat damage)
- **Blocked** → Assigned to block
- **Killed** → Marked for removal

#### Combat Workflow
1. **Create token stack** → All tokens start unblocked
2. **During attack** → Tap tokens to cycle through states; only `exhausted` tokens count toward the Attacking Damage counter
3. **End Combat** → 
   - `Blocked` tokens convert to `exhausted` (tapped state)
   - `Killed` tokens are removed from the pool
   - Remaining tokens stay in place for the next turn
4. **State icons** → Hourglass (exhausted), medieval shield (blocked), vertical dagger (killed) with color-contrast logic adjusting stroke based on mana color

#### Features
- **Stack by type** — tokens with identical characteristics merge into one slot
- **Decrementing counter** — `remaining/total` tracks losses during combat
- **Attacking Damage counter** — auto-calculated from exhausted tokens' P/T
- **Activity badge** — gold dot on Tokens button when any tokens exist

---

### Counters (All Modes)

#### Poison Counter
- Tap to add, `−` to remove, reset button to clear
- Color shifts: yellow at 7+, red at 10+ (death state)

#### Experience (XP) Counter
- Tap to add, `−` to remove, reset button
- **Visual animation**: Purple ✦ floats up on tap

#### Storm Counter
- Tap to add, `−` to remove, reset button
- **Cloud icon** with roll history (last 3 taps)
- **Visual animation**: Blue ⚡ floats up on tap

---

### Status Toggles

#### Goaded
- **Tap to toggle** active state
- **Visual effect**: Rotating conic-gradient orange/red fire border with pulse animation when active

#### Initiative
- **Tap to toggle**, single toggle per turn
- **Visual effect**: Electric blue pulsing glow + background highlight when held

#### Monarch
- **Tap to toggle**, single toggle per turn
- **Visual effect**: Slow breathing golden glow when held
- **State label** shows current holder

---

### Day / Night (Standard Mode Only)

- **Toggle between Day and Night** with a single tap
- **Distinct visual states** (☀️ vs. 🌙) for each
- **Affects background and accent colors** — themes shift to match the active phase

---

### Energy Counter (Standard Mode Only)

- **Tap to add**, `−` to remove, reset button
- **Blue-themed counter** with lightning icon
- **Visual animation**: Floating sparkle effect on tap

---

### Dice Roller

- **d4, d6, d8, d10, d12, d20** buttons for quick rolls
- **Smooth spinning d20 animation** during the roll (1.5 second duration)
- **Pop animation** shows result instantly when roll completes
- **Roll history** displays last 3 rolls
- **d20 icon** spins during animation, result pops in after

---

### Dungeon Maps

Four fully accurate dungeons with branching paths, rendered as **interactive SVG maps**:

- **Dungeon of the Mad Mage** — 9 rooms, balanced branches
- **Lost Mine of Phandelver** — 7 rooms, early-mid game
- **Tomb of Annihilation** — 5 rooms, heavy penalties
- **Undercity** — 9 rooms, dense map with multiple paths

**Interaction**:
- **Tap rooms** to venture forward
- **Tap current room** to step back
- **Visual states**: Visited rooms, current room, and reachable rooms are all visually distinct
- **Completion banner** shown on reaching the final room
- **Room effects** clearly labeled with game actions

---

### The Ring Emblem

- **Tap each stage (I–IV)** to unlock as the Ring tempts you
- **Tap an unlocked stage** to revert to the previous level
- **Name input field** for your Ring-bearer
- **"The Ring is fully powered" banner** at stage IV
- **All 4 temptation abilities** visible and tracked with unlock state

---

### Lexicon

**~188 searchable keyword entries** organized by filter categories:

- **All** — Complete keyword list
- **Combat** — Keywords and mechanics related to combat
- **Mechanics** — Core game mechanics (keyword abilities, stack behavior, etc.)
- **Casting** — Mechanics related to casting and cost reduction
- **Resources** — Mana, life, and counter-related keywords

**Features**:
- **Text search** filters entries in real-time
- **Category buttons** for quick filtering
- **Scenario field** on each entry explains when and how the keyword is used
- **Scrollable entry list** for easy browsing

---

### Rules Reference

Quick lookup for **Standard and Commander** game rules:

- **Standard tab** — Core rules, turn structure, priority, the stack
- **Commander tab** — Format-specific rules, commander tax, commander damage, legend rule

---

### UI Theme & Deck Identity

**Pick up to 3 mana colors** from your deck's identity — the entire UI recolors to match:

- Colors blend intelligently when multiple are selected
- Custom SVG mana icons for each color (sun, water drop, skull, mountain peak, leaf, diamond)
- Dark mode adjustments for better contrast on color-shifted backgrounds
- **Breathing glow effects** on mana pool cards reflect the chosen color theme

---

## Visual Effects & Animations

| Effect | Trigger | Animation |
|--------|---------|-----------|
| **Damage** | Life total decreases | Red diagonal slash |
| **Healing** | Life total increases | Green floating `+N` |
| **Poison tap** | Poison counter tapped | ☠️ skull floats up |
| **XP tap** | Experience counter tapped | ✦ purple XP floats up |
| **Storm tap** | Storm counter tapped | ⚡ blue bolt floats up |
| **Mana spend** | Tap mana pool card | Fixed-position color burst (survives DOM re-render) |
| **Goaded** | Active state | Rotating fire-glow border with pulse |
| **Monarch** | Held state | Slow breathing golden glow |
| **Initiative** | Held state | Blue pulsing glow + background highlight |
| **Dice roll** | d20 button clicked | Spinning d20 for 1.5s, result pops in |

---

## Hosting on GitHub Pages

### Setup (5 minutes)

1. **Create a new GitHub repository** (or use an existing one)
2. **Add these 5 files** to the repository root:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`

3. **Enable GitHub Pages**:
   - Go to your repo → **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Choose **main** (or **master**) branch
   - Click **Save**

4. **Get your URL** — GitHub will show something like:
   ```
   https://yourusername.github.io/your-repo-name/
   ```

5. **Share the link** — Anyone can now install the app directly from that URL

---

## Installing as an Offline App

Once hosted, the app can be installed on **any device** and used **fully offline** — no internet connection needed after the first visit.

### Android (Chrome or Edge)

1. Open the URL in Chrome or Edge on your Android device
2. Wait for the page to load
3. Browser may show an **"Add to Home Screen"** or **"Install app"** banner at the bottom
4. If no banner appears, tap the **three-dot menu** (top-right in Chrome, bottom-right in Edge)
5. Tap **"Add to Home Screen"** or **"Install app"**
6. Tap **"Install"** on the confirmation dialog
7. App appears on your home screen and launches in **full-screen landscape mode** with no browser chrome

**After the first visit**, the app works **completely offline** — no Wi-Fi or data required.

### iPhone / iPad (Safari)

1. Open the URL in **Safari** (must be Safari — Chrome on iOS cannot install PWAs)
2. Tap the **Share button** (box with an arrow pointing up, at the bottom of the screen)
3. Scroll down and tap **"Add to Home Screen"**
4. Give it a name and tap **"Add"**
5. App appears on your home screen and launches as a **standalone app**

**Offline support** works on iOS Safari 11.3 and later.

### Desktop (Chrome or Edge)

1. Open the URL in Chrome or Edge
2. Look for the **install icon** in the address bar (a small monitor with a download arrow)
   - Or open the browser menu and look for **"Install MTG Playmat"** or **"Install app"**
3. Click **"Install"**
4. App opens in its own window with no address bar

In Edge, installed PWAs are manageable at `edge://apps`.  
Firefox does not support PWA install but the app runs fine as a regular browser tab.

---

## Running Locally (No Hosting Required)

If you just want to use it on one device without hosting:

1. **Download all 5 files** to the same folder on your device
2. **Open `index.html`** in any modern browser

**Note**: The offline PWA install requires HTTPS, so it only works when hosted (GitHub Pages provides this automatically). Running locally from a file works fine as a regular webpage but won't prompt for install.

---

## Browser Support

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome 90+ | ✅ Full | PWA install, offline cache |
| Edge 90+ | ✅ Full | PWA install, offline cache |
| Firefox 88+ | ✅ Full | App runs, no PWA install |
| Safari 15+ | ✅ Full | iOS 15+, PWA "Add to Home Screen" |
| Samsung Internet | ✅ Full | PWA install |

---

## 💝 Support This Project

If you find MTG Playmat Universal helpful, consider supporting its development:

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/imcg1122)

Or donate directly: https://ko-fi.com/imcg1122

Your support helps fund bug fixes, new features, and ongoing maintenance!

---

## Known Limitations & Future Ideas

### Current Limitations

- **No cloud sync** — State resets on browser close (by design for privacy)
- **Single-player** — Manual input only, no multiplayer or networked play
- **No OCR** — No deck scanning or automatic card lookup

### Possible Future Features

- LocalStorage option (persist state between sessions)
- Export/import game state
- Custom counter names and colors
- Sound effects toggle
- Mulligans & hand size tracker
- Draft tracker
- Deck builder integration
- Multiplayer/networked play
- Custom token artwork

---

## Technical Details

- **Single file** — all HTML, CSS, and JavaScript in one `index.html`, no external dependencies
- **No frameworks** — vanilla JS and CSS only
- **No storage** — state is in-memory per session; refreshing resets the game (by design)
- **PWA** — `manifest.json` and `sw.js` enable offline install on Android, iOS, and desktop
- **Responsive** — fluid layout from mobile landscape (~480px) through large desktop (1400px+)
  - `<480px` landscape: Aggressive compression for small phones
  - `600px+`: Standard 3-column layout
  - `1024px+`: Desktop-friendly spacing
  - `1400px+`: Luxe desktop experience
- **CSS custom properties** used throughout for theming; the color theme system rewrites them at runtime
- **Service worker** caches all assets on first load for instant offline replay

---

## License

MIT — do whatever you want with it. Fork it, modify it, host it, share it.

---

## Questions or Feedback?

Open an issue on GitHub or reach out via Ko-fi. Contributions and suggestions are welcome!

**Happy playtesting!** 🎲✨
