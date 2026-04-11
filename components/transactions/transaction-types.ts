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

export type TransactionAccount = "Checking" | "Savings" | "Cash"

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  "Income",
  "Rent",
  "Groceries",
  "Dining",
  "Transport",
  "Bills",
  "Shopping",
  "Entertainment",
  "Other",
]

export const TRANSACTION_ACCOUNTS: TransactionAccount[] = [
  "Checking",
  "Savings",
  "Cash",
]

export type TransactionRow = {
  id: string
  date: string // yyyy-mm-dd
  description: string
  category: TransactionCategory
  type: TransactionType
  amount: number // always positive; use `type` for direction
  account: TransactionAccount
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

