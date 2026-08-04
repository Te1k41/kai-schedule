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
    if (!Array.isArray(seeded[day])) continue;
    seeded[day] = seeded[day].map(b => ({ id: uid(), note: "", detail: "", ...b }));
  }
  await saveData(SCHEDULE_KEY, seeded);
  return seeded;
}

// ---- Theme (per-account customizable colors) ----

export const THEME_KEY = "site-theme";
export const DEFAULT_THEME = { paper: "#F2ECDD", ink: "#211E1A", vermillion: "#9E3A26", gold: "#806124" };

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}
function rgbToHex(r, g, b) {
  const c = (n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
// Lightens (positive percent) or darkens (negative) a hex color.
function shade(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const amt = Math.round(2.55 * percent);
  return rgbToHex(r + amt, g + amt, b + amt);
}

// WCAG relative luminance — used to auto-pick readable button text
// against whatever accent color a theme sets, independent of light/dark.
function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const [R, G, B] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function contrastTextFor(bgHex) {
  return relativeLuminance(bgHex) > 0.4 ? "#211E1A" : "#F2ECDD";
}

// Applies a theme (the 4 user-facing colors plus derived shades for the
// softer tokens, same relationships the original hand-picked palette used)
// as CSS custom properties on the root element, overriding shared.css's
// defaults for this page load.
export function applyThemeValues(theme) {
  const root = document.documentElement.style;
  const inkRgb = hexToRgb(theme.ink);
  const vermRgb = hexToRgb(theme.vermillion);
  root.setProperty("--paper", theme.paper);
  root.setProperty("--paper-deep", shade(theme.paper, -6));
  root.setProperty("--ink", theme.ink);
  root.setProperty("--ink-soft", shade(theme.ink, 55));
  root.setProperty("--ink-rgb", `${inkRgb.r},${inkRgb.g},${inkRgb.b}`);
  root.setProperty("--vermillion", theme.vermillion);
  root.setProperty("--vermillion-rgb", `${vermRgb.r},${vermRgb.g},${vermRgb.b}`);
  root.setProperty("--gold", theme.gold);
  root.setProperty("--border", `rgba(${inkRgb.r},${inkRgb.g},${inkRgb.b},0.14)`);
  root.setProperty("--btn-text", contrastTextFor(theme.vermillion));

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute("content", theme.vermillion);

  try { localStorage.setItem("cached-theme", JSON.stringify(theme)); } catch (e) {}

  applyIconTheme(theme);
}

// ---- Live icon recoloring ----
// assets/icon-mask.png is a plain grayscale master of the koi artwork
// (not the already-colored icon-192/512.png) so recoloring stays accurate
// for any theme. Recolored via Canvas pixel remap (same luminance-based
// technique used to hand-recolor the icon originally) and swapped onto
// the favicon/apple-touch-icon <link> hrefs. Note: this updates the
// browser tab/bookmark icon live — an already-installed home-screen/PWA
// icon was captured by the OS at install time and can't be reached this
// way, same platform limit as changing the icon file itself.

let iconMaskImg = null;
let latestIconTheme = null;

export function applyIconTheme(theme) {
  latestIconTheme = theme;
  if (!iconMaskImg) {
    iconMaskImg = new Image();
    iconMaskImg.onload = () => paintIcon(latestIconTheme);
    iconMaskImg.src = "./assets/icon-mask.png";
    return;
  }
  if (iconMaskImg.complete) paintIcon(theme);
}

function paintIcon(theme) {
  const size = iconMaskImg.naturalWidth || 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(iconMaskImg, 0, 0, size, size);
  const imgData = ctx.getImageData(0, 0, size, size);
  const dark = hexToRgb(theme.vermillion);
  const light = hexToRgb(theme.paper);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const lum = data[i] / 255; // mask is grayscale, r===g===b
    data[i] = dark.r + (light.r - dark.r) * lum;
    data[i + 1] = dark.g + (light.g - dark.g) * lum;
    data[i + 2] = dark.b + (light.b - dark.b) * lum;
  }
  ctx.putImageData(imgData, 0, 0);
  const dataUrl = canvas.toDataURL("image/png");
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) favicon.href = dataUrl;
  const touchIcon = document.querySelector('link[rel="apple-touch-icon"]');
  if (touchIcon) touchIcon.href = dataUrl;
}

// Loads the signed-in user's saved theme (if any) and applies it. Safe to
// call on every page load — no-ops (stays on shared.css's defaults) if the
// account has never set a custom theme.
export async function applyTheme() {
  const theme = await loadData(THEME_KEY).catch(() => null);
  if (theme && theme.paper) applyThemeValues(theme);
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
      applyTheme();
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
