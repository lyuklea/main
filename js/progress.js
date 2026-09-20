import { EXERCISES } from './program-data.js';
import { suggestProgression } from './progression.js';
import { today, addDays, startOfWeek, formatDateHe, formatDuration, toISODate, el } from './utils.js';

export function render(container, state) {
  container.append(el('h2', {}, 'התקדמות'));

  const completed = state.sessionHistory
    .filter((s) => s.status === 'completed')
    .slice()
    .sort((a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted));

  if (completed.length === 0) {
    container.append(el('div', { class: 'empty-state' }, 'עוד לא נרשמו אימונים. אחרי האימון הראשון ההתקדמות שלך תופיע כאן.'));
    return;
  }

  container.append(renderAdherenceCard(state, completed));
  container.append(el('h3', { class: 'section-title' }, 'היסטוריית אימונים'));
  const list = el('ul', { class: 'list-plain' });
  for (const s of completed.slice(0, 20)) {
    list.append(
      el('li', {}, [
        el('strong', {}, `אימון ${s.workoutType}`),
        ' — ',
        formatDateHe(toISODate(s.dateCompleted)),
        ' · ',
        el('span', { class: 'numeral' }, formatDuration(s.durationSeconds || 0)),
        ' · שבוע ',
        el('span', { class: 'numeral' }, String(s.programWeekAtTime)),
      ])
    );
  }
  container.append(list);

  container.append(el('h3', { class: 'section-title' }, 'מגמות לפי תרגיל'));
  for (const exerciseId of Object.keys(EXERCISES)) {
    const rows = collectExerciseRows(completed, exerciseId);
    if (rows.length === 0) continue;
    container.append(renderExerciseTrend(exerciseId, rows, state.sessionHistory));
  }
}

function renderAdherenceCard(state, completed) {
  const now = today();
  const weeks = [];
  let cursor = startOfWeek(now);
  for (let i = 0; i < 6; i += 1) {
    const weekEnd = addDays(cursor, 7);
    const count = completed.filter((s) => {
      const d = new Date(s.dateCompleted);
      return d >= cursor && d < weekEnd;
    }).length;
    weeks.unshift({ start: cursor, count });
    cursor = addDays(cursor, -7);
  }
  const card = el('div', { class: 'card' });
  card.append(el('div', { class: 'card-title' }, 'עמידה ביעד — 6 שבועות אחרונים'));
  const row = el('div', { class: 'pill-row' });
  const target = state.profile.weeklyFrequency || 2;
  for (const w of weeks) {
    const met = w.count >= target;
    row.append(
      el(
        'span',
        { class: 'badge ' + (met ? 'badge-success' : 'badge-info') },
        el('span', { class: 'numeral' }, String(w.count))
      )
    );
  }
  card.append(row);
  return card;
}

function collectExerciseRows(completed, exerciseId) {
  const rows = [];
  for (const session of completed) {
    const log = session.exerciseLogs.find((l) => l.exerciseId === exerciseId);
    if (!log) continue;
    rows.push({ date: session.dateCompleted, log });
  }
  return rows.slice(0, 6);
}

function renderExerciseTrend(exerciseId, rows, sessionHistory) {
  const exercise = EXERCISES[exerciseId];
  const card = el('div', { class: 'card' });
  card.append(el('div', { class: 'card-title' }, exercise.name_he));

  const table = el('table', { class: 'data-table' });
  const headerRow = el('tr', {}, [el('th', {}, 'תאריך'), el('th', {}, 'סטים'), el('th', {}, 'התנגדות')]);
  table.append(el('thead', {}, headerRow));
  const tbody = el('tbody');
  for (const row of rows) {
    const setsText = row.log.sets
      .map((s) => (s.seconds !== null ? `${s.seconds}ש'` : `${s.reps}`) + (s.rir !== null && s.rir !== undefined ? `(RIR${s.rir})` : ''))
      .join(', ');
    const resistanceText = row.log.sets.map((s) => s.resistance).filter(Boolean)[0] || '—';
    tbody.append(
      el('tr', {}, [
        el('td', {}, formatDateHe(toISODate(row.date))),
        el('td', {}, el('span', { class: 'numeral' }, setsText)),
        el('td', {}, resistanceText),
      ])
    );
  }
  table.append(tbody);
  card.append(table);

  const suggestion = suggestProgression(exerciseId, sessionHistory);
  if (suggestion) {
    card.append(el('p', { class: 'muted mt-2' }, `💡 ${suggestion}`));
  }
  return card;
}

export function cleanup() {}
