# FitTrack Pro — Exercise Visuals & Video Coach

A mobile-friendly, personal Push/Pull/Legs workout tracker. Includes all six PPL sessions, 34 technique guides, warm-up/cooldown and mobility links, reps/weight/RIR logging, drop sets, rest timer, and local workout history.

## Live site
After you enable GitHub Pages for `main` and `/(root)` in repository Settings → Pages:

https://roogle2000rohith.github.io/fittrack-pro/

## Exercise visuals and licensing

- **RepDB free tier**: `https://github.com/RepDB/exercise-dataset` — 34 visual matches to this routine's movements. Reference start/finish WebP images load remotely from the original repository and are **illustrations**, not actual exercise footage. All matches are not exact: incline bench, cable attachment, and machine differences are identified in exercise detail screens. Attribution: [Exercise data by RepDB (repdb.co)](https://repdb.co/). The free-tier license allows in-app use with attribution, but not redistributing the exercise dataset as a standalone dataset or claiming rights to premium animations.
- **wger**: [wger public REST API](https://wger.de/api/v2/) — public exercise info, no sign-in required for public records; per-exercise content and media licenses apply. Linked for reference, not scraped and republished.
- **hasaneyldrm/exercises-dataset**: [GIF exercise reference](https://github.com/hasaneyldrm/exercises-dataset). Its code/data can be MIT-licensed but the included Gym visual GIFs have distinct reuse restrictions. FitTrack links to the repo; it does **not** copy or rehost those GIFs.
- **Video Coach**: Links to provider-hosted videos. Playback requires internet and publisher permission for embedding. User can save their own personal technique URLs.

## Data privacy
Exercise/session history is saved on your device in browser IndexedDB, with localStorage fallback. Your personal records are **not** committed to GitHub. Use Settings → Export JSON regularly and import after changing browsers/phones. Browser cleaning can erase local data.

## Offline behavior
The tracker, text instructions, and already-loaded app shell can work offline. Remote exercise illustrations and embedded/linked videos require connectivity; an offline fallback label is shown for missing images.

## Deployment
Upload `index.html`, `sw.js`, `manifest.webmanifest`, and `icons/icon.svg` to a public GitHub repository, then enable **Settings → Pages → Deploy from a branch → main / (root)**. No backend is needed.
