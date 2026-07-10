// `.toISOString()` is always UTC, which silently shifts "today" to the
// wrong calendar day for anyone west of UTC once local time passes
// midnight UTC (e.g. from ~7pm in Peru, UTC-5) — every calendar-day
// computation in this app must go through local Date getters instead.
export function toLocalISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// `new Date("YYYY-MM-DD")` parses the string as UTC midnight (per spec),
// which is the wrong instant for a bare calendar-date string that's meant
// to represent a local day — the 3-arg Date constructor is local-time
// based and doesn't have that ambiguity.
export function parseLocalISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function todayISODate(): string {
  return toLocalISODate(new Date());
}

const BARE_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Accepts either a bare "YYYY-MM-DD" calendar day or a full timestamp for
// either argument — a bare string already unambiguously names a local day,
// while a timestamp needs its local calendar day extracted first.
function normalizeToLocalDateString(input: string): string {
  return BARE_DATE_RE.test(input) ? input : toLocalISODate(new Date(input));
}

export function isSameDay(isoA: string, isoB: string): boolean {
  return normalizeToLocalDateString(isoA) === normalizeToLocalDateString(isoB);
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
