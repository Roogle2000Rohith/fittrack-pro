# FitTrack Pro — Video Coach

A browser-based personal workout tracker for Push A / Pull A / Legs + Shoulders A, Push B / Pull B / Legs + Shoulders B. Includes an exercise technique guide, video references, dynamic warm-up/cooldown information, set tracking (weight/reps/RIR), rest timer, progressive overload, and export/import backups.

## Website
After enabling **Settings → Pages → Deploy from a branch → main / (root)**, the app is served at:

https://roogle2000rohith.github.io/fittrack-pro/

## Storage
Your workouts are stored locally in the browser via IndexedDB, with localStorage fallback. The GitHub repository only serves static website files; workout data is not published to GitHub. Keep JSON backups; clearing site data may erase workout history. Exercise diagrams and the UI are available offline after loading the site and installing/caching it; YouTube and other external videos need internet and publisher permission for embedding.

## App format
The source is a self-contained `index.html` (script, styles and movement illustrations embedded), plus an optional service worker, web app manifest and app icon. No backend is required. If you want to split this into multiple source files later, use the downloadable original project ZIP from ChatGPT.
