# Making changes yourself

This is the plain-language version. `CLAUDE.md` is the dense technical
reference (for AI coding assistants); this file is for you, reading it
directly, to make common changes without needing to ask anyone.

## The loop for any change

1. Edit a file.
2. `git add <file> && git commit -m "what you changed" && git push`
3. Wait ~1 minute — GitHub Pages rebuilds automatically.
4. Open the site, **hard refresh** (Ctrl+Shift+R) or tap **Refresh app**
   (top of the page, next to Sign out) if it still looks old. The app
   caches itself aggressively so it works offline — that's the tradeoff.

That's it for every change below. Steps 2-4 won't be repeated each time.

---

## Change your daily schedule — no code needed

Open `schedule.html` on the live site, tap **Edit schedule** near the day
tabs. Pick a day, then:
- **Add a block**: fill in the form at the bottom (start, end, category,
  label, optional note/detail), tap **Add block**.
- **Edit a block**: tap **Edit** on it, the form fills in, change what you
  want, tap **Save changes**.
- **Delete a block**: tap **Delete** on it.

Saves automatically, syncs across your devices. Nothing to commit/push —
this one lives in the database, not in code.

## Change roadmap tasks — also no code needed

Open `roadmap.html`, tap **Edit roadmap** near the top:
- **Add/edit/delete a phase**: Edit/Delete buttons on each phase header,
  plus an "Add a phase" form at the very bottom of the page.
- **Add/edit/delete a task** within a phase: Edit/Delete on each task row,
  plus an "Add task" form at the bottom of each phase's task list.
- **Resources** (the collapsible "All links & prices" box): add/delete
  only (name/url/cost/note) — no in-place edit, just remove and re-add if
  you need to change one.

New accounts start with a small placeholder phase, not your real roadmap
— your own account's real content was migrated in automatically the first
time this shipped.

## Change the health/meal/workout plan — also no code needed

Open `health.html`, tap **Edit health plan** near the top:
- **Stats** (age, goal weight, calories, etc.): one form at the top, tap
  **Save stats**.
- **Meals**: every day always has all 4 slots (breakfast/lunch/dinner/
  snack) — tap **Edit** on any meal to change dish/ingredients/macros/
  cost/prep, no add/delete needed since the slots always exist.
- **Warm-up / cool-down**: add/delete only (name + time).
- **Exercises**: full add/edit/delete (name/sets/rest/cue/scale).
- **How to progress**: a plain textarea, autosaves as you type.
- **Shopping list / ingredient prices**: add/delete only.

Same migration behavior as Roadmap — your real content carried over
automatically, new accounts get a small placeholder instead.

## Change finance categories — code

`finance-core.js` — the `CATEGORIES` array near the top:

```js
export const CATEGORIES = [
  { key: "food", label: "Food", color: "var(--cat-life)" },
  ...
];
```

Add/rename/recolor here. `color` values are CSS variables already defined
in `shared.css` (`--cat-work`, `--cat-study`, `--cat-fitness`,
`--cat-life`) — reuse one, or add a new `--cat-*` variable to
`shared.css`'s `:root` block first if you want a genuinely new color.

## Change the site name

Currently "Ops" everywhere (kept neutral since other people use this too).
It's just a text string in a few places — `manifest.json`'s `name`/
`short_name`, each page's `<title>` and `apple-mobile-web-app-title` meta
tag, `index.html`'s eyebrow label, and the "&larr; Ops" back-links on
now.html/money.html/partner.html. Find-and-replace across those, no logic
involved.

## Change the site's look (colors, fonts)

`shared.css`, top of the file, the `:root { ... }` block:

```css
--paper: #F2ECDD;      /* background */
--ink: #211E1A;         /* main text */
--vermillion: #9E3A26;  /* accent color — buttons, highlights */
--gold: #806124;
```

Change a hex value here, it updates everywhere that variable is used —
the whole site, one place. Fonts are the `--font` (body) and
`--font-display` (headings) variables right below the colors.

## Where your data actually lives

Everything you enter syncs via Firestore, keyed per Google account. Quick
map of what's stored where (full detail in `CLAUDE.md` if you need it):

| What | Where you edit it | Shared with partner? |
|---|---|---|
| Daily schedule | schedule.html "Edit schedule" | Yes, read-only |
| Today's checkmarks | schedule.html checkboxes | No |
| Roadmap phases/tasks/resources | roadmap.html "Edit roadmap" | No |
| Roadmap progress | roadmap.html checkboxes | No |
| Roadmap notes box | roadmap.html sidebar textarea | No |
| Health/meal/workout plan | health.html "Edit health plan" | No |
| Daily health log (weight/steps/etc) | health.html "Today's log" | No |
| Income / expenses / budgets / accounts | finance.html / money.html | **No, private** |
| Savings goals | finance.html "Savings goals" | Yes, read-only |
| Recurring subscriptions | finance.html "Recurring subscriptions" | Yes, read-only |

## Change Firestore security rules

`firestore.rules` in this repo is the live version (not just documentation
— it's actually deployed). To change it:
1. Edit `firestore.rules`.
2. `npx firebase-tools deploy --only firestore:rules` (one-time `npx
   firebase-tools login` per machine first, if you haven't already — opens
   a browser to sign in with the Google account that owns the Firebase
   project).
3. No GitHub Pages wait needed for this one — Firestore rules take effect
   immediately on deploy, separate from the static site.

## Common problems

- **"I changed something but the live site still looks old"** — the
  service worker cached the old version. Hard refresh, or tap **Refresh
  app**. If you just pushed, also give GitHub Pages ~1 minute to rebuild
  first.
- **"Sign-in doesn't work"** — check `CLAUDE.md`'s "Known loose end"
  section (popup blocker issue, has a documented fix).
- **"My partner can't see my savings/schedule"** — one of you needs to
  generate a connect code on `partner.html` and the other needs to enter
  it (one-time, self-serve, no code/database editing needed).

## If you get stuck

Every change above is small enough to hand to Claude Code directly:
open a terminal in this folder, describe what you want changed in plain
language, and let it make the edit — same as everything in this repo so
far. This guide exists so you know *what's possible* and *roughly where*,
not so you have to memorize the exact code.
