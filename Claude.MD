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
  `saveData(key, value)`, `loadPartnerData(otherUid, key)` (read-only cross-user read,
  gated by Firestore rules — see Sharing below). Pages import from it as an ES module.
- `app-shell.js` also exports shared helpers now: `uid()`, `toMinutes`/`nowMinutes`/
  `nowClockStr`/`todayAbbrev(days)`, `findCurrentBlock(blocks, nowMin)`, and
  `loadOrSeedSchedule(defaultBuilder)` (loads the signed-in user's editable schedule,
  seeding it once from `defaultBuilder()` if they don't have one yet).
- Each page shows a **sign-in gate**; after Google sign-in, `watchAuth` reveals
  the app and loads that user's data.
- Data is stored per-user at Firestore path `users/{uid}/data/{key}`.
  - `schedule-today` → `{ date, checked }` (resets when the date changes, keyed by
    each block's `start` time string)
  - `schedule-blocks` → `{ Mon: [...blocks], Tue: [...], ..., Sun: [...] }`, each
    block `{ id, start, end, cat, label, note, detail }` — **user-editable in-app**
    now (schedule.html's "Edit schedule" toggle), not hardcoded. First load for a
    new user seeds from `schedule-data.js`'s `defaultWeekSeed()` as a starting
    example, then it's fully theirs to edit.
  - `soc-roadmap-progress` → `{ taskId: true, ... }`
  - `roadmap-notes` → plain string (free-text scratch box on roadmap.html)
  - `finance-data` → `{ income[], expenses[], budgets{}, accounts[] }` — private,
    never shared
  - `savings-goals` → `[{ id, name, target, saved, link }]` — split out of
    `finance-data` specifically so it can be shared read-only (see below)
  - `subscriptions-list` → `[{ id, name, category, account, amount, dueDay,
    endMonth, link, lastLoggedMonth }]` — also split out for the same reason.
    The recurring expense entries a subscription auto-logs each month still land
    in the private `finance-data.expenses`, only the subscription *definitions*
    are shareable.
- `weekdayTemplate()`/`weekendTemplate()`/`defaultWeekSeed()` in `schedule-data.js`
  are now only used as the **seed** for a first-time user's `schedule-blocks` doc,
  not read live — `schedule.html`/`now.html` read the Firestore doc afterward.
  `PHASES` in roadmap.html is still a static array (roadmap content isn't
  user-editable, only task-completion is).

## Sharing with a second person (girlfriend's account)
Finance stays fully private per person. Only `savings-goals`, `subscriptions-list`,
and `schedule-blocks` are shared, **read-only, mutually**, via `partner.html`.
This shipped in two steps:
- **Done:** the data split above, `partner.html` itself, and `loadPartnerData()`.
  `partner.html` has a `PARTNER_UID` map (currently empty/commented) — if the
  signed-in user isn't in it, the page just says "not set up yet" rather than
  attempting a read Firestore would reject anyway.
- **Pending — needs both people's Firebase Auth UIDs** (Firebase Console →
  Authentication → Users, once she's signed in once):
  1. Fill in `partner.html`'s `PARTNER_UID` map with the real two UIDs.
  2. Paste this into Firebase Console → Firestore Database → Rules → Publish
     (replacing the current rules below — there's no `firestore.rules` file in
     this repo, rules only live in the Console):
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /users/{userId}/data/{key} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
           allow read: if request.auth != null
             && key in ['schedule-blocks', 'savings-goals', 'subscriptions-list']
             && (
               (request.auth.uid == 'KAI_UID_HERE' && userId == 'GF_UID_HERE') ||
               (request.auth.uid == 'GF_UID_HERE' && userId == 'KAI_UID_HERE')
             );
         }
       }
     }
     ```

## Firebase (already configured)
- Project id: `kai-schedule-731c0`
- Config is filled into `firebase-init.js` (Firebase config values are NOT secrets;
  security comes from Firestore rules, not from hiding the key).
- **Enabled:** Google sign-in provider; Cloud Firestore (production mode).
- **Authorized domain added:** `te1k41.github.io`
- **Firestore rules** (currently live — locks all data to its owner; see
  "Sharing with a second person" above for the pending update that adds
  mutual read-only access to a few keys):
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
- Finish the sharing rollout: get both people's Firebase Auth UIDs, fill in
  `partner.html`'s `PARTNER_UID` map, publish the updated Firestore rules —
  see "Sharing with a second person" above.
