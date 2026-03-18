"use client"

import { useMemo, useState } from "react"

import { TransactionsTable } from "@/components/transactions/transactions-table"
import { TransactionsToolbar } from "@/components/transactions/transactions-toolbar"
import type { TransactionRow } from "@/components/transactions/transaction-types"
import { mockTransactions } from "@/lib/mock/transactions"
 
 export default function TransactionsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()

    return [...mockTransactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((t) => {
        if (category !== "all" && t.category !== category) return false
        if (!q) return true
        return t.description.toLowerCase().includes(q)
      })
  }, [search, category])

   return (
    <div className="space-y-4">
      <TransactionsToolbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
      />

      <TransactionsTable rows={rows as TransactionRow[]} />
    </div>
   )
 }
