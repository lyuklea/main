import { loadState, saveState } from './state.js';
import { toISODate, today, el } from './utils.js';

export function render(container) {
  const state = loadState();
  const step = { current: 1 };
  const draft = {
    name: state.profile.name || '',
    bodyWeightKg: state.profile.bodyWeightKg || '',
    weeklyFrequency: state.profile.weeklyFrequency || 2,
    startDate: state.profile.startDate || toISODate(today()),
    hasDumbbellsOrKettlebell: state.equipment.hasDumbbellsOrKettlebell,
  };

  function renderStep() {
    container.innerHTML = '';
    const card = el('div', { class: 'card' });
    card.append(el('h2', {}, 'ברוכה הבאה 👋'));
    card.append(el('p', { class: 'muted' }, 'כמה פרטים קצרים כדי להתאים לך את התוכנית.'));

    if (step.current === 1) {
      card.append(field('שם', 'text', draft.name, (v) => (draft.name = v)));
      card.append(field('משקל גוף (ק"ג)', 'number', draft.bodyWeightKg, (v) => (draft.bodyWeightKg = v)));
      card.append(dateField('תאריך התחלת התוכנית', draft.startDate, (v) => (draft.startDate = v)));
    } else if (step.current === 2) {
      card.append(el('div', { class: 'field' }, [
        el('label', {}, 'כמה פעמים בשבוע תרצי להתאמן?'),
        radioRow([{ v: 2, label: '2 פעמים' }, { v: 3, label: '3 פעמים' }], draft.weeklyFrequency, (v) => (draft.weeklyFrequency = v)),
      ]));
      card.append(el('div', { class: 'field' }, [
        el('label', {}, 'יש לך משקולות יד או קטלבל?'),
        radioRow([{ v: true, label: 'כן' }, { v: false, label: 'עדיין לא' }], draft.hasDumbbellsOrKettlebell, (v) => (draft.hasDumbbellsOrKettlebell = v)),
      ]));
    }

    const actions = el('div', { class: 'step-row' });
    if (step.current > 1) {
      actions.append(el('button', { class: 'btn btn-secondary', onclick: () => { step.current -= 1; renderStep(); } }, 'הקודם'));
    }
    if (step.current < 2) {
      actions.append(el('button', { class: 'btn btn-primary', onclick: () => { step.current += 1; renderStep(); } }, 'הבא'));
    } else {
      actions.append(el('button', { class: 'btn btn-primary', onclick: finish }, 'התחילי!'));
    }
    card.append(actions);
    container.append(card);
  }

  function finish() {
    const fresh = loadState();
    fresh.profile.name = draft.name.trim();
    fresh.profile.bodyWeightKg = draft.bodyWeightKg ? Number(draft.bodyWeightKg) : null;
    fresh.profile.weeklyFrequency = Number(draft.weeklyFrequency);
    fresh.profile.startDate = draft.startDate;
    fresh.profile.onboardingComplete = true;
    fresh.equipment.hasDumbbellsOrKettlebell = !!draft.hasDumbbellsOrKettlebell;
    saveState(fresh);
    window.location.hash = '#/dashboard';
  }

  function field(label, type, value, onChange) {
    const input = el('input', { type, value, oninput: (e) => onChange(e.target.value) });
    return el('div', { class: 'field' }, [el('label', {}, label), input]);
  }

  function dateField(label, value, onChange) {
    const input = el('input', { type: 'date', value, oninput: (e) => onChange(e.target.value) });
    return el('div', { class: 'field' }, [el('label', {}, label), input]);
  }

  function radioRow(options, selected, onChange) {
    const row = el('div', { class: 'pill-row' });
    for (const opt of options) {
      const btn = el(
        'button',
        {
          type: 'button',
          class: 'pill' + (opt.v === selected ? ' selected' : ''),
          onclick: () => { onChange(opt.v); renderStep(); },
        },
        opt.label
      );
      row.append(btn);
    }
    return row;
  }

  renderStep();
}

export function cleanup() {}
