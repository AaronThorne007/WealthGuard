export type Transaction = {
  id: string
  date: string // yyyy-mm-dd
  name: string
  category:
    | "Rent"
    | "Groceries"
    | "Dining"
    | "Transport"
    | "Bills"
    | "Shopping"
    | "Entertainment"
    | "Other"
  amount: number // positive = income, negative = expense
}

export type DailySpendPoint = { date: string; spend: number }
export type CategorySpendPoint = {
  category: Transaction["category"]
  spend: number
  color: string
}

export const mockTransactions: Transaction[] = [
  { id: "t1", date: "2026-03-01", name: "Paycheck", category: "Other", amount: 2400 },
  { id: "t2", date: "2026-03-01", name: "Rent", category: "Rent", amount: -1200 },
  { id: "t3", date: "2026-03-02", name: "Grocery run", category: "Groceries", amount: -86.34 },
  { id: "t4", date: "2026-03-02", name: "Subway card", category: "Transport", amount: -25 },
  { id: "t5", date: "2026-03-03", name: "Coffee", category: "Dining", amount: -4.85 },
  { id: "t6", date: "2026-03-03", name: "Phone bill", category: "Bills", amount: -55 },
  { id: "t7", date: "2026-03-04", name: "Streaming", category: "Entertainment", amount: -15.99 },
  { id: "t8", date: "2026-03-04", name: "Lunch", category: "Dining", amount: -13.2 },
  { id: "t9", date: "2026-03-05", name: "Grocery top-up", category: "Groceries", amount: -32.12 },
  { id: "t10", date: "2026-03-05", name: "Gift", category: "Other", amount: 40 },
  { id: "t11", date: "2026-03-06", name: "Pharmacy", category: "Other", amount: -18.73 },
  { id: "t12", date: "2026-03-06", name: "Dinner", category: "Dining", amount: -27.5 },
  { id: "t13", date: "2026-03-07", name: "Bus", category: "Transport", amount: -2.9 },
  { id: "t14", date: "2026-03-07", name: "Snacks", category: "Groceries", amount: -9.41 },
  { id: "t15", date: "2026-03-08", name: "Movie", category: "Entertainment", amount: -14 },
  { id: "t16", date: "2026-03-08", name: "Shoes", category: "Shopping", amount: -64.99 },
  { id: "t17", date: "2026-03-09", name: "Lunch", category: "Dining", amount: -11.65 },
  { id: "t18", date: "2026-03-09", name: "Electric", category: "Bills", amount: -72.18 },
  { id: "t19", date: "2026-03-10", name: "Grocery run", category: "Groceries", amount: -93.57 },
  { id: "t20", date: "2026-03-10", name: "Ride share", category: "Transport", amount: -18.4 },
  { id: "t21", date: "2026-03-11", name: "Paycheck", category: "Other", amount: 1200 },
  { id: "t22", date: "2026-03-11", name: "Takeout", category: "Dining", amount: -22.75 },
  { id: "t23", date: "2026-03-12", name: "Grocery top-up", category: "Groceries", amount: -41.6 },
  { id: "t24", date: "2026-03-12", name: "Game", category: "Entertainment", amount: -19.99 },
  { id: "t25", date: "2026-03-13", name: "Laundry", category: "Other", amount: -12.5 },
  { id: "t26", date: "2026-03-13", name: "Metro", category: "Transport", amount: -2.9 },
  { id: "t27", date: "2026-03-14", name: "Dinner", category: "Dining", amount: -35.1 },
  { id: "t28", date: "2026-03-14", name: "Groceries", category: "Groceries", amount: -58.23 },
]

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function sumIncome(transactions: Transaction[]) {
  return transactions.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0)
}

export function sumExpenses(transactions: Transaction[]) {
  return (
    transactions
      .filter((t) => t.amount < 0)
      .reduce((a, t) => a + Math.abs(t.amount), 0)
  )
}

export function calcBalance(transactions: Transaction[]) {
  return transactions.reduce((a, t) => a + t.amount, 0)
}

function toDailySpend(transactions: Transaction[]) {
  const map = new Map<string, number>()
  for (const t of transactions) {
    if (t.amount >= 0) continue
    map.set(t.date, (map.get(t.date) ?? 0) + Math.abs(t.amount))
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, spend]) => ({ date, spend: Number(spend.toFixed(2)) }))
}

function toCategorySpend(transactions: Transaction[]) {
  const map = new Map<Transaction["category"], number>()
  for (const t of transactions) {
    if (t.amount >= 0) continue
    map.set(t.category, (map.get(t.category) ?? 0) + Math.abs(t.amount))
  }

  const colors: Record<Transaction["category"], string> = {
    Rent: "#4f46e5",
    Groceries: "#7c3aed",
    Dining: "#a855f7",
    Transport: "#0ea5e9",
    Bills: "#6366f1",
    Shopping: "#f97316",
    Entertainment: "#22c55e",
    Other: "#64748b",
  }

  return Array.from(map.entries())
    .map(([category, spend]) => ({
      category,
      spend: Number(spend.toFixed(2)),
      color: colors[category],
    }))
    .sort((a, b) => b.spend - a.spend)
}

export const mockDashboard = {
  balance: calcBalance(mockTransactions),
  monthlyIncome: sumIncome(mockTransactions),
  monthlyExpenses: sumExpenses(mockTransactions),
  dailySpending: toDailySpend(mockTransactions) satisfies DailySpendPoint[],
  spendingByCategory: toCategorySpend(mockTransactions) satisfies CategorySpendPoint[],
}

