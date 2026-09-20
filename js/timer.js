// Reusable countdown timer: timestamp-based (survives backgrounding/close+reopen),
// optional audio beep + vibration on completion, pause/resume/skip.

let audioCtx = null;

function ensureAudioContext() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Call once on the first user tap in a session to satisfy mobile autoplay policies.
export function primeAudio() {
  ensureAudioContext();
}

export function playBeep(enabled) {
  if (!enabled) return;
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}

export function vibrate(enabled) {
  if (!enabled) return;
  if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
}

// Creates a countdown controller bound to an absolute end timestamp (ms epoch).
// onTick(remainingSeconds), onComplete() called once when it crosses zero.
export function createCountdown({ endsAt, onTick, onComplete }) {
  let intervalId = null;
  let paused = false;
  let pauseRemainingMs = null;
  let completed = false;
  let currentEndsAt = endsAt;

  function tick() {
    if (paused) return;
    const remainingMs = currentEndsAt - Date.now();
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    onTick(remainingSeconds);
    if (remainingMs <= 0 && !completed) {
      completed = true;
      stop();
      onComplete();
    }
  }

  function start() {
    stop();
    intervalId = window.setInterval(tick, 250);
    tick();
  }

  function stop() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function pause() {
    if (paused) return;
    paused = true;
    pauseRemainingMs = currentEndsAt - Date.now();
  }

  function resume() {
    if (!paused) return;
    paused = false;
    currentEndsAt = Date.now() + (pauseRemainingMs || 0);
  }

  function skip() {
    currentEndsAt = Date.now();
    tick();
  }

  start();
  return { stop, pause, resume, skip, get endsAt() { return currentEndsAt; } };
}
