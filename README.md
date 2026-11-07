# FitTrack Pro — Mobile PPL Workout Tracker

A personal mobile-first gym tracker for a six-day **Push / Pull / Legs + Shoulders A/B** routine, including workout logging, muscle anatomy, form guides and video demonstrations.

**Website (if GitHub Pages is enabled):** https://roogle2000rohith.github.io/fittrack-pro/

## Exercise videos — v15

**22 of 34 distinct programmed exercises have individually matched direct video sources.** Each exercise opens an **Exercise video demonstrations** panel with the full source link, provider, and an **EXACT / RELATED VARIATION** match label.

- **3 Wikimedia Commons streams** play directly in the exercise guide using the phone browser's HTML5 video player (neutral-grip chest press related machine video; EZ-bar curl exact demo; 45-degree leg press exact demo). Player streams remotely from Wikimedia; not rehosted in this repository. If playback fails, the original Commons page link remains available.
- **1 specific YouTube tutorial** for incline cable chest press, from OriGym. The user can open the original YouTube video or choose the official YouTube-nocookie embedded player. Watch the original if the publisher or browser blocks embeds.
- **18 individually matched exercise video-guide pages** at [Muscle & Strength](https://www.muscleandstrength.com/exercises/), linked from the exact exercise. The video plays on the **publisher's website**, not inside FitTrack; we do not copy or rehost those videos. Grip / equipment variations are labelled RELATED.
- **12 without a reviewed source** continue to show a clear “Find demo” search option rather than a fake or incorrect video. These will be filled only when an exact video has been checked.

A video *page* may be reachable while its embedded video player is blocked in some countries or browsers. Video availability depends on third-party publishers and internet connectivity. The known broken `vimeo.com/962614569` URL is blocked.

The previous static “preset video” list was intentionally removed after a broken Vimeo link was discovered; this release restores reviewed sources selectively and makes their playback types explicit.

## Full app features

- Six-day PPL split; shoulders are trained on Legs + Shoulders days, not Push days.
- Exercise Library with working filters: All / Chest / Back / Legs / Shoulders / Arms / Core and search.
- 34 exercise anatomy cards: front/back SVGs with primary vs supporting muscles, technique cues and common mistakes.
- Exercise images by [RepDB](https://repdb.co/), with attribution and RELATED labels when exact equipment illustrations are unavailable.
- Set-by-set logging of weight, reps, RIR, working/warm-up/drop sets, rest countdown, previous-set quick copy and resume.
- Session readiness notes (energy, soreness), weekly consistency and progress charts, best logged working load and training volume.
- Dark-purple responsive layouts, six-tab mobile navigation and keyboard focus styles, large-text and high-contrast options.
- IndexedDB browser storage with localStorage fallback; JSON export/restore and workout CSV export.

## Media provenance and permission

- **OriGym YouTube incline cable press tutorial**: `https://www.youtube.com/watch?v=chvZZIWje0M`; original publisher video player.
- **Muscle & Strength exercise guides**: original video-guide pages only; videos remain the publisher's own content.
- **Wikimedia Commons**: CC BY 3.0 for Colossus Fitness EZ-bar curl and FitnessScape leg press; U.S. public domain for CDC machine chest press. Source and license appear in-app. Commons media is streamed from Wikimedia, not redistributed by FitTrack.
- **RepDB free tier**: Exercise data and illustrations by [RepDB (repdb.co)](https://repdb.co/); attribution included. Other media rights may differ and are not implied by software licenses.
- **wger**: [REST API](https://wger.de/api/v2/) as external informational reference. Software being open source does not automatically license every contributed media file.
- **User-selected URLs**: Stored as personal references. YouTube, Vimeo, Wikimedia and other HTTPS publishers can be opened in their original websites, with in-app playback attempted only when supported.

See [EXERCISE_VIDEO_SOURCES.md](EXERCISE_VIDEO_SOURCES.md) for the full per-exercise sources and classifications.

## Storage and privacy

Plans, logs, personal video URLs and preferences save **locally** in your phone's browser; your workout history is not uploaded into GitHub. Clearing site data or changing browsers can lose records. **Export JSON backups regularly**, particularly before a big update.

## Offline mode

The app shell, muscle diagrams, form instructions and browser-stored logs can work offline after the PWA is installed. Remote exercise images and videos need internet. Service-worker cache version: `fittrack-video-coach-v15`.

## Publishing and QA

Serve `index.html`, `sw.js`, `manifest.webmanifest` and `icons/icon.svg` from **GitHub Pages → main → /(root)**. After publishing, refresh the website online and reopen any installed PWA to receive updated app-shell assets. See [QA_CHECKLIST.md](QA_CHECKLIST.md) for real phone/browser tests.

**Limitations:** Source-level automated checks passed for the video mappings and app logic, but third-party playback on each real mobile browser and every external URL has not been end-to-end tested. Verify on your own phone before relying on this for general public production.


## Maintainable source layout (v17)

The single-file app is now organized into separate HTML, CSS, training-data and JavaScript files. Update `assets/js/video-data.js` for warm-up/cool-down and exercise video references; update `assets/js/exercise-data.js` for anatomy/illustrations; `assets/js/guides.js` for coaching cues; and `assets/js/app.js` for application behavior. See [ARCHITECTURE.md](ARCHITECTURE.md). Default phase video cards use verified YouTube video pages by E3 Rehab, Renaissance Periodization, Squat University and Tom Peto Training with direct source buttons and optional embeds. Media still requires internet and publisher permission.
