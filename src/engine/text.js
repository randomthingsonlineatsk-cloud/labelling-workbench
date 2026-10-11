// Text helpers: strengths, dates, readability, near-miss spelling.

// Strength tokens such as "10 mg", "10 mg/mL", "50 mg/5 mL", "90 mcg per actuation".
const STRENGTH_RE = /(\d+(?:\.\d+)?)\s*(mcg|mg|g|units?)\b(?:\s*(?:\/|per)\s*(\d+(?:\.\d+)?)?\s*(mL|actuation))?/gi;
export function strengths(text) {
  const out = [];
  for (const m of String(text ?? '').matchAll(STRENGTH_RE)) {
    const n = String(parseFloat(m[1]));
    const unit = m[2].toLowerCase() === 'units' ? 'units' : m[2].toLowerCase() === 'unit' ? 'units' : m[2].toLowerCase();
    const vol = m[4] ? (m[4].toLowerCase() === 'ml' ? `/${m[3] ? `${parseFloat(m[3])} ` : ''}mL` : ' per actuation') : '';
    out.push(`${n} ${unit}${vol}`);
  }
  return out;
}
export const normStrength = (s) => strengths(s)[0] ?? String(s).trim();

// "MM/YYYY" -> months since year 0, or null.
export function monthIndex(mmYYYY) {
  const m = /^(0[1-9]|1[0-2])\/(\d{4})$/.exec(String(mmYYYY ?? '').trim());
  return m ? Number(m[2]) * 12 + Number(m[1]) - 1 : null;
}
export const todayMonth = (d = new Date()) => d.getFullYear() * 12 + d.getMonth();

// ---------- readability ----------
export const sentences = (text) => String(text ?? '').split(/(?<=[.!?])\s+(?=[A-Z0-9"(])/).map((s) => s.trim()).filter(Boolean);
export const words = (text) => String(text ?? '').match(/[A-Za-z][A-Za-z'-]*/g) ?? [];
export function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  const s = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g);
  return Math.max(1, s ? s.length : 1);
}
// Flesch-Kincaid grade level. A hint only: it ignores layout, headings and lists.
export function readingGrade(text) {
  const ss = sentences(text);
  const ws = words(text);
  if (!ss.length || !ws.length) return null;
  const syl = ws.reduce((n, w) => n + syllables(w), 0);
  return Math.round((0.39 * (ws.length / ss.length) + 11.8 * (syl / ws.length) - 15.59) * 10) / 10;
}
export const wordCount = (text) => words(text).length;

// ---------- spelling near-misses ----------
export function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length; const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

export const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
export const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
