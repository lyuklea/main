# מאמן כוח אישי — Personal Strength Coach

A personal, offline-capable strength-training coaching app in Hebrew (RTL), built around a
12-week home-based beginner program (A/B superset split, bodyweight/bands/dumbbells). No backend,
no build step — plain HTML/CSS/JS with ES modules, data stored in the browser's `localStorage`.

## Features

- **Onboarding**: name, body weight, weekly frequency (2x/3x), equipment, program start date.
- **Dashboard**: current program week/phase, today's suggested workout, weekly adherence, streak.
- **Session coach**: walks you through warm-up, each exercise pair (superset method) with cues,
  target sets/reps/RIR, rest timers (with sound/vibration), and per-set logging.
- **Exercise reference**: all 12 exercises with cues and progression notes for your current phase.
- **Progress**: session history, per-exercise trend, weekly adherence, and simple double-progression
  suggestions once you're consistently hitting the top of a rep range.
- **Settings**: edit profile/equipment (toggling dumbbells/kettlebell changes which exercise variant
  is shown from week 9 onward) and reset all data.

## Running locally

No install needed — it's static files. From this directory:

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in a browser
```

Or open `index.html` directly in a browser (works fully offline once loaded; some browsers restrict
`localStorage`/modules on the `file://` scheme, so a local server is recommended).

To fast-forward through program weeks during testing, append `?debugDate=YYYY-MM-DD` to the URL.

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In the repo settings, enable **Pages** → deploy from the branch/root containing these files.
3. Visit the published URL — the app works fully offline after the first load.

## Data & privacy

All data (profile, equipment, workout history) is stored only in your browser's `localStorage` —
nothing is sent to a server. Clearing your browser data or using a different browser/device starts
fresh. Use Settings → "איפוס כל הנתונים" to wipe it intentionally.
