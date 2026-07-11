/** @param {number | string} value */
function pad(value) {
  return String(value).padStart(2, '0');
}

const TARGET_DATE = new Date('2028-01-01T00:00:00');

export const clock = $state({
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00',
});

export function tickCountdown() {
  const diff = Math.max(0, TARGET_DATE.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);

  clock.days = pad(Math.floor(totalSeconds / 86400));
  clock.hours = pad(Math.floor((totalSeconds % 86400) / 3600));
  clock.minutes = pad(Math.floor((totalSeconds % 3600) / 60));
  clock.seconds = pad(totalSeconds % 60);
}

/** @type {ReturnType<typeof setInterval> | null} */
let intervalId = null;

export function ensureCountdown() {
  tickCountdown();
  if (intervalId != null) return;
  intervalId = setInterval(tickCountdown, 1000);
}
