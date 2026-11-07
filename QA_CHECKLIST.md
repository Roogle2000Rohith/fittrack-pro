# Modular release smoke tests — v17

- [ ] Load GitHub Pages and verify browser Network tab: base.css, features.css, theme.css, guides.js, exercise-data.js, video-data.js, app.js all return HTTP 200
- [ ] Open Video Coach → Warm-up → Push: E3 Rehab video card has **Watch original** and **Play in FitTrack**
- [ ] Warm-up → Pull: E3 Rehab and warm-up education video are visible
- [ ] Warm-up → Legs + Shoulders: Squat University video is visible
- [ ] Cool-down → Push/Pull: Tom Peto upper-body cooldown video is visible
- [ ] Cool-down → Legs + Shoulders: Tom Peto lower-body cooldown video is visible
- [ ] Mobility: actual video links appear, not only search fields
- [ ] Open an original video if YouTube blocks embedding: original link must remain visible
- [ ] Resume an unfinished workout, log a set, refresh and verify local data was preserved
- [ ] Installed PWA works after the v17 cache update and loads core UI offline
- [ ] Verify no login or storage reset is required after splitting code files

---
# FitTrack release checks — v14

Check on Android Chrome, iOS Safari and desktop Chrome/Edge, including 320px, 360px, 390px and 1280px widths.

## Exercises, library and anatomy
- [ ] All filter shows 34 exercises
- [ ] Chest filter shows 4 exercises
- [ ] Legs includes Quads, Hamstrings, Glutes, Calves, Adductors
- [ ] Arms includes Triceps, Biceps, Forearms
- [ ] Core shows 4 exercises
- [ ] Search within Chest returns only matching chest exercises
- [ ] Search within Chest for "hack squat" returns no results
- [ ] Every guide displays front/back primary/supporting muscle diagrams
- [ ] Incline cable press anatomy shows Upper chest; related movement image labelled SIMILAR
- [ ] Rear delts and quads highlight back and front regions respectively
- [ ] Start/finish remote illustrations display online, clear fallback offline
- [ ] No anatomy media is portrayed as measured EMG or clinical diagnosis

## Video references
- [ ] Clicking video search goes to YouTube (trusted educator terms)
- [ ] Wikimedia Commons and Vimeo search links are available
- [ ] No video suggests the removed Vimeo ID 962614569
- [ ] 22 source-reviewed video URLs from checked publishers are mapped to the correct exercise, including 3 Commons HTML5 videos and an incline cable YouTube demo
- [ ] EZ-bar curl has original Wikimedia source page and attribution
- [ ] Save a YouTube link and open original; optional embedded player
- [ ] Save a working Vimeo page and open original; optional player
- [ ] Save a Wikimedia or publisher HTTPS page and open original
- [ ] Broken saved link can be removed, returning to search fallback
- [ ] Player handles blocked embedding with clear original link
- [ ] Video search/source link can be reached using keyboard

## Workout and history
- [ ] Begin Push A, enter weights/reps and log set
- [ ] Reload while workout active; sets remain saved
- [ ] Rest timer survives reload; can extend and skip
- [ ] Finish a session then view it in history/progress
- [ ] Copy last session's set and check correct values
- [ ] Switch units kg/lb; stored weights unchanged
- [ ] Optional energy/soreness recorded with session
- [ ] Export JSON, import into a second browser profile and verify history
- [ ] CSV export opens in spreadsheets without formula injection
- [ ] Backups remain compatible with `version: 1`

## Responsive and accessibility
- [ ] Bottom navigation contains Home, Workout, Plan, Exercises, Videos, Progress
- [ ] All six mobile navigation options visible and usable at 320px
- [ ] Muscle filter chips scroll horizontally on small phones
- [ ] Set inputs remain readable without accidental clipping/overlap
- [ ] Large text and high contrast persist after reload
- [ ] Reduced-motion behavior follows OS settings
- [ ] App shell works offline after initial install; videos need internet
- [ ] Installed PWA refreshes to v14 after new service worker activation

## Release caveat
Production/public release should additionally undergo browser end-to-end tests, license/content audit, reliability testing of external image/video sources, accessibility review, and security/privacy review.
