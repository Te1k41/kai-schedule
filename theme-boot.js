// Blocking, non-module bootstrap — runs before shared.css / first paint so a
// saved custom theme applies immediately instead of flashing in after
// app-shell.js's async Firebase Auth + Firestore load. Kept as a plain
// synchronous <script src> (not inlined per-page) so the service worker can
// precache it once and every page shares the same fast, disk-cached fetch.
// Mirrors app-shell.js's hexToRgb/shade/contrastTextFor derivations —
// keep in sync if those change.
(function () {
  try {
    var theme = JSON.parse(localStorage.getItem("cached-theme"));
    if (!theme || !theme.paper) return;
    function hex(h) {
      h = h.replace("#", "");
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    function toHex(r, g, b) {
      var c = function (n) { return Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0"); };
      return "#" + c(r) + c(g) + c(b);
    }
    function shade(h, percent) {
      var rgb = hex(h), amt = Math.round(2.55 * percent);
      return toHex(rgb[0] + amt, rgb[1] + amt, rgb[2] + amt);
    }
    function luminance(h) {
      var rgb = hex(h).map(function (c) {
        var s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }
    var ink = hex(theme.ink), verm = hex(theme.vermillion);
    var s = document.documentElement.style;
    s.setProperty("--paper", theme.paper);
    s.setProperty("--paper-deep", shade(theme.paper, -6));
    s.setProperty("--ink", theme.ink);
    s.setProperty("--ink-soft", shade(theme.ink, 55));
    s.setProperty("--ink-rgb", ink.join(","));
    s.setProperty("--vermillion", theme.vermillion);
    s.setProperty("--vermillion-rgb", verm.join(","));
    s.setProperty("--gold", theme.gold);
    s.setProperty("--border", "rgba(" + ink.join(",") + ",0.14)");
    s.setProperty("--btn-text", luminance(theme.vermillion) > 0.4 ? "#211E1A" : "#F2ECDD");
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", theme.vermillion);
  } catch (e) {}
})();
