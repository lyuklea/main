import { saveState } from './state.js';
import { computeProgramWeek, getPhase, getExerciseVariant } from './progression.js';
import { getNextWorkoutType } from './scheduler.js';
import { WORKOUTS, EXERCISES, WARMUP, REST_SECONDS, RIR_EXPLANATION_HE, PAIN_RULE_HE } from './program-data.js';
import { today, uid, formatDuration, el } from './utils.js';
import { createCountdown, playBeep, vibrate, primeAudio } from './timer.js';

let activeCountdown = null;
let formDraft = {};

function stopCountdown() {
  if (activeCountdown) {
    activeCountdown.stop();
    activeCountdown = null;
  }
}

function buildSessionSteps(workoutType, phase, equipment) {
  const workout = WORKOUTS[workoutType];
  const steps = [{ kind: 'warmup' }];
  workout.pairs.forEach((pair, pairIdx) => {
    const [exA, exB] = pair.exercises;
    const isLastPair = pairIdx === workout.pairs.length - 1;
    steps.push({ kind: 'perform', exerciseId: exA, setNumber: 1 });
    steps.push({ kind: 'rest', seconds: REST_SECONDS.betweenPairExercise, label_he: 'לפני התרגיל הבא' });
    steps.push({ kind: 'perform', exerciseId: exB, setNumber: 1 });
    steps.push({ kind: 'rest', seconds: REST_SECONDS.beforeNextRound, label_he: 'לפני הסיבוב הבא' });
    steps.push({ kind: 'perform', exerciseId: exA, setNumber: 2 });
    steps.push({ kind: 'rest', seconds: REST_SECONDS.betweenPairExercise, label_he: 'לפני התרגיל הבא' });
    steps.push({ kind: 'perform', exerciseId: exB, setNumber: 2 });
    if (!isLastPair) {
      steps.push({ kind: 'rest', seconds: REST_SECONDS.beforeNextPair, label_he: 'לפני הזוג הבא' });
    }
  });
  steps.push({ kind: 'summary' });
  return steps;
}

function ensureActiveSession(state) {
  if (state.activeSession) return state.activeSession;
  const now = today();
  const week = computeProgramWeek(state.profile.startDate, now);
  const phase = getPhase(week);
  const workoutType = getNextWorkoutType(state);
  const steps = buildSessionSteps(workoutType, phase, state.equipment);
  state.activeSession = {
    id: uid(),
    workoutType,
    dateStarted: new Date().toISOString(),
    programWeekAtTime: week,
    phaseAtTime: phase.id,
    steps,
    cursor: { stepIndex: 0, restEndsAt: null },
    exerciseLogs: [],
  };
  saveState(state);
  return state.activeSession;
}

function findOrCreateLog(session, exerciseId, variantId) {
  let log = session.exerciseLogs.find((l) => l.exerciseId === exerciseId);
  if (!log) {
    log = { exerciseId, variantId, sets: [] };
    session.exerciseLogs.push(log);
  }
  return log;
}

export function render(container, state, ctx) {
  stopCountdown();
  primeAudio();
  const session = ensureActiveSession(state);
  renderStep(container, state, session, ctx);
}

function renderStep(container, state, session, ctx) {
  stopCountdown();
  container.innerHTML = '';
  const step = session.steps[session.cursor.stepIndex];
  const phase = getPhase(session.programWeekAtTime);

  const cancelLink = el(
    'button',
    { class: 'btn btn-ghost btn-sm mt-4', onclick: () => cancelSession(state, ctx) },
    'בטלי אימון נוכחי'
  );

  if (!step || step.kind === 'summary') {
    renderSummary(container, state, session, ctx);
    return;
  }

  if (step.kind === 'warmup') {
    const card = el('div', { class: 'card' });
    card.append(el('div', { class: 'card-title' }, 'חימום (3 דקות)'));
    const list = el('ul', { class: 'exercise-cues' });
    for (const item of WARMUP) list.append(el('li', {}, item.text_he));
    card.append(list);
    card.append(el('button', { class: 'btn btn-primary mt-4', onclick: () => advance(state, session, ctx) }, 'סיימתי חימום, בואי נתחיל'));
    container.append(card);
    container.append(cancelLink);
    return;
  }

  if (step.kind === 'perform') {
    renderPerform(container, state, session, step, phase, ctx, cancelLink);
    return;
  }

  if (step.kind === 'rest') {
    renderRest(container, state, session, step, ctx, cancelLink);
    return;
  }
}

function renderPerform(container, state, session, step, phase, ctx, cancelLink) {
  const { exercise, variant, usedFallback } = getExerciseVariant(step.exerciseId, phase, state.equipment);
  const draftKey = `${session.id}:${step.exerciseId}:${step.setNumber}`;
  if (!formDraft[draftKey]) {
    formDraft[draftKey] = {
      reps: exercise.targetReps[1],
      resistance: null,
      rir: exercise.targetRIR,
    };
  }
  const draft = formDraft[draftKey];

  const card = el('div', { class: 'card' });
  card.append(el('div', { class: 'card-title' }, `סט ${step.setNumber} מתוך ${exercise.targetSets}`));
  card.append(el('h3', {}, variant.name_he));
  if (usedFallback) card.append(el('span', { class: 'badge badge-warning' }, '⚠️ אין עדיין משקולות — חלופה'));

  const repLabel = repTypeLabel(exercise.repType);
  card.append(
    el('p', { class: 'muted' }, [
      'יעד: ',
      el('span', { class: 'numeral' }, `${exercise.targetReps[0]}–${exercise.targetReps[1]}`),
      ` ${repLabel}`,
      exercise.targetRIR !== null ? ` · RIR ${exercise.targetRIR}` : '',
    ])
  );

  const cues = el('ul', { class: 'exercise-cues' });
  for (const cue of exercise.cues_he) cues.append(el('li', {}, cue));
  card.append(cues);

  // Log form
  const form = el('div', { class: 'mt-4' });
  form.append(numberField(repLabel, draft.reps, (v) => (draft.reps = v)));

  const resType = resistanceInputType(variant);
  if (resType === 'weight') {
    form.append(numberField('משקל (ק"ג)', draft.resistance ?? state.equipment.dumbbellWeightKg ?? '', (v) => (draft.resistance = v)));
  } else if (resType === 'band') {
    form.append(pillField('רמת התנגדות', ['קלה', 'בינונית', 'חזקה'], draft.resistance, (v) => { draft.resistance = v; renderStep(container, state, session, ctx); }));
  }

  if (exercise.targetRIR !== null) {
    form.append(pillField('כמה חזרות נשארו בטנק? (RIR)', ['0', '1', '2', '3', '4+'], draft.rir === null ? null : String(draft.rir), (v) => { draft.rir = v; renderStep(container, state, session, ctx); }));
  }
  card.append(form);

  card.append(
    el(
      'button',
      {
        class: 'btn btn-primary mt-4',
        onclick: () => {
          const log = findOrCreateLog(session, exercise.id, variant.id);
          const setEntry = {
            setNumber: step.setNumber,
            reps: exercise.repType === 'seconds_per_side' ? null : Number(form.querySelector('input[type="number"]').value || draft.reps),
            seconds: exercise.repType === 'seconds_per_side' ? Number(form.querySelector('input[type="number"]').value || draft.reps) : null,
            resistance: draft.resistance,
            rir: exercise.targetRIR !== null ? (draft.rir === null ? null : Number(String(draft.rir).replace('+', ''))) : null,
            note: '',
          };
          log.sets.push(setEntry);
          delete formDraft[draftKey];
          advance(state, session, ctx);
        },
      },
      'בוצע ✓'
    )
  );

  container.append(card);
  container.append(cancelLink);
}

function repTypeLabel(repType) {
  if (repType === 'reps_per_side') return 'חזרות לכל צד';
  if (repType === 'seconds_per_side') return 'שניות לכל צד';
  return 'חזרות';
}

function resistanceInputType(variant) {
  const needs = variant.equipmentNeeded || [];
  if (needs.includes('dumbbell')) return 'weight';
  if (needs.includes('band') || needs.includes('loopBand') || needs.includes('doorAnchor')) return 'band';
  return 'none';
}

function numberField(label, value, onChange) {
  const input = el('input', { type: 'number', inputmode: 'numeric', value, oninput: (e) => onChange(e.target.value) });
  return el('div', { class: 'field' }, [el('label', {}, label), input]);
}

function pillField(label, options, selected, onChange) {
  const row = el('div', { class: 'pill-row' });
  for (const opt of options) {
    row.append(
      el(
        'button',
        {
          type: 'button',
          class: 'pill' + (opt === selected ? ' selected' : ''),
          onclick: () => onChange(opt),
        },
        opt
      )
    );
  }
  return el('div', { class: 'field' }, [el('label', {}, label), row]);
}

function renderRest(container, state, session, step, ctx, cancelLink) {
  const card = el('div', { class: 'card center' });
  card.append(el('div', { class: 'card-title' }, `מנוחה — ${step.label_he}`));
  const display = el('div', { class: 'timer-display' }, '00:00');
  card.append(display);

  if (!session.cursor.restEndsAt) {
    session.cursor.restEndsAt = Date.now() + step.seconds * 1000;
    saveState(state);
  }

  activeCountdown = createCountdown({
    endsAt: session.cursor.restEndsAt,
    onTick: (remaining) => { display.textContent = formatDuration(remaining); },
    onComplete: () => {
      playBeep(state.settings.soundEnabled);
      vibrate(state.settings.vibrationEnabled);
      advance(state, session, ctx);
    },
  });

  const actions = el('div', { class: 'step-row' });
  const pauseBtn = el('button', { class: 'btn btn-secondary', onclick: () => {
    if (pauseBtn.textContent === 'השהי') { activeCountdown.pause(); pauseBtn.textContent = 'המשיכי'; }
    else { activeCountdown.resume(); pauseBtn.textContent = 'השהי'; }
  } }, 'השהי');
  actions.append(pauseBtn);
  actions.append(el('button', { class: 'btn btn-primary', onclick: () => { activeCountdown.skip(); } }, 'דלגי'));
  card.append(actions);

  container.append(card);
  container.append(cancelLink);
}

function advance(state, session, ctx) {
  session.cursor.stepIndex += 1;
  session.cursor.restEndsAt = null;
  saveState(state);
  renderStep(document.getElementById('app'), state, session, ctx);
}

function renderSummary(container, state, session, ctx) {
  const durationSeconds = Math.round((Date.now() - new Date(session.dateStarted).getTime()) / 1000);
  const card = el('div', { class: 'card' });
  card.append(el('div', { class: 'card-title' }, 'סיימת! 🎉'));
  card.append(el('h3', {}, `אימון ${session.workoutType} הושלם`));
  card.append(el('p', { class: 'muted' }, ['משך: ', el('span', { class: 'numeral' }, formatDuration(durationSeconds))]));

  const list = el('ul', { class: 'list-plain' });
  for (const log of session.exerciseLogs) {
    const exercise = EXERCISES[log.exerciseId];
    const setsText = log.sets
      .map((s) => (s.seconds !== null ? `${s.seconds}שנ׳` : `${s.reps}`) + (s.rir !== null && s.rir !== undefined ? ` (RIR ${s.rir})` : ''))
      .join(' · ');
    list.append(el('li', {}, [el('strong', {}, exercise.name_he), ': ', el('span', { class: 'numeral' }, setsText)]));
  }
  card.append(list);

  card.append(
    el(
      'button',
      {
        class: 'btn btn-primary mt-4',
        onclick: () => {
          state.sessionHistory.push({
            id: session.id,
            workoutType: session.workoutType,
            dateStarted: session.dateStarted,
            dateCompleted: new Date().toISOString(),
            status: 'completed',
            programWeekAtTime: session.programWeekAtTime,
            phaseAtTime: session.phaseAtTime,
            durationSeconds,
            exerciseLogs: session.exerciseLogs,
          });
          state.activeSession = null;
          saveState(state);
          window.location.hash = '#/dashboard';
        },
      },
      'שמירה וסיום'
    )
  );

  card.append(el('p', { class: 'muted mt-2' }, RIR_EXPLANATION_HE));
  card.append(el('p', { class: 'muted' }, PAIN_RULE_HE));

  container.append(card);
}

function cancelSession(state, ctx) {
  if (!window.confirm('לבטל את האימון הנוכחי? הנתונים שנרשמו עד כה לא יישמרו.')) return;
  state.activeSession = null;
  saveState(state);
  window.location.hash = '#/dashboard';
}

export function cleanup() {
  stopCountdown();
}
