import type {
  TransactionCategory,
  TransactionRow,
  TransactionType,
} from "@/components/transactions/transaction-types"

export type TransactionDbRow = {
  id: string
  user_id: string
  date: string
  description: string
  category: string
  type: string
  amount: string | number
  account: string
}

function toFiniteNumber(value: string | number) {
  const parsed = typeof value === "string" ? parseFloat(value) : value
  return Number.isFinite(parsed) ? parsed : 0
}

export function transactionFromDb(row: TransactionDbRow): TransactionRow {
  return {
    id: row.id,
    date: typeof row.date === "string" ? row.date.slice(0, 10) : row.date,
    description: row.description,
    category: row.category as TransactionCategory,
    type: row.type as TransactionType,
    amount: toFiniteNumber(row.amount),
    account: row.account as TransactionRow["account"],
  }
}
