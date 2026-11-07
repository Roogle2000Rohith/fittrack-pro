# FitTrack Pro · Mobile-first Workout & Video Coach

A browser-based six-day **Push / Pull / Legs + Shoulders** tracker designed for quick gym logging on mobile and comfortable editing and analysis on desktop.

**App URL (once GitHub Pages is enabled):** https://roogle2000rohith.github.io/fittrack-pro/

## What's included in this release
- Six-day customized PPL A/B template, including leg machines and shoulders on leg days
- Plan editor: adjust exercise order, sets, rep range, rest times, optional exercises
- 34 exercise technique guides with setup cues, mistakes and movement illustrations
- **Exercise media quality labels:** 13 different-machine / movement variations require explicit opt-in before showing related images in the full guide. Plan thumbnails visibly say SIMILAR.
- **Video Coach:** tappable video thumbnails; large **Watch demo / Find video** buttons open the original publisher. The optional embedded YouTube/Vimeo player may be blocked by the publisher or browser.
- Warm-up, cooldown and Sunday mobility checklists with video references
- Workout set logger: weight, reps, RIR, warm-up/working/drop sets, prior-set one-tap copy
- Phone-friendly set cards, rest timer that survives reload, autosaved active sessions
- Strength trend, workout history, weekly muscle-focus sets and personal-best *logged load*
- Optional energy/soreness session check-in
- Weight units kg/lb, larger-text mode, high-contrast mode, reduced-motion support
- Private local storage and JSON backup/import; CSV export of completed workout sets

## Mobile installation
1. In the repository open **Settings → Pages → Deploy from a branch**.
2. Choose `main` and `/(root)`, then save.
3. On Android Chrome open https://roogle2000rohith.github.io/fittrack-pro/ and choose **Install app** or **Add to Home screen** when offered.
4. Open **Settings → Export JSON backup** periodically.

## Exercise-media attribution and permissions
- **RepDB free tier**: [Exercise data by RepDB (repdb.co)](https://repdb.co/), [repository](https://github.com/RepDB/exercise-dataset). Start/finish WebP illustrations load from the original repository, with source credit in the exercise guide. The free-tier license permits attributed in-app use but **not** redistribution as a standalone dataset. Some illustrations show *related* machines, and are explicitly labelled.
- **wger**: [REST API](https://wger.de/api/v2/). Available as an external reference; no automatic importing of unreviewed third-party images. The software being open source does **not** automatically make every exercise photograph unrestricted.
- **hasaneyldrm/exercises-dataset**: [Exercise dataset GitHub](https://github.com/hasaneyldrm/exercises-dataset). The images/GIFs are © Gym visual with separate rights, **not** covered by the repository's MIT code license. This app does **not** copy those GIFs.
- **Videos**: Use provider-hosted links and their official players; no copied/rehosted video files. Links and embed permissions can change.

## Data and privacy
Workout plans, session notes, sets, preferences and logs are saved **on the current device/browser** in IndexedDB, with localStorage fallback. Personal workout data is not committed to the public GitHub repository. There is no cloud sync. Browser data clearing or switching devices may erase local history. JSON backups are strongly recommended.

## Offline behavior
After initial online load, the app shell, local logs and written cues can work offline through the service worker. External illustrations, video thumbnails and online videos need internet. Do not rely on YouTube/Vimeo as offline demonstrations.

## Deployment and testing
The app uses inline JavaScript/CSS in `index.html`, plus `sw.js`, a web manifest and icon. No backend is required. See [QA_CHECKLIST.md](QA_CHECKLIST.md) for mobile/desktop acceptance testing. This is an actively developed personal tracker; a wider public release should also undergo multi-device end-to-end QA, accessibility review, content/video audits and privacy/security review.

If changes don't appear on an already installed app, refresh online and close/reopen it; installed service-worker caches update during deployment. Always export a backup before destructive operations.
