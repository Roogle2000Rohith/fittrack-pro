# FitTrack Pro — Muscle Anatomy & Video Coach

Mobile-first workout tracker for a six-day PPL split: Push A/B, Pull A/B, and Legs + Shoulders A/B. **No backend, account, or server-side workout database.**

## Website

GitHub Pages (if enabled): https://roogle2000rohith.github.io/fittrack-pro/

## Current features

- Exercise Library **All · Chest · Back · Legs · Shoulders · Arms · Core**. Filters and search work together. 34 programmed exercises, custom plan editing.
- Every programmed exercise includes a **front/back schematic muscle anatomy map**, purple primary and orange supporting regions. Anatomical labeling is educational, not an individual EMG measurement or guarantee that every muscle works equally.
- Technique: setup, key points, common mistakes, lower-back considerations for relevant lifts, and actual/reference equipment notes.
- Exercise illustrations by [RepDB](https://repdb.co/) (source images served from their repo). Similar equipment illustrations are **labelled SIMILAR** and hidden by default in detailed guides until the user opts in. Photos/illustrations need connectivity.
- Video Coach offers **YouTube, Vimeo and Wikimedia Commons** searches and editable personal HTTPS reference links. Video links are **not** downloaded or rehosted; an in-app player is offered only when supported. Embed/playback availability is controlled by the publisher.
- **Broken Vimeo 962614569 link is blocked** and no longer used.
- There are no blanket “verified” preset YouTube/Vimeo URLs. One source-checked demonstration is included for **EZ-bar curls**: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Video_of_EZ_Bar_Curl_and_Straight_Bar_Curl.webm) by Colossus Fitness, CC BY 3.0. This is a comparison tutorial, not a promise that the original publisher's site will stay accessible forever.
- Workout logging: weights, reps, RIR, drop/warmup/working sets, one-tap previous-set copy, rest timer that survives refresh, autosave and resume.
- Progress/history: weekly consistency, simplified set volume, estimated strength trends, personal best logged load and session notes. Optional energy/soreness check-in.
- Phone-friendly set cards, six-tab mobile navigation (Home, Workout, Plan, Exercises, Videos, Progress), desktop navigation, modern purple interface.
- kg/lb display, larger text/high contrast options, reduced-motion support.
- Local IndexedDB with localStorage fallback; JSON backup and restore; CSV export of completed workouts.

## Licensing and attributions

1. **RepDB images**: [Exercise data by RepDB (repdb.co)](https://repdb.co/) with attribution required for free-tier assets; inspect the repository licence for redistribution restrictions. Images are linked from their original source and **not** redistributed as a separate image dataset.
2. **wger**: [wger REST API](https://wger.de/api/v2/) provides exercise/muscle metadata; wger software is AGPL and initial exercise data CC BY-SA 3.0. Media can have its own terms. The exercise anatomy here is currently drawn locally in FitTrack rather than remotely fetched from wger.
3. **hasaneyldrm/exercises-dataset**: [source](https://github.com/hasaneyldrm/exercises-dataset). Gym visual GIFs have separate reuse rights and are **not** bundled with this app.
4. **Wikimedia Commons curl video**: “Video of EZ Bar Curl and Straight Bar Curl.webm”, creator Colossus Fitness, CC BY 3.0. Linked to original page; not copied into the project.
5. **Anatomy artwork**: Simplified original SVG regions included in FitTrack; intended as exercise target visualization, not a clinical anatomy diagram.

## Storage and privacy

Training history and plan edits live only in the browser for this origin. They are not published to GitHub. Switching browsers, clearing browsing data, reinstalling the device, or moving phones can lose logs. **Export JSON regularly** and import on a new device.

## Offline details

App shell, written guidance, locally stored workouts and anatomy SVGs work offline after the service worker has installed successfully. External image URLs and provider videos/searches require internet.

## Release QA

JavaScript syntax, content mappings, filter logic, backup schema and video URL handling can be tested automatically. Real phones and browsers still need manual testing for touch behavior, page loading, PWA updates and provider playback. Review [QA_CHECKLIST.md](QA_CHECKLIST.md).

## Deployment

Static files on `main` branch. Go to **Settings → Pages → Deploy from a branch → main / (root)**. Installed PWA users should refresh online and reopen the app after publishing. Browser service workers can take a refresh/restart to activate. **Back up workouts before destructive testing**.
