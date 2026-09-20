import { saveState, clearState } from './state.js';
import { el } from './utils.js';

export function render(container, state, { navigate }) {
  container.append(el('h2', {}, 'הגדרות'));

  const profileCard = el('div', { class: 'card' });
  profileCard.append(el('div', { class: 'card-title' }, 'פרופיל'));

  const nameInput = el('input', { type: 'text', value: state.profile.name || '' });
  const weightInput = el('input', { type: 'number', inputmode: 'numeric', value: state.profile.bodyWeightKg || '' });
  const freqSelect = el('select', {}, [
    el('option', { value: '2', selected: state.profile.weeklyFrequency === 2 ? 'selected' : null }, '2 פעמים בשבוע'),
    el('option', { value: '3', selected: state.profile.weeklyFrequency === 3 ? 'selected' : null }, '3 פעמים בשבוע'),
  ]);
  const startDateInput = el('input', { type: 'date', value: state.profile.startDate || '' });

  profileCard.append(el('div', { class: 'field' }, [el('label', {}, 'שם'), nameInput]));
  profileCard.append(el('div', { class: 'field' }, [el('label', {}, 'משקל גוף (ק"ג)'), weightInput]));
  profileCard.append(el('div', { class: 'field' }, [el('label', {}, 'תדירות אימונים'), freqSelect]));
  profileCard.append(el('div', { class: 'field' }, [el('label', {}, 'תאריך התחלת תוכנית'), startDateInput]));
  container.append(profileCard);

  const equipCard = el('div', { class: 'card' });
  equipCard.append(el('div', { class: 'card-title' }, 'ציוד'));
  const dumbbellToggle = el('input', { type: 'checkbox' });
  dumbbellToggle.checked = !!state.equipment.hasDumbbellsOrKettlebell;
  const dumbbellWeightInput = el('input', { type: 'number', inputmode: 'numeric', value: state.equipment.dumbbellWeightKg || '' });
  equipCard.append(
    el('label', { class: 'field', style: 'flex-direction:row; align-items:center; gap:8px;' }, [dumbbellToggle, 'יש לי משקולות יד / קטלבל'])
  );
  equipCard.append(el('div', { class: 'field' }, [el('label', {}, 'משקל ברירת מחדל (ק"ג)'), dumbbellWeightInput]));
  container.append(equipCard);

  const soundToggle = el('input', { type: 'checkbox' });
  soundToggle.checked = !!state.settings.soundEnabled;
  const vibrateToggle = el('input', { type: 'checkbox' });
  vibrateToggle.checked = !!state.settings.vibrationEnabled;
  const prefCard = el('div', { class: 'card' });
  prefCard.append(el('div', { class: 'card-title' }, 'העדפות אימון'));
  prefCard.append(el('label', { class: 'field', style: 'flex-direction:row; align-items:center; gap:8px;' }, [soundToggle, 'צליל בסיום מנוחה']));
  prefCard.append(el('label', { class: 'field', style: 'flex-direction:row; align-items:center; gap:8px;' }, [vibrateToggle, 'רטט בסיום מנוחה']));
  container.append(prefCard);

  container.append(
    el(
      'button',
      {
        class: 'btn btn-primary mt-4',
        onclick: () => {
          state.profile.name = nameInput.value.trim();
          state.profile.bodyWeightKg = weightInput.value ? Number(weightInput.value) : null;
          state.profile.weeklyFrequency = Number(freqSelect.value);
          state.profile.startDate = startDateInput.value || state.profile.startDate;
          state.equipment.hasDumbbellsOrKettlebell = dumbbellToggle.checked;
          state.equipment.dumbbellWeightKg = dumbbellWeightInput.value ? Number(dumbbellWeightInput.value) : null;
          state.settings.soundEnabled = soundToggle.checked;
          state.settings.vibrationEnabled = vibrateToggle.checked;
          saveState(state);
          navigate('#/dashboard');
        },
      },
      'שמירה'
    )
  );

  const dangerCard = el('div', { class: 'card mt-4' });
  dangerCard.append(el('div', { class: 'card-title' }, 'איפוס נתונים'));
  dangerCard.append(el('p', { class: 'muted' }, 'מחיקת כל הנתונים השמורים (פרופיל, היסטוריית אימונים) מהמכשיר הזה. לא ניתן לשחזר.'));
  dangerCard.append(
    el(
      'button',
      {
        class: 'btn btn-danger',
        onclick: () => {
          if (window.confirm('למחוק את כל הנתונים? פעולה זו בלתי הפיכה.')) {
            clearState();
            navigate('#/onboarding');
            window.location.reload();
          }
        },
      },
      'איפוס כל הנתונים'
    )
  );
  container.append(dangerCard);
}

export function cleanup() {}
