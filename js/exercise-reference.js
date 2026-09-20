import { WORKOUTS, EXERCISES, PATTERN_LABELS_HE } from './program-data.js';
import { computeProgramWeek, getPhase, getExerciseVariant } from './progression.js';
import { today, el } from './utils.js';

export function render(container, state) {
  const week = computeProgramWeek(state.profile.startDate, today());
  const phase = getPhase(week);

  container.append(el('h2', {}, 'ספריית תרגילים'));
  container.append(el('p', { class: 'muted' }, `מוצגות הגרסאות המתאימות לשלב הנוכחי שלך: ${phase.label_he}`));

  for (const workoutId of ['A', 'B']) {
    const workout = WORKOUTS[workoutId];
    container.append(el('h3', { class: 'section-title' }, `אימון ${workoutId}: ${workout.name_he}`));
    for (const pair of workout.pairs) {
      for (const exerciseId of pair.exercises) {
        container.append(renderExerciseCard(exerciseId, phase, state.equipment));
      }
    }
  }
}

function renderExerciseCard(exerciseId, phase, equipment) {
  const { exercise, variant, usedFallback } = getExerciseVariant(exerciseId, phase, equipment);
  const card = el('div', { class: 'card' });
  card.append(el('div', { class: 'card-title' }, PATTERN_LABELS_HE[exercise.pattern] || ''));
  card.append(el('h4', {}, variant.name_he));
  if (usedFallback) card.append(el('span', { class: 'badge badge-warning' }, '⚠️ אין עדיין משקולות — חלופה'));

  const repLabel = exercise.repType === 'reps_per_side' ? 'חזרות לכל צד' : exercise.repType === 'seconds_per_side' ? 'שניות לכל צד' : 'חזרות';
  card.append(
    el('p', { class: 'muted' }, [
      el('span', { class: 'numeral' }, `${exercise.targetSets}x${exercise.targetReps[0]}–${exercise.targetReps[1]}`),
      ` ${repLabel}`,
      exercise.targetRIR !== null ? ` · RIR ${exercise.targetRIR}` : '',
    ])
  );

  const cues = el('ul', { class: 'exercise-cues' });
  for (const cue of exercise.cues_he) cues.append(el('li', {}, cue));
  card.append(cues);

  card.append(el('p', { class: 'muted mt-2' }, exercise.progressionNote_he));
  return card;
}

export function cleanup() {}
