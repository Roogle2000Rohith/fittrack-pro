# FitTrack Pro — code organization

**Deployment:** Static GitHub Pages at `/fittrack-pro/`. Script order and the public URL remain unchanged. No bundler or server is required.

## Directory structure

```text
index.html                   Small HTML shell; links app assets
assets/
  css/
    base.css                 Original foundation + structural layout
    features.css             Exercise, workout, media and anatomy components
    theme.css                Current mobile/desktop theme and last overrides
  js/
    guides.js                Textual form cues for 34 movements
    exercise-data.js         Visual mappings, muscle regions, match accuracy
    video-data.js            Exercise-video sources and training-phase videos
    app.js                   State, storage, UI rendering and event handlers
manifest.webmanifest        Install settings
sw.js                       Offline cache of local HTML/CSS/JS assets
icons/icon.svg              PWA icon
EXERCISE_VIDEO_SOURCES.md    Provenance / match review
QA_CHECKLIST.md             Device and regression tests
```

## Adding exercise video / warm-up

Edit `assets/js/video-data.js`, not `index.html`.
- `VERIFIED_PUBLIC_VIDEO_LINKS[exerciseId]` links individual exercise demonstrations.
- `FEATURED_MEDIA.warmup.push|pull|legs` are the routines shown in Video Coach before training.
- `FEATURED_MEDIA.cooldown.push|pull|legs` are the routines shown after training.
- `FEATURED_MEDIA.mobility` holds optional recovery material.
- Each video entry has `title`, `provider`, `url`, `detail`, `query`. Use specific publisher-hosted URLs, not guessed video IDs. Source pages and embed permission can change, so keep an original-source fallback.

## Adding exercise anatomy or form cues

Update `assets/js/exercise-data.js` for muscle and visual match data, and `assets/js/guides.js` for detailed setup/cues. Add or edit a movement in the user's plan through the app UI. Never label a related equipment variation as an exact demonstration.

## Saved workout data invariants

**Do not rename IndexedDB keys, change backup shape, or auto-reset local storage during updates.** The current saved state is still `fittrack-state-v1` / backup version 1. Existing workout records are saved to the browser, not GitHub.

## Deployment

`index.html` references static assets relatively with `./assets/...`. External scripts use **defer**, in dependency order:

1. `guides.js`
2. `exercise-data.js`
3. `video-data.js`
4. `app.js`

When any local asset changes, bump the cache key in `sw.js`; also keep the `CORE` list accurate. Because the PWA caches assets, advise users to reload online and restart the installed app. Avoid clearing site data (which deletes the saved workouts).

## Pending architecture improvements

`app.js` still contains several UI and storage functions in one file. A later tested refactor can split them into `storage.js`, `workouts.js`, `views.js` and `events.js` while preserving the global classic-script dependencies. Add automated full-browser integration tests and validate on mobile before production release.
