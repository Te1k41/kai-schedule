import { signIn, signOutUser, watchAuth, loadData, saveData } from "./firebase-init.js";

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function toMinutes(str) { const [h, m] = str.split(":").map(Number); return h * 60 + m; }
export function nowMinutes() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
export function nowClockStr() { const d = new Date(); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); }
export function todayAbbrev(days) { return days[(new Date().getDay() + 6) % 7]; }

export function findCurrentBlock(blocks, nowMin) {
  return blocks.find(b => {
    const s = toMinutes(b.start), e = toMinutes(b.end);
    return e <= s ? (nowMin >= s || nowMin < e) : (nowMin >= s && nowMin < e);
  }) || null;
}

export const SCHEDULE_KEY = "schedule-blocks";

// Loads the signed-in user's editable schedule, seeding it once from
// defaultBuilder() (a () => {Mon:[...],...,Sun:[...]} function) the first
// time this user has no schedule-blocks doc yet.
export async function loadOrSeedSchedule(defaultBuilder) {
  const value = await loadData(SCHEDULE_KEY).catch(() => null);
  if (value) return value;
  const seeded = defaultBuilder();
  for (const day of Object.keys(seeded)) {
    seeded[day] = seeded[day].map(b => ({ id: uid(), note: "", detail: "", ...b }));
  }
  await saveData(SCHEDULE_KEY, seeded);
  return seeded;
}

export function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

export function formatDetail(text) {
  return text.split("\n\n").map(chunk => {
    const html = escapeHtml(chunk)
      .replace(/^(\d+\.\s+[^—\n]+)(—)/gm, "<strong>$1</strong>$2")
      .replace(/^(\d+\.)(\s)/gm, "<strong>$1</strong>$2")
      .replace(/\b([A-Z][A-Za-z]*(?:\s[a-z]+)?:)(?=\s|$)/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
    return `<p class="detail-para">${html}</p>`;
  }).join("");
}

export function initAuthUI({ onSignedIn, onSignedOut } = {}) {
  document.getElementById("signin-btn").addEventListener("click", () => {
    const err = document.getElementById("auth-error");
    err.style.display = "none";
    signIn().catch(e => { err.textContent = "Sign-in failed — " + e.message; err.style.display = ""; });
  });

  watchAuth((user) => {
    document.getElementById("boot-loading").style.display = "none";
    const gate = document.getElementById("auth-gate");
    const app = document.getElementById("app");
    const who = document.getElementById("signed-in-as");
    if (user) {
      gate.style.display = "none";
      app.style.display = "";
      who.style.display = "";
      who.innerHTML = escapeHtml(user.email || user.displayName || "signed in")
        + '<button id="signout-btn">Sign out</button>'
        + '<button id="force-refresh-btn" title="Clear cache and reload the app fresh">Refresh app</button>';
      document.getElementById("signout-btn").addEventListener("click", () => signOutUser());
      document.getElementById("force-refresh-btn").addEventListener("click", forceRefresh);
      if (onSignedIn) onSignedIn(user);
    } else {
      gate.style.display = "";
      app.style.display = "none";
      who.style.display = "none";
      if (onSignedOut) onSignedOut();
    }
  });
}

export async function forceRefresh() {
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } finally {
    location.reload();
  }
}

let toastTimer = null;

export function showToast(message, variant = "error", { persist = false } = {}) {
  let el = document.getElementById("app-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "app-toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.className = `toast toast-${variant}`;
  el.textContent = message;
  el.style.display = "";
  clearTimeout(toastTimer);
  if (!persist) toastTimer = setTimeout(() => { el.style.display = "none"; }, 5000);
  return el;
}

export function notifySaveFailed(message = "Couldn't save — check your connection.") {
  showToast(message, "error");
}
