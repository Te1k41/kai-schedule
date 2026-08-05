export { uid } from "./app-shell.js";

export const STORAGE_KEY = "finance-data";

export const CATEGORIES = [
  { key: "food", label: "Food", color: "var(--cat-life)" },
  { key: "study", label: "Study / Certs", color: "var(--cat-study)" },
  { key: "transport", label: "Transport", color: "var(--cat-work)" },
  { key: "bills", label: "Bills", color: "var(--cat-work)" },
  { key: "fun", label: "Fun", color: "var(--cat-fitness)" },
  { key: "other", label: "Other", color: "var(--ink-soft)" }
];
export const CAT_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.key, c.label]));
export const CAT_COLOR = Object.fromEntries(CATEGORIES.map(c => [c.key, c.color]));

export function defaultFinanceData() {
  return { income: [], expenses: [], budgets: {}, budgetPct: {}, incomeSources: [], accounts: [] };
}

export function defaultGoals() {
  return [];
}

export function defaultSubscriptions() {
  return [];
}

export function fmtVnd(n) {
  return Math.round(n).toLocaleString("en-US") + " VND";
}

// Parses a possibly comma-formatted amount input back into a plain number.
export function parseAmount(str) {
  return Number(String(str).replace(/[^\d.-]/g, "")) || 0;
}

// Wires live thousands-separator formatting onto a text input, cursor-safe.
export function attachThousandsInput(el) {
  if (el.value) el.value = parseAmount(el.value) ? parseAmount(el.value).toLocaleString("en-US") : el.value;
  el.addEventListener("input", () => {
    const digitsBefore = el.value.slice(0, el.selectionStart).replace(/\D/g, "").length;
    const raw = el.value.replace(/\D/g, "");
    el.value = raw ? Number(raw).toLocaleString("en-US") : "";
    let pos = 0, seen = 0;
    while (pos < el.value.length && seen < digitsBefore) {
      if (/\d/.test(el.value[pos])) seen++;
      pos++;
    }
    el.setSelectionRange(pos, pos);
  });
}

export function accountBalance(data, accId) {
  const acc = data.accounts.find(a => a.id === accId);
  if (!acc) return 0;
  const inc = data.income.filter(e => e.account === accId).reduce((s, e) => s + Number(e.amount || 0), 0);
  const exp = data.expenses.filter(e => e.account === accId).reduce((s, e) => s + Number(e.amount || 0), 0);
  return acc.startingBalance + inc - exp;
}

export function accountName(data, accId) {
  const acc = data.accounts.find(a => a.id === accId);
  return acc ? acc.name : "—";
}

export function totalBalance(data) {
  return data.accounts.reduce((s, a) => s + accountBalance(data, a.id), 0);
}

export function totalMonthlyIncome(data) {
  return data.incomeSources.reduce((s, x) => s + Number(x.amount || 0), 0);
}
