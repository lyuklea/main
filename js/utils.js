// Date/formatting/id helpers shared across views.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Supports ?debugDate=YYYY-MM-DD to fast-forward "today" during QA without waiting real weeks.
export function today() {
  const params = new URLSearchParams(window.location.search);
  const debugDate = params.get('debugDate');
  if (debugDate) {
    const d = new Date(`${debugDate}T12:00:00`);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

export function toISODate(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISODate(iso) {
  return new Date(`${iso}T12:00:00`);
}

export function daysBetween(startDate, endDate) {
  const start = new Date(toISODate(startDate) + 'T00:00:00');
  const end = new Date(toISODate(endDate) + 'T00:00:00');
  return Math.round((end - start) / MS_PER_DAY);
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Sunday-based week (Israeli convention).
export function startOfWeek(date) {
  const d = new Date(toISODate(date) + 'T00:00:00');
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export function uid() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

export function formatDateHe(iso) {
  const d = parseISODate(iso);
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

// Wraps a number in an LTR isolate span so it never visually reverses inside RTL text.
export function ltr(text) {
  const span = document.createElement('span');
  span.dir = 'ltr';
  span.style.unicodeBidi = 'isolate';
  span.textContent = text;
  return span;
}

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') node.className = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
    else if (value !== null && value !== undefined) node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) {
    if (child === null || child === undefined) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}
