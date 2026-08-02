# CLAUDE.md — Project context for Claude Code

## What this is
A personal productivity site for Kai: a **daily timetable** + a **SOC-analyst
career roadmap**. Static HTML/CSS/JS, no build step. Data syncs across devices
via **Firebase** (Google sign-in + Firestore). Hosted free on **GitHub Pages**.

**Live:** https://te1k41.github.io/kai-schedule/
**Repo:** https://github.com/Te1k41/kai-schedule (public — required for free Pages)
**Status:** deployed and working on desktop + mobile.

## Who it's for (keep in mind when helping)
- Kai — university student in Ho Chi Minh City, works an 8–5 WFH desk job, studying alongside.
- Goal: become employable in cybersecurity as fast as possible (targeting SOC Analyst).
- **Has ADHD.** Work in small concrete steps, lead with the single next action,
  prefer checklists over long prose, keep instructions short, don't dump big
  multi-step walls of text.
- Prefers doing things in the terminal / code editor where possible.

## File structure
```
kai-schedule/
├── index.html        # landing page, links to the two tools
├── schedule.html     # daily timetable (live "what should I be doing now" card)
├── roadmap.html      # SOC analyst roadmap (35 tasks, 5 phases, progress bar)
├── firebase-init.js  # shared: auth + Firestore load/save helpers
├── README.md         # full first-time setup instructions
└── CLAUDE.md         # this file
```

## How it works
- `firebase-init.js` exports `signIn`, `signOutUser`, `watchAuth`, `loadData(key)`,
  `saveData(key, value)`. Both pages import from it as an ES module.
- Each page shows a **sign-in gate**; after Google sign-in, `watchAuth` reveals
  the app and loads that user's data.
- Data is stored per-user at Firestore path `users/{uid}/data/{key}`.
  - schedule key: `schedule-today` → `{ date, checked }` (resets when the date changes)
  - roadmap key: `soc-roadmap-progress` → `{ taskId: true, ... }`
- Editable content lives as plain JS arrays near the top of each page's
  `<script>`: `weekdayTemplate()` / `WORKOUTS` in schedule.html, `PHASES` in roadmap.html.

## Firebase (already configured)
- Project id: `kai-schedule-731c0`
- Config is filled into `firebase-init.js` (Firebase config values are NOT secrets;
  security comes from Firestore rules, not from hiding the key).
- **Enabled:** Google sign-in provider; Cloud Firestore (production mode).
- **Authorized domain added:** `te1k41.github.io`
- **Firestore rules** (locks all data to its owner):
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId}/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
  ```

## Run / edit / deploy
- **Local preview:** `python3 -m http.server 8000` in the repo, open
  http://localhost:8000 (ES modules won't load over `file://`, so don't just
  double-click the html).
- **Deploy:** edit → `git add . && git commit -m "..." && git push`. GitHub
  Pages rebuilds in ~1 min. Hard-refresh (Ctrl+Shift+R) to beat browser cache.

## Known loose end
Sign-in currently uses **popup** (`signInWithPopup`). A browser extension on
Kai's desktop (`force-tab-links.js`) intercepts popups and can break sign-in in
normal (non-incognito) mode. It's working for now. Permanent fix if it ever
nags: switch to redirect —
- import `signInWithRedirect` instead of `signInWithPopup`
- `signIn()` returns `signInWithRedirect(auth, provider)`
Redirect is also more reliable on some mobile browsers.

## The actual plans (content reference)

### Weekday timetable (Mon–Fri; weekends intentionally open)
Wake 6:30 → 06:30 workout, 07:10 shower, 07:35 breakfast, 08:00–12:00 work,
12:00 lunch, 12:30 light review, 13:00–17:00 work, 17:00 decompress,
17:30–19:00 deep study (Security+), 19:00 dinner, 19:45 hands-on labs,
20:30 free time, 21:30 wind-down, 22:00 sleep. ~14 study hrs/week.

### SOC Analyst roadmap (~4–5 months, 15+ hrs/week)
1. **Foundations (wk 1–3):** TryHackMe Pre-Security (networking, Linux, web, Windows).
2. **Security+ (wk 3–11):** Professor Messer free SY0-701 course + practice bank; ~$425 voucher; sit once passing practice exams consistently.
3. **SOC hands-on (wk 6–16, overlapping):** TryHackMe SOC Level 1, LetsDefend triage, Splunk Fundamentals, MITRE ATT&CK.
4. **Portfolio (wk 14–18):** publish 15–20 investigation write-ups on GitHub/LinkedIn; rewrite CV around Security+, labs, Python background.
5. **Apply (month 4+):** Tier-1 SOC / Junior Security Analyst roles. VN employers seen hiring entry-level: PwC, EY, Bosch, Noventiq. Logistics background = edge for supply-chain / OT-ICS security niche later.

## Possible next steps (not yet done)
- Switch to redirect sign-in (see loose end).
- Add a custom favicon (currently 404s — harmless).
- Optional: push notifications / reminders (would need a service worker or an
  external service; out of scope for pure static hosting).
- Optional: let the schedule blocks be user-editable in-app instead of in code.
