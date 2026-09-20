import { PHASES, EXERCISES } from './program-data.js';
import { daysBetween } from './utils.js';

export function computeProgramWeek(startDateISO, todayDate) {
  if (!startDateISO) return 1;
  const days = daysBetween(startDateISO, todayDate);
  return Math.max(1, Math.floor(days / 7) + 1);
}

export function getPhase(week) {
  return PHASES.find((p) => week >= p.weekStart && (p.weekEnd === null || week <= p.weekEnd)) || PHASES[PHASES.length - 1];
}

// Resolves which named variant of an exercise should be shown for the current phase/equipment.
export function getExerciseVariant(exerciseId, phase, equipment) {
  const exercise = EXERCISES[exerciseId];
  if (!exercise) return null;
  let key = phase.variantKey;
  let usedFallback = false;
  if (phase.fallbackVariantKey) {
    const hasWeights = !!equipment.hasDumbbellsOrKettlebell;
    if (!hasWeights) {
      key = phase.fallbackVariantKey;
      usedFallback = true;
    }
  }
  const variant = exercise.variants[key] || exercise.variants.default;
  return { exercise, variant, usedFallback };
}

// Double-progression suggestion: if the last 2 logged sessions for this exercise both hit
// the top of the rep range at/under target RIR, nudge to add load/resistance next time.
export function suggestProgression(exerciseId, sessionHistory) {
  const exercise = EXERCISES[exerciseId];
  if (!exercise || exercise.targetRIR === null) return null;
  const relevant = sessionHistory
    .filter((s) => s.status === 'completed')
    .slice()
    .reverse()
    .map((s) => s.exerciseLogs.find((l) => l.exerciseId === exerciseId))
    .filter(Boolean)
    .slice(0, 2);
  if (relevant.length < 2) return null;

  const topOfRange = exercise.targetReps[1];
  const hitTopBothTimes = relevant.every((log) =>
    log.sets.length > 0 &&
    log.sets.every((set) => {
      const repsValue = exercise.repType === 'seconds_per_side' ? set.seconds : set.reps;
      const rirOk = set.rir === null || set.rir === undefined || set.rir <= exercise.targetRIR;
      return repsValue !== null && repsValue !== undefined && repsValue >= topOfRange && rirOk;
    })
  );
  if (!hitTopBothTimes) return null;
  return 'עלית לטופ הטווח פעמיים ברצף — שקלי להעלות התנגדות/משקל בפעם הבאה.';
}

export function shouldShowReassessCard(week, dismissedAtWeek) {
  if (week < 13) return false;
  if ((week - 13) % 6 !== 0) return false;
  return dismissedAtWeek !== week;
}
