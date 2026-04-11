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

export function transactionFromDb(row: TransactionDbRow): TransactionRow {
  return {
    id: row.id,
    date: typeof row.date === "string" ? row.date.slice(0, 10) : row.date,
    description: row.description,
    category: row.category as TransactionCategory,
    type: row.type as TransactionType,
    amount: typeof row.amount === "string" ? parseFloat(row.amount) : row.amount,
    account: row.account as TransactionRow["account"],
  }
}
