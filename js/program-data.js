// Static program content — transcribed from the source document (Tal Ben Moshe / TBM Academy,
// Google TLV lecture, "Plan 2": home strength program for a 40+ beginner). Never persisted;
// sessions log only exerciseId + values against this table.

export const WARMUP = [
  { id: 'hip_circles', text_he: '8 סיבובי אגן ומפרקי ירך לכל כיוון', seconds: 30 },
  { id: 'shoulder_rolls', text_he: '8 סיבובי כתפיים וזרועות לאחור', seconds: 30 },
  { id: 'chair_squats', text_he: '5 סקוואטים חופשיים איטיים לישיבה על כיסא', seconds: 40 },
];

export const PATTERN_LABELS_HE = {
  squat: 'כפיפת ברכיים (Squat)',
  push_horizontal: 'לחיצה אופקית (Push)',
  row_horizontal: 'משיכה אופקית (Row)',
  hinge: 'ציר ירך (Hinge)',
  press_overhead: 'לחיצה אנכית (Overhead)',
  core: 'ייצוב ליבה (Core)',
  lunge_unilateral: 'כפיפת ברכיים חד-צדדית (Unilateral)',
  pull_vertical: 'משיכה אנכית (Pull)',
  posture: 'חגורת כתפיים ושכמות (Posture)',
  core_lateral: 'ייצוב צדי (Lateral Core)',
};

// repType: 'reps' | 'reps_per_side' | 'seconds_per_side'
export const EXERCISES = {
  // ---- Workout A ----
  a1_box_squat: {
    id: 'a1_box_squat',
    workout: 'A',
    pairId: 'A',
    slot: 'X',
    name_he: 'סקוואט לכיסא (Box Squat)',
    pattern: 'squat',
    repType: 'reps',
    targetSets: 2,
    targetReps: [10, 12],
    targetRIR: 2,
    cues_he: [
      'עמידה ברוחב כתפיים',
      'הוצאת ישבן לאחור וישיבה מבוקרת עד נגיעה קלה בכיסא',
      'עלייה חזרה דרך דחיפת העקבים לרצפה',
      'גב זקוף וחזה פתוח',
    ],
    variants: {
      default: { id: 'default', name_he: 'סקוואט לכיסא', equipmentNeeded: [] },
      week5_8: { id: 'week5_8', name_he: 'סקוואט חופשי (ללא כיסא)', equipmentNeeded: [] },
      week9_12_dumbbell: { id: 'week9_12_dumbbell', name_he: 'גובלט סקוואט עם משקולת/קטלבל', equipmentNeeded: ['dumbbell'] },
      week9_12_fallback: { id: 'week9_12_fallback', name_he: 'סקוואט חופשי בקצב איטי (עד שיהיו משקולות)', equipmentNeeded: [] },
    },
    progressionNote_he: 'התקדמות עתידית: סקוואט לכיסא ← סקוואט חופשי ← גובלט סקוואט עם משקולת/קטלבל צמודה לחזה.',
  },
  a2_incline_pushup: {
    id: 'a2_incline_pushup',
    workout: 'A',
    pairId: 'A',
    slot: 'Y',
    name_he: 'שכיבות סמיכה בשיפוע (Incline Push-ups)',
    pattern: 'push_horizontal',
    repType: 'reps',
    targetSets: 2,
    targetReps: [8, 10],
    targetRIR: 2,
    cues_he: [
      'ידיים מונחות על שיש המטבח או שולחן יציב',
      'הגוף בקו ישר (בטן וישבן מכווצים)',
      'הורדת החזה בקצב מבוקר, מרפקים בזווית 45° מהגוף',
    ],
    variants: {
      default: { id: 'default', name_he: 'שכיבות סמיכה על שיש/שולחן', equipmentNeeded: [] },
      week5_8: { id: 'week5_8', name_he: 'שכיבות סמיכה על ספה/כיסא (שיפוע נמוך יותר)', equipmentNeeded: [] },
      week9_12_dumbbell: { id: 'week9_12_dumbbell', name_he: 'שכיבות סמיכה על הרצפה', equipmentNeeded: [] },
      week9_12_fallback: { id: 'week9_12_fallback', name_he: 'שכיבות סמיכה על הרצפה עם ברכיים', equipmentNeeded: [] },
    },
    progressionNote_he: 'התקדמות עתידית: שיפוע גבוה ← שיפוע נמוך יותר (ספה/כיסא) ← רצפה עם ברכיים ← שכיבות סמיכה מלאות.',
  },
  b1_seated_band_row: {
    id: 'b1_seated_band_row',
    workout: 'A',
    pairId: 'B',
    slot: 'X',
    name_he: 'חתירה בישיבה עם גומייה (Seated Band Row)',
    pattern: 'row_horizontal',
    repType: 'reps',
    targetSets: 2,
    targetReps: [10, 12],
    targetRIR: 2,
    cues_he: [
      'ישיבה על הרצפה/מזרן, גומייה כרוכה סביב כפות הרגליים',
      'משיכת המרפקים לאחור צמוד לגוף',
      'כיווץ והצמדת שכמות בסוף התנועה',
    ],
    variants: {
      default: { id: 'default', name_he: 'חתירה בישיבה עם גומייה', equipmentNeeded: ['band'] },
      week5_8: { id: 'week5_8', name_he: 'חתירה עם גומייה בהתנגדות בינונית', equipmentNeeded: ['band'] },
      week9_12_dumbbell: { id: 'week9_12_dumbbell', name_he: 'חתירה בהטיית גב עם משקולת (Bent-over Row)', equipmentNeeded: ['dumbbell'] },
      week9_12_fallback: { id: 'week9_12_fallback', name_he: 'חתירה עם גומייה עבה יותר', equipmentNeeded: ['band'] },
    },
    progressionNote_he: 'התקדמות עתידית: גומייה עבה יותר / ביצוע בעמידה בהטיית גב עם משקולת.',
  },
  b2_glute_bridge: {
    id: 'b2_glute_bridge',
    workout: 'A',
    pairId: 'B',
    slot: 'Y',
    name_he: 'גשר עכוז על מזרן (Glute Bridge)',
    pattern: 'hinge',
    repType: 'reps',
    targetSets: 2,
    targetReps: [12, 15],
    targetRIR: 2,
    cues_he: [
      'שכיבה על הגב, ברכיים כפופות (אופציונלי: גומיית לולאה מעל הברכיים)',
      'הרמת האגן עד קו ישר מברכיים לכתפיים',
      'כיווץ ישבן חזק למשך 2 שניות בשיא הגובה',
    ],
    variants: {
      default: { id: 'default', name_he: 'גשר עכוז', equipmentNeeded: [] },
      week5_8: { id: 'week5_8', name_he: 'גשר עכוז עם גומיית לולאה מעל הברכיים', equipmentNeeded: ['loopBand'] },
      week9_12_dumbbell: { id: 'week9_12_dumbbell', name_he: 'גשר עכוז עם משקולת על האגן', equipmentNeeded: ['dumbbell'] },
      week9_12_fallback: { id: 'week9_12_fallback', name_he: 'גשר עכוז חד-רגלי (Single-leg)', equipmentNeeded: [] },
    },
    progressionNote_he: 'התקדמות עתידית: גומיית לולאה מעל הברכיים ← משקל קל על האגן ← דדליפט רומני (RDL) עם משקולת/גומייה.',
  },
  c1_seated_overhead_band_press: {
    id: 'c1_seated_overhead_band_press',
    workout: 'A',
    pairId: 'C',
    slot: 'X',
    name_he: 'לחיצת כתפיים בישיבה עם גומייה (Seated Overhead Press)',
    pattern: 'press_overhead',
    repType: 'reps',
    targetSets: 2,
    targetReps: [8, 10],
    targetRIR: 2,
    cues_he: [
      'ישיבה זקופה על כיסא, דריכה על הגומייה עם שתי הרגליים',
      'לחיצת הידיים מעלה מעל הראש בשליטה מלאה',
      'הורדה מבוקרת',
    ],
    variants: {
      default: { id: 'default', name_he: 'לחיצת כתפיים בישיבה עם גומייה', equipmentNeeded: ['band'] },
      week5_8: { id: 'week5_8', name_he: 'לחיצת כתפיים בעמידה עם גומייה', equipmentNeeded: ['band'] },
      week9_12_dumbbell: { id: 'week9_12_dumbbell', name_he: 'לחיצת כתפיים עם זוג משקולות יד', equipmentNeeded: ['dumbbell'] },
      week9_12_fallback: { id: 'week9_12_fallback', name_he: 'לחיצת כתפיים עם גומייה עבה יותר', equipmentNeeded: ['band'] },
    },
    progressionNote_he: 'התקדמות עתידית: עמידה עם גומייה ← זוג משקולות יד (3–5 ק"ג ומעלה).',
  },
  c2_bird_dog: {
    id: 'c2_bird_dog',
    workout: 'A',
    pairId: 'C',
    slot: 'Y',
    name_he: 'בירד-דוג (Bird-Dog)',
    pattern: 'core',
    repType: 'reps_per_side',
    targetSets: 2,
    targetReps: [8, 8],
    targetRIR: 2,
    cues_he: [
      'עמידת שש (ברכיים תחת ירכיים, כפות ידיים תחת כתפיים)',
      'הושטת יד ימין ורגל שמאל בקו ישר ומקביל לרצפה (ולהפך)',
      'שמירה על בטן אסופה ואגן מאוזן',
    ],
    variants: {
      default: { id: 'default', name_he: 'בירד-דוג', equipmentNeeded: [] },
      week5_8: { id: 'week5_8', name_he: 'בירד-דוג עם פאוזה של 2 שניות בשיא התנועה', equipmentNeeded: [] },
      week9_12_dumbbell: { id: 'week9_12_dumbbell', name_he: 'פלאנק מלא על אמות (30–45 שנ׳)', equipmentNeeded: [] },
      week9_12_fallback: { id: 'week9_12_fallback', name_he: 'פלאנק מלא על אמות (30–45 שנ׳)', equipmentNeeded: [] },
    },
    progressionNote_he: 'התקדמות עתידית: פלאנק מלא על אמות למשך 30–45 שניות.',
  },
  // ---- Workout B ----
  a1_band_rdl: {
    id: 'a1_band_rdl',
    workout: 'B',
    pairId: 'A',
    slot: 'X',
    name_he: 'דדליפט רומני עם גומייה (Band RDL)',
    pattern: 'hinge',
    repType: 'reps',
    targetSets: 2,
    targetReps: [10, 12],
    targetRIR: 2,
    cues_he: [
      'עמידה על גומייה, ברכיים רכות (לא נעולות)',
      'דחיפת הישבן לאחור תוך שמירה על גב ישר עד מתיחה בירך האחורית',
      'חזרה לעמידה בכיווץ ישבן',
    ],
    variants: {
      default: { id: 'default', name_he: 'דדליפט רומני עם גומייה', equipmentNeeded: ['band'] },
      week5_8: { id: 'week5_8', name_he: 'דדליפט רומני עם גומייה בהתנגדות בינונית', equipmentNeeded: ['band'] },
      week9_12_dumbbell: { id: 'week9_12_dumbbell', name_he: 'דדליפט רומני עם קטלבל / זוג משקולות יד', equipmentNeeded: ['dumbbell'] },
      week9_12_fallback: { id: 'week9_12_fallback', name_he: 'דדליפט רומני עם גומייה עבה יותר', equipmentNeeded: ['band'] },
    },
    progressionNote_he: 'התקדמות עתידית: שימוש בקטלבל / זוג משקולות יד (8–12 ק"ג).',
  },
  a2_band_pull_apart: {
    id: 'a2_band_pull_apart',
    workout: 'B',
    pairId: 'A',
    slot: 'Y',
    name_he: 'פתיחת גומייה מול החזה (Band Pull-Apart)',
    pattern: 'posture',
    repType: 'reps',
    targetSets: 2,
    targetReps: [12, 15],
    targetRIR: 2,
    cues_he: [
      'אחיזת גומייה בגובה החזה ברוחב כתפיים',
      'משיכת הגומייה לצדדים עד נגיעה בחזה',
      'הצמדה וכיווץ חזק של השכמות',
    ],
    variants: {
      default: { id: 'default', name_he: 'פתיחת גומייה מול החזה', equipmentNeeded: ['band'] },
      week5_8: { id: 'week5_8', name_he: 'פתיחת גומייה עבה יותר', equipmentNeeded: ['band'] },
      week9_12_dumbbell: { id: 'week9_12_dumbbell', name_he: 'פתיחת גומייה עם פאוזה של 2 שניות בכיווץ', equipmentNeeded: ['band'] },
      week9_12_fallback: { id: 'week9_12_fallback', name_he: 'פתיחת גומייה עם פאוזה של 2 שניות בכיווץ', equipmentNeeded: ['band'] },
    },
    progressionNote_he: 'התקדמות עתידית: גומייה עבה יותר / פאוזה של 2 שניות בכיווץ.',
  },
  b1_supported_reverse_lunge: {
    id: 'b1_supported_reverse_lunge',
    workout: 'B',
    pairId: 'B',
    slot: 'X',
    name_he: 'מכרעים לאחור בתמיכת כיסא (Supported Reverse Lunge)',
    pattern: 'lunge_unilateral',
    repType: 'reps_per_side',
    targetSets: 2,
    targetReps: [8, 10],
    targetRIR: 2,
    cues_he: [
      'עמידה לצד כיסא ותמיכה קלה ביד',
      'צעד מבוקר לאחור והורדת הברך האחורית לכיוון הרצפה (שתי הברכיים ב-90°)',
      'דחיפה חזרה דרך העקב הקדמי',
    ],
    variants: {
      default: { id: 'default', name_he: 'מכרעים לאחור בתמיכת כיסא', equipmentNeeded: [] },
      week5_8: { id: 'week5_8', name_he: 'מכרעים לאחור עם תמיכה קלה בלבד', equipmentNeeded: [] },
      week9_12_dumbbell: { id: 'week9_12_dumbbell', name_he: 'מכרעים לאחור עם משקולות יד', equipmentNeeded: ['dumbbell'] },
      week9_12_fallback: { id: 'week9_12_fallback', name_he: 'מכרעים לאחור ללא תמיכת ידיים', equipmentNeeded: [] },
    },
    progressionNote_he: 'התקדמות עתידית: ביצוע ללא תמיכת ידיים / החזקת משקולות יד.',
  },
  b2_door_lat_pulldown: {
    id: 'b2_door_lat_pulldown',
    workout: 'B',
    pairId: 'B',
    slot: 'Y',
    name_he: 'משיכת פולי עליון בגומייה (Door-Anchored Lat Pulldown)',
    pattern: 'pull_vertical',
    repType: 'reps',
    targetSets: 2,
    targetReps: [10, 12],
    targetRIR: 2,
    cues_he: [
      'גומייה מעוגנת לחלק העליון של הדלת',
      'כריעת ברך או ישיבה זקופה',
      'משיכת המרפקים מטה ולצדדים תוך פתיחת בית החזה',
    ],
    variants: {
      default: { id: 'default', name_he: 'משיכת פולי עליון בגומייה', equipmentNeeded: ['band', 'doorAnchor'] },
      week5_8: { id: 'week5_8', name_he: 'משיכת פולי עם גומייה בהתנגדות בינונית', equipmentNeeded: ['band', 'doorAnchor'] },
      week9_12_dumbbell: { id: 'week9_12_dumbbell', name_he: 'משיכת פולי בגומייה עם התנגדות מוגברת', equipmentNeeded: ['band', 'doorAnchor'] },
      week9_12_fallback: { id: 'week9_12_fallback', name_he: 'משיכת פולי בגומייה עם התנגדות מוגברת', equipmentNeeded: ['band', 'doorAnchor'] },
    },
    progressionNote_he: 'התקדמות עתידית: הגדלת התנגדות הגומייה / עבודה על מתקן מתח בסיוע גומייה.',
  },
  c1_floor_press: {
    id: 'c1_floor_press',
    workout: 'B',
    pairId: 'C',
    slot: 'X',
    name_he: 'לחיצת חזה על מזרן (Floor Press)',
    pattern: 'push_horizontal',
    repType: 'reps',
    targetSets: 2,
    targetReps: [10, 12],
    targetRIR: 2,
    cues_he: [
      'שכיבה על הגב עם משקולות קלות או גומייה',
      'לחיצה מעלה עד יישור מבוקר',
      'הורדה עד נגיעת הזרועות ברצפה (מגן על הכתף)',
    ],
    variants: {
      default: { id: 'default', name_he: 'לחיצת חזה על מזרן עם גומייה', equipmentNeeded: ['band'] },
      week5_8: { id: 'week5_8', name_he: 'לחיצת חזה על מזרן עם גומייה בהתנגדות בינונית', equipmentNeeded: ['band'] },
      week9_12_dumbbell: { id: 'week9_12_dumbbell', name_he: 'לחיצת חזה על מזרן עם משקולות יד', equipmentNeeded: ['dumbbell'] },
      week9_12_fallback: { id: 'week9_12_fallback', name_he: 'שכיבות סמיכה', equipmentNeeded: [] },
    },
    progressionNote_he: 'התקדמות עתידית: שימוש במשקל כבד יותר או מעבר לשכיבות סמיכה.',
  },
  c2_side_plank_knees: {
    id: 'c2_side_plank_knees',
    workout: 'B',
    pairId: 'C',
    slot: 'Y',
    name_he: 'פלאנק צדי על הברכיים (Side Plank on Knees)',
    pattern: 'core_lateral',
    repType: 'seconds_per_side',
    targetSets: 2,
    targetReps: [20, 30],
    targetRIR: null,
    cues_he: [
      'שכיבה על הצד, תמיכה על האמה והברכיים כפופות ב-90°',
      'הרמת האגן בקו ישר מברכיים ועד כתף',
      'בטן אסופה',
    ],
    variants: {
      default: { id: 'default', name_he: 'פלאנק צדי על הברכיים', equipmentNeeded: [] },
      week5_8: { id: 'week5_8', name_he: 'פלאנק צדי על הברכיים (זמן מוארך)', equipmentNeeded: [] },
      week9_12_dumbbell: { id: 'week9_12_dumbbell', name_he: 'פלאנק צדי מלא על כפות הרגליים', equipmentNeeded: [] },
      week9_12_fallback: { id: 'week9_12_fallback', name_he: 'פלאנק צדי מלא על כפות הרגליים', equipmentNeeded: [] },
    },
    progressionNote_he: 'התקדמות עתידית: פלאנק צדי מלא על כפות הרגליים.',
  },
};

export const WORKOUTS = {
  A: {
    id: 'A',
    name_he: 'כוח יסוד, שרשרת קדמית ויציבה',
    pairs: [
      { id: 'A', exercises: ['a1_box_squat', 'a2_incline_pushup'] },
      { id: 'B', exercises: ['b1_seated_band_row', 'b2_glute_bridge'] },
      { id: 'C', exercises: ['c1_seated_overhead_band_press', 'c2_bird_dog'] },
    ],
  },
  B: {
    id: 'B',
    name_he: 'שרשרת אחורית, משיכות ושיווי משקל',
    pairs: [
      { id: 'A', exercises: ['a1_band_rdl', 'a2_band_pull_apart'] },
      { id: 'B', exercises: ['b1_supported_reverse_lunge', 'b2_door_lat_pulldown'] },
      { id: 'C', exercises: ['c1_floor_press', 'c2_side_plank_knees'] },
    ],
  },
};

// Superset rest pattern within a pair: [after X set1, after Y set1, after X set2, after Y set2(end of pair)]
export const REST_SECONDS = {
  betweenPairExercise: 40, // ~30-45s
  beforeNextRound: 50, // ~45-60s
  beforeNextPair: 50,
};

export const PHASES = [
  {
    id: '1-4',
    label_he: 'שבועות 1–4: למידת התנועות',
    weekStart: 1,
    weekEnd: 4,
    variantKey: 'default',
    description_he: 'למידת התנועות והטמעת ההרגל. משקל גוף וגומייה קלה. 2 אימונים בשבוע.',
    allowThirdSession: false,
  },
  {
    id: '5-8',
    label_he: 'שבועות 5–8: העלאת עצימות',
    weekStart: 5,
    weekEnd: 8,
    variantKey: 'week5_8',
    description_he: 'שיפוע נמוך יותר בשכיבות סמיכה, סקוואט חופשי ללא כיסא, גומייה בהתנגדות בינונית.',
    allowThirdSession: false,
  },
  {
    id: '9-12',
    label_he: 'שבועות 9–12: הוספת משקולות',
    weekStart: 9,
    weekEnd: 12,
    variantKey: 'week9_12_dumbbell',
    fallbackVariantKey: 'week9_12_fallback',
    description_he: 'שילוב משקולת יד / קטלבל (8–10 ק"ג) לסקוואטים ולדדליפטים, אפשרות להוסיף אימון שלישי בשבוע.',
    allowThirdSession: true,
  },
  {
    id: '13+',
    label_he: 'שבוע 13 ואילך: תחזוקה והתקדמות',
    weekStart: 13,
    weekEnd: null,
    variantKey: 'week9_12_dumbbell',
    fallbackVariantKey: 'week9_12_fallback',
    description_he: 'המשך מחזורי של מבנה שבועות 9–12, עם העמסה פרוגרסיבית הדרגתית (double progression).',
    allowThirdSession: true,
  },
];

export const DOMS_TIP_HE =
  'בשבוע-שבועיים הראשונים ייתכנו כאבי שרירים ביום-יומיים שלאחר האימון — זה טבעי לחלוטין ומעיד על הסתגלות. לא להפסיק! הליכה קלה, שתיית מים ותנועה עדינה יפיגו את הכאב, ותוך 2–3 שבועות זה כמעט ולא יופיע.';

export const NUTRITION_TIPS_HE = [
  'חלבון יומי: כ-1.4–1.6 גרם חלבון לכל ק"ג משקל גוף ביום, מפוזר על פני 3 ארוחות (ביצים, טופו, יוגורט עשיר בחלבון, עוף, דגים, קטניות).',
  '"חטיפי תנועה": בימים ללא אימון, עלייה במדרגות (3–4 קומות, פעמיים ביום) מספקת גירוי לב-ריאה טוב.',
  'שינה: 7–8 שעות — התאוששות השריר והוויסות ההורמונלי מתרחשים בזמן השינה.',
];

export const PAIN_RULE_HE =
  'עבדו סביב הכאב, לא דרכו ("Work around pain, not through it"): עייפות שרירית ומאמץ הם רצויים; כאב חד במפרק או בעמוד השדרה הוא תמרור עצור — הקטינו טווח תנועה, שנו זווית או החליפו תרגיל.';

export const RIR_EXPLANATION_HE =
  'RIR (Reps in Reserve) = כמה חזרות נשארו "בטנק". היעד: RIR 2 — בסיום הסט את צריכה להרגיש שיכולת לעשות עוד כ-2 חזרות בטכניקה נקייה לפני כישלון.';
