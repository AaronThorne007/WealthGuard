export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

/** Display label for a calendar month; `ymd` is yyyy-mm-dd (UTC month matches dashboard aggregates). */
export function formatCalendarMonthLabel(ymd: string) {
  const match = /^(\d{4})-(\d{2})/.exec(ymd)
  if (!match) return ymd
  const y = Number(match[1])
  const m = Number(match[2]) - 1
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m, 1)))
}

/** e.g. "April 11, 2026" for yyyy-mm-dd (UTC date parts). */
export function formatDateLong(ymd: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(ymd)
  if (!match) return ymd
  const y = Number(match[1])
  const mo = Number(match[2]) - 1
  const d = Number(match[3])
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, mo, d)))
}
