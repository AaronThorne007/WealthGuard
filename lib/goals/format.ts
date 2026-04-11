export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function percent(saved: number, target: number) {
  if (target <= 0) return 0
  return clamp(Math.round((saved / target) * 100), 0, 100)
}
