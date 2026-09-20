import { saveState } from './state.js';
import { computeProgramWeek, getPhase, shouldShowReassessCard } from './progression.js';
import { getTodaysPlan, getWeeklyAdherence, getStreakWeeks } from './scheduler.js';
import { WORKOUTS, DOMS_TIP_HE } from './program-data.js';
import { today, toISODate, formatDateHe, el } from './utils.js';

export function render(container, state, { navigate }) {
  const now = today();
  const week = computeProgramWeek(state.profile.startDate, now);
  const phase = getPhase(week);
  const plan = getTodaysPlan(state, now);
  const adherence = getWeeklyAdherence(state, now);
  const streak = getStreakWeeks(state, now);
  const equipmentBadgeNeeded = (phase.id === '9-12' || phase.id === '13+') && !state.equipment.hasDumbbellsOrKettlebell;

  container.append(el('h2', {}, `שלום${state.profile.name ? ', ' + state.profile.name : ''} 👋`));

  // Phase card
  const phaseCard = el('div', { class: 'card' });
  phaseCard.append(el('div', { class: 'card-title' }, ['שבוע ', el('span', { class: 'numeral' }, String(week)), ' בתוכנית']));
  phaseCard.append(el('h3', {}, phase.label_he));
  phaseCard.append(el('p', { class: 'muted' }, phase.description_he));
  if (equipmentBadgeNeeded) {
    phaseCard.append(el('span', { class: 'badge badge-warning' }, '⚠️ אין עדיין משקולות — מוצגת חלופה'));
  }
  container.append(phaseCard);

  // Today's plan card
  const planCard = el('div', { class: 'card' });
  if (plan.type === 'resume') {
    planCard.append(el('div', { class: 'card-title' }, 'אימון בעיצומו'));
    planCard.append(el('p', {}, 'יש לך אימון פתוח שלא הושלם.'));
    planCard.append(el('button', { class: 'btn btn-primary', onclick: () => navigate('#/session') }, 'המשך אימון'));
  } else if (plan.type === 'ready') {
    const workout = WORKOUTS[plan.workoutType];
    planCard.append(el('div', { class: 'card-title' }, 'האימון הבא'));
    planCard.append(el('h3', {}, `אימון ${plan.workoutType}: ${workout.name_he}`));
    planCard.append(el('button', { class: 'btn btn-primary', onclick: () => navigate('#/session') }, 'התחילי אימון'));
  } else {
    const workout = WORKOUTS[plan.workoutType];
    planCard.append(el('div', { class: 'card-title' }, plan.doneToday ? 'האימון של היום הושלם 🎉' : 'האימון הבא'));
    if (!plan.doneToday) {
      planCard.append(el('p', {}, ['האימון הבא (', el('strong', {}, `אימון ${plan.workoutType}`), `) מתוכנן ל-`, formatDateHe(toISODate(plan.suggestedDate)), '.']));
    } else {
      planCard.append(el('p', { class: 'muted' }, `כל הכבוד! האימון הבא: אימון ${plan.workoutType} — ${workout.name_he}.`));
    }
    planCard.append(el('button', { class: 'btn btn-secondary', onclick: () => navigate('#/session') }, 'התחילי בכל זאת'));
  }
  container.append(planCard);

  // Weekly adherence card
  const weekCard = el('div', { class: 'card' });
  weekCard.append(el('div', { class: 'card-title' }, 'התקדמות השבוע'));
  const pct = Math.min(100, Math.round((adherence.done / adherence.target) * 100));
  const track = el('div', { class: 'progress-bar-track' });
  track.append(el('div', { class: 'progress-bar-fill', style: `width:${pct}%` }));
  weekCard.append(track);
  weekCard.append(el('p', { class: 'muted mt-2' }, [el('span', { class: 'numeral' }, `${adherence.done}/${adherence.target}`), ' אימונים השבוע']));
  if (streak > 0) {
    weekCard.append(el('span', { class: 'badge badge-success' }, `🔥 ${streak} שבועות רצופים`));
  }
  container.append(weekCard);

  // DOMS tip (only relevant early on)
  if (week <= 3) {
    const domsCard = el('div', { class: 'card' });
    domsCard.append(el('div', { class: 'card-title' }, '💡 טיפ'));
    domsCard.append(el('p', {}, DOMS_TIP_HE));
    container.append(domsCard);
  }

  // Reassessment nudge
  if (shouldShowReassessCard(week, state.ui.reassessDismissedAtWeek)) {
    const reassessCard = el('div', { class: 'card' });
    reassessCard.append(el('div', { class: 'card-title' }, '🔄 זמן להערכה מחדש'));
    reassessCard.append(el('p', {}, 'עברו כמה שבועות טובים! שווה לבדוק: תדירות אימונים, ציוד, והאם להוסיף תרגיל נוסף.'));
    const btn = el('button', { class: 'btn btn-ghost btn-sm', onclick: () => {
      const fresh = state;
      fresh.ui.reassessDismissedAtWeek = week;
      saveState(fresh);
      navigate('#/dashboard');
      render(container, fresh, { navigate });
    } }, 'הבנתי, תזכירי לי בפעם הבאה');
    reassessCard.append(btn);
    container.append(reassessCard);
  }
}

export function cleanup() {}
