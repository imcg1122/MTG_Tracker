MTG Playmat Universal
A single-file, zero-dependency browser-based game companion for Magic: The Gathering. Open index.html in any modern browser — no install, no server, no account required.
Designed for landscape use on tablets and phones, and scales cleanly on desktop. Installable as an offline PWA (Progressive Web App) on any device.

Features
Format Modes
Switch between five modes using the buttons at the top. Each mode saves and restores its own state independently, so you can track a Commander game while also referencing a Dungeon without losing anything.
ModeDescriptionCommander40 life, commander damage tracking for up to 4 playersStandard20 life, Day/Night cycle toggle, Energy counterMobileStripped-down view — life total, dice, and mana pool onlyDungeonFull SVG dungeon maps with room-by-room traversalThe RingInteractive Ring Tempts You emblem with bearer name input
Active format buttons float to the front and display a dot badge when they have non-default state.

Life Total

±1 and ±5 buttons
Turns red when life drops to 5 or below
Visual damage (red slash) and healing (green +N float) animations

Mana Pool

8 pool slots supporting White, Blue, Black, Red, Green, Colorless, and Hybrid mana
Tap a pool card to spend mana, untap individually or all at once
Inline +/− buttons and untap controls per slot
Tracks available vs. spent counts with color-breathing glow effects
White and white-hybrid cards use gold shimmer for better readability

Add Mana Panel

Tap empty mana slot to open color picker
Quick mono-color buttons (W/U/B/R/G/C)
Hybrid mana via guild presets (all 10 Ravnica guilds) or manual two-color picker
+/− and full clear buttons

Commander Damage

Tracks damage from up to 4 opponents (P1, P2, P3, P4)
You (P1) gets special styling with damage link to life total
±1 and ±5 buttons per opponent
Value turns red at 21+
Reset button clears individual players

Counters (right column, all modes)

Poison — tap to add, minus and reset buttons, color shifts yellow at 7+ and red at 10+
Exp — tap to add, minus and reset buttons
Storm — tap to add, minus and reset buttons, rain cloud icon with history

Day / Night (Standard mode)

Toggle between Day and Night with a single tap
Distinct visual states (☀️ vs. 🌙) for each
Affects background and accent colors

Energy (Standard mode)

Tap to add, subtract and reset controls
Blue-themed counter with lightning icon

Status Toggles

Goaded — tap to toggle active state, rotates fire-glow border with pulse when active
Initiative — tap to toggle, electric blue pulsing glow and highlight when held
Monarch — tap to toggle, slow breathing golden glow when held

Dice Roller

d4, d6, d8, d10, d12, d20
Displays current roll with pop animation
Shows last 3 rolls in history
Smooth spinning d20 during roll (1.5s)

Dungeon Maps
Four fully accurate dungeons with branching paths rendered as interactive SVG maps:

Dungeon of the Mad Mage — 9 rooms, balanced branches
Lost Mine of Phandelver — 7 rooms, early-mid game
Tomb of Annihilation — 5 rooms, heavy penalties
Undercity — 9 rooms, dense map with multiple paths

Tap rooms to venture forward, tap again to step back. Visited rooms, current room, and reachable rooms are all visually distinct. Completion banner shown on reaching the final room. Room effects clearly labeled with game actions.
The Ring Emblem

Tap each stage (I–IV) to unlock as the Ring tempts you
Tap an unlocked stage to revert to the previous level
Name input field for your Ring-bearer
"The Ring is fully powered" banner at stage 4
All 4 temptation abilities visible and tracked

UI Theme
Pick up to 3 mana colors for your deck's identity — the entire UI recolors to match. Colors blend intelligently when multiple are selected. Includes dark mode adjustments for better contrast on color-shifted backgrounds.

Hosting on GitHub Pages

Push all files to a GitHub repository (keep them all in the same directory):

index.html
manifest.json
sw.js
icon-192.png
icon-512.png


Go to your repo → Settings → Pages
Under Source, select Deploy from a branch, choose main (or master), and click Save
GitHub will give you a URL like https://yourusername.github.io/your-repo-name/
Share that URL with friends — anyone can install it directly from there


Installing as an Offline App
Once hosted, the app can be installed on any device and used fully offline — no internet connection needed after the first visit.
Android (Chrome or Edge)

Open the URL in Chrome or Edge on your Android device
Wait for the page to load — the browser may show an "Add to Home Screen" or "Install app" banner automatically at the bottom
If no banner appears, tap the three-dot menu (top-right in Chrome, bottom-right in Edge)
Tap "Add to Home Screen" or "Install app"
Tap "Install" on the confirmation dialog
The app appears on your home screen and launches in full-screen landscape mode with no browser chrome


After the first visit, the app works completely offline — no Wi-Fi or data required.


iPhone / iPad (Safari)

Open the URL in Safari (must be Safari — Chrome on iOS cannot install PWAs)
Tap the Share button (box with an arrow pointing up, at the bottom of the screen)
Scroll down and tap "Add to Home Screen"
Give it a name and tap "Add"
The app appears on your home screen and launches as a standalone app


Offline support works on iOS Safari 11.3 and later.


Desktop (Chrome or Edge)

Open the URL in Chrome or Edge
Look for the install icon in the address bar (a small monitor with a download arrow), or open the browser menu and look for "Install MTG Playmat" or "Install app"
Click "Install"
The app opens in its own window with no address bar


In Edge, installed PWAs are manageable at edge://apps.
Firefox does not support PWA install but the app runs fine as a regular browser tab.


Running Locally (no hosting required)
If you just want to use it on one device without hosting:

Download all five files to the same folder on your device
Open index.html in any modern browser

Note: the offline PWA install requires HTTPS, so it only works when hosted (GitHub Pages provides this automatically). Running locally from a file works fine as a regular webpage but won't prompt for install.

Technical Notes

Single file — all HTML, CSS, and JavaScript in one index.html, no external dependencies
No frameworks — vanilla JS and CSS only
No storage — state is in-memory per session; refreshing resets the game (by design)
PWA — manifest.json and sw.js enable offline install on Android, iOS, and desktop
Responsive — fluid layout from mobile landscape (~480px) through large desktop (1400px+)

<480px landscape: Aggressive compression for small phones
600px+: Standard 3-column layout
1024px+: Desktop-friendly spacing
1400px+: Luxe desktop experience


CSS custom properties used throughout for theming; the color theme system rewrites them at runtime
Service worker caches all assets on first load for instant offline replay


Browser Support
BrowserStatusNotesChrome 90+✅ FullPWA install, offline cacheEdge 90+✅ FullPWA install, offline cacheFirefox 88+✅ FullApp runs, no PWA installSafari 15+✅ FulliOS 15+, PWA "Add to Home Screen"Samsung Internet✅ FullPWA install

Known Limitations & Future Ideas
Current

No cloud sync — State resets on browser close (by design for privacy)
Single-player — Manual input only, no multiplayer or networked play
No OCR — No deck scanning or automatic card lookup

Possible Future Features

LocalStorage option (persist state between sessions)
Export/import game state
Custom counter names and colors
Sound effects toggle
Mulligans & hand size tracker
Draft tracker
Deck builder integration


License
MIT — do whatever you want with it.
