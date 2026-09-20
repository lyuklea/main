import { toISODate, addDays, startOfWeek, daysBetween } from './utils.js';

function lastCompletedSession(state) {
  const completed = state.sessionHistory.filter((s) => s.status === 'completed');
  if (completed.length === 0) return null;
  return completed.reduce((latest, s) => (s.dateCompleted > latest.dateCompleted ? s : latest));
}

export function getNextWorkoutType(state) {
  const last = lastCompletedSession(state);
  if (!last) return 'A';
  return last.workoutType === 'A' ? 'B' : 'A';
}

// Returns one of:
//  { type: 'resume' }
//  { type: 'ready', workoutType }
//  { type: 'early', workoutType, suggestedDate }
export function getTodaysPlan(state, todayDate) {
  if (state.activeSession) return { type: 'resume' };

  const workoutType = getNextWorkoutType(state);
  const last = lastCompletedSession(state);
  const gapDays = 7 / (state.profile.weeklyFrequency || 2);
  const baseDate = last ? last.dateCompleted : state.profile.startDate;
  const suggestedDate = baseDate ? addDays(new Date(baseDate), Math.round(gapDays)) : todayDate;

  const alreadyDoneToday = state.sessionHistory.some(
    (s) => s.status === 'completed' && toISODate(s.dateCompleted) === toISODate(todayDate)
  );
  if (alreadyDoneToday) {
    return { type: 'early', workoutType, suggestedDate, doneToday: true };
  }

  if (toISODate(todayDate) >= toISODate(suggestedDate)) {
    return { type: 'ready', workoutType };
  }
  return { type: 'early', workoutType, suggestedDate };
}

export function getWeeklyAdherence(state, todayDate) {
  const weekStart = startOfWeek(todayDate);
  const weekEnd = addDays(weekStart, 7);
  const doneThisWeek = state.sessionHistory.filter((s) => {
    if (s.status !== 'completed') return false;
    const d = new Date(s.dateCompleted);
    return d >= weekStart && d < weekEnd;
  }).length;
  return { done: doneThisWeek, target: state.profile.weeklyFrequency || 2 };
}

export function getStreakWeeks(state, todayDate) {
  let streak = 0;
  let cursor = startOfWeek(todayDate);
  const target = state.profile.weeklyFrequency || 2;
  // Only count the current week if it has already met target (avoids counting an in-progress week as broken).
  for (let i = 0; i < 104; i += 1) {
    const weekEnd = addDays(cursor, 7);
    const count = state.sessionHistory.filter((s) => {
      if (s.status !== 'completed') return false;
      const d = new Date(s.dateCompleted);
      return d >= cursor && d < weekEnd;
    }).length;
    if (i === 0 && count < target) {
      // current week not finished yet — skip it, start counting from last week
      cursor = addDays(cursor, -7);
      continue;
    }
    if (count >= target) {
      streak += 1;
      cursor = addDays(cursor, -7);
    } else {
      break;
    }
  }
  return streak;
}

export { daysBetween };
