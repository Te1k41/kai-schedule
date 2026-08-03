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
  return { income: [], expenses: [], budgets: {}, goals: [], subscriptions: [], accounts: [] };
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function fmtVnd(n) {
  return Math.round(n).toLocaleString() + " VND";
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
