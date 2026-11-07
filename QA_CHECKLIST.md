# FitTrack Pro · Browser QA Checklist

Run on **Android Chrome, iOS Safari, Windows Chrome/Edge** at 360px, 390px and 1280px layouts. Record actual device, browser version, and date for each run.

## Content & navigation
- [ ] Six workouts visible (Push A/B; Pull A/B; Legs + Shoulders A/B)
- [ ] Plan cards show full exercise names with readable lines and no overlap
- [ ] **Watch demo** opens YouTube/Vimeo video or targeted search in a new tab
- [ ] **Form & tips** opens the selected exercise (not adjacent exercise)
- [ ] Tapping exercise thumbnail also opens its guide
- [ ] Related/mismatched images carry **SIMILAR** label; full guide hides until user opts in
- [ ] Test incline cable press (related image + exact video), chest-press machine, hack squat, hip thrust machine
- [ ] Verify original video can play; test fallback when YouTube embedding is blocked
- [ ] Warmup, cooldown and Sunday mobility tabs work

## Workout logging and data
- [ ] Start Push A; change weight and reps; log a set and see completed indicator
- [ ] Reload page; confirm the active workout, sets, and timer remain
- [ ] **Copy previous set** populates weight/reps/RIR from a previous completed session (test after completing one)
- [ ] Check kg/lb: 20 kg displays about 44.1 lb; switching back restores 20 kg without rewriting history
- [ ] Add warm-up/working/drop sets; mark incomplete; remove last set (with confirmation)
- [ ] Finish a partially completed session; review saved history with correct date
- [ ] Check personal best label only after completing a working set with weight greater than zero
- [ ] Energy/soreness selections survive refresh and completion
- [ ] Export JSON backup, open it, then import in a separate browser profile to verify restored history
- [ ] Export CSV, verify heading row and correct completed set values
- [ ] Delete a session or reset data ONLY after making a backup

## Mobile/accessibility
- [ ] 320px, 360px, 390px layouts: no clipped controls or important hidden actions
- [ ] Set inputs are sufficiently large, usable without unwanted iOS zoom
- [ ] Keyboard Tab can reach Watch demo, form guide and set controls; focus visible
- [ ] Large Text and High Contrast settings work and persist after refresh
- [ ] Reduced-motion preference disables unnecessary motion
- [ ] Offline mode: app shell and previously saved training data accessible; media shows clear fallback
- [ ] On install: home-screen icon, standalone opening, settings and service-worker update behave correctly

## Known constraints
- Video playback depends on original publisher and browser rules.
- Remote illustrations do not work offline.
- Public static hosting has no account-based sync; workout history is private to a browser origin.
- A similar equipment setup is not a verified demonstration of the exact exercise.
