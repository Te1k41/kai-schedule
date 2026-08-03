import { signIn, signOutUser, watchAuth } from "./firebase-init.js";

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
      who.innerHTML = escapeHtml(user.email || user.displayName || "signed in") + '<button id="signout-btn">Sign out</button>';
      document.getElementById("signout-btn").addEventListener("click", () => signOutUser());
      if (onSignedIn) onSignedIn(user);
    } else {
      gate.style.display = "";
      app.style.display = "none";
      who.style.display = "none";
      if (onSignedOut) onSignedOut();
    }
  });
}

let toastTimer = null;

export function showToast(message, variant = "error") {
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
  toastTimer = setTimeout(() => { el.style.display = "none"; }, 5000);
  return el;
}

export function notifySaveFailed(message = "Couldn't save — check your connection.") {
  showToast(message, "error");
}
