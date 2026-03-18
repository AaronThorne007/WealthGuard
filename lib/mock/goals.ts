export type Goal = {
  id: string
  title: string
  saved: number
  target: number
}

export const mockGoals: Goal[] = [
  { id: "g1", title: "Emergency fund", saved: 850, target: 2000 },
  { id: "g2", title: "Laptop upgrade", saved: 320, target: 1200 },
  { id: "g3", title: "Summer trip", saved: 150, target: 900 },
]

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

