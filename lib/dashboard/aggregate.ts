import type {
  TransactionCategory,
  TransactionRow,
} from "@/components/transactions/transaction-types"

export type DailySpendPoint = { date: string; spend: number }

export type CategorySpendPoint = {
  category: string
  spend: number
  color: string
}

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  Income: "#16a34a",
  Rent: "#4f46e5",
  Groceries: "#7c3aed",
  Dining: "#a855f7",
  Transport: "#0ea5e9",
  Bills: "#6366f1",
  Shopping: "#f97316",
  Entertainment: "#22c55e",
  Other: "#64748b",
}

/** Inclusive yyyy-mm-dd range for the UTC calendar month of `reference`. */
export function utcCalendarMonthRange(reference = new Date()): {
  start: string
  end: string
} {
  const y = reference.getUTCFullYear()
  const m = reference.getUTCMonth()
  const pad = (n: number) => String(n).padStart(2, "0")
  const start = `${y}-${pad(m + 1)}-01`
  const lastDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate()
  const end = `${y}-${pad(m + 1)}-${pad(lastDay)}`
  return { start, end }
}

export type DashboardAggregates = {
  balance: number
  monthlyIncome: number
  monthlyExpenses: number
  dailySpending: DailySpendPoint[]
  spendingByCategory: CategorySpendPoint[]
}

export function aggregateDashboard(
  rows: TransactionRow[],
  monthRange: { start: string; end: string } = utcCalendarMonthRange()
): DashboardAggregates {
  const inMonth = (d: string) => d >= monthRange.start && d <= monthRange.end

  let balance = 0
  for (const t of rows) {
    balance += t.type === "income" ? t.amount : -t.amount
  }

  const monthlyRows = rows.filter((t) => inMonth(t.date))
  let monthlyIncome = 0
  let monthlyExpenses = 0
  for (const t of monthlyRows) {
    if (t.type === "income") monthlyIncome += t.amount
    else monthlyExpenses += t.amount
  }

  const dailyMap = new Map<string, number>()
  for (const t of monthlyRows) {
    if (t.type !== "expense") continue
    dailyMap.set(t.date, (dailyMap.get(t.date) ?? 0) + t.amount)
  }
  const dailySpending = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, spend]) => ({ date, spend: Number(spend.toFixed(2)) }))

  const catMap = new Map<string, number>()
  for (const t of monthlyRows) {
    if (t.type !== "expense") continue
    catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount)
  }
  const spendingByCategory = Array.from(catMap.entries())
    .map(([category, spend]) => ({
      category,
      spend: Number(spend.toFixed(2)),
      color:
        CATEGORY_COLORS[category as TransactionCategory] ?? "#64748b",
    }))
    .sort((a, b) => b.spend - a.spend)

  return {
    balance,
    monthlyIncome,
    monthlyExpenses,
    dailySpending,
    spendingByCategory,
  }
}
