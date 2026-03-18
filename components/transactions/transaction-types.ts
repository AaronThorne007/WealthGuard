export type TransactionCategory =
  | "Income"
  | "Rent"
  | "Groceries"
  | "Dining"
  | "Transport"
  | "Bills"
  | "Shopping"
  | "Entertainment"
  | "Other"

export type TransactionType = "income" | "expense"

export type TransactionRow = {
  id: string
  date: string // yyyy-mm-dd
  description: string
  category: TransactionCategory
  type: TransactionType
  amount: number // always positive; use `type` for direction
  account: "Checking" | "Savings" | "Cash"
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDateShort(iso: string) {
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

