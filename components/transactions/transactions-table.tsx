"use client"

import { ArrowDown, ArrowUp } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { TransactionRow } from "./transaction-types"
import { formatCurrency, formatDateShort } from "./transaction-types"

type TransactionsTableProps = {
  rows: TransactionRow[]
}

function AmountCell({ type, amount }: { type: TransactionRow["type"]; amount: number }) {
  const isIncome = type === "income"
  const sign = isIncome ? "+" : "-"

  return (
    <div className={cn("flex items-center justify-end gap-1 tabular-nums", isIncome ? "text-emerald-700" : "text-rose-700")}>
      {isIncome ? <ArrowUp className="size-4" aria-hidden="true" /> : <ArrowDown className="size-4" aria-hidden="true" />}
      <span>
        {sign}
        {formatCurrency(amount)}
      </span>
    </div>
  )
}

export function TransactionsTable({ rows }: TransactionsTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">
        No transactions match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-[140px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden lg:table-cell">Account</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((tx) => (
            <TableRow key={tx.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{formatDateShort(tx.date)}</TableCell>
              <TableCell className="max-w-[420px] truncate">
                {tx.description}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {tx.category}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {tx.account}
              </TableCell>
              <TableCell className="text-right">
                <AmountCell type={tx.type} amount={tx.amount} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

