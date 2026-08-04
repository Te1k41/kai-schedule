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

## Change roadmap tasks — code

`roadmap.html` — search for `const PHASES = [`. Each phase looks like:

```js
{
  id: "p1", title: "Foundations", weeks: "Weeks 1-3",
  note: "Networking and Linux basics...",
  tasks: [
    { id: "p1-1", label: "Create a free TryHackMe account", detail: "..." },
    ...
  ]
}
```

- **Edit a task's text**: change its `label` or `detail` string.
- **Add a task**: copy an existing `{ id: ..., label: ..., detail: ... }`
  line, paste it in the `tasks` array, give it a **new unique `id`**
  (e.g. `p1-7` if `p1-6` is the last one in that phase) — reusing an id
  overwrites another task's saved checkmark.
- **Add a whole phase**: copy a `{ id: "p6", ... }` block, change `id` to
  something new (`p7`), fill in `title`/`weeks`/`note`/`tasks`.
- Never reuse an `id` that used to mean something else — that's how
  "already checked" progress is tracked per person.

Same `id`-safety rule applies to the `RESOURCES` array just below it
(the collapsible "All links & prices" box).

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
| Roadmap progress | roadmap.html checkboxes | No |
| Roadmap notes box | roadmap.html sidebar textarea | No |
| Income / expenses / budgets / accounts | finance.html / money.html | **No, private** |
| Savings goals | finance.html "Savings goals" | Yes, read-only |
| Recurring subscriptions | finance.html "Recurring subscriptions" | Yes, read-only |

## Common problems

- **"I changed something but the live site still looks old"** — the
  service worker cached the old version. Hard refresh, or tap **Refresh
  app**. If you just pushed, also give GitHub Pages ~1 minute to rebuild
  first.
- **"Sign-in doesn't work"** — check `CLAUDE.md`'s "Known loose end"
  section (popup blocker issue, has a documented fix).
- **"My partner can't see my savings/schedule"** — that feature needs
  both Google account UIDs set up once (see `CLAUDE.md`, "Sharing with a
  second person") — a one-time setup step, not a bug.

## If you get stuck

Every change above is small enough to hand to Claude Code directly:
open a terminal in this folder, describe what you want changed in plain
language, and let it make the edit — same as everything in this repo so
far. This guide exists so you know *what's possible* and *roughly where*,
not so you have to memorize the exact code.
