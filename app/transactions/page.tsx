"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { TransactionDeleteDialog } from "@/components/transactions/transaction-delete-dialog"
import {
  TransactionFormDialog,
  type TransactionFormValues,
} from "@/components/transactions/transaction-form-dialog"
import { TransactionsTable } from "@/components/transactions/transactions-table"
import { TransactionsToolbar } from "@/components/transactions/transactions-toolbar"
import type { TransactionRow } from "@/components/transactions/transaction-types"
import { StateCard } from "@/components/ui/state-card"
import { transactionFromDb, type TransactionDbRow } from "@/lib/transactions/db-row"
import { createClient } from "@/lib/supabase/client"

export default function TransactionsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [allRows, setAllRows] = useState<TransactionRow[] | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editing, setEditing] = useState<TransactionRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TransactionRow | null>(null)

  const loadTransactions = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setAllRows([])
      return
    }

    const { data, error } = await supabase
      .from("transactions")
      .select(
        "id, user_id, date, description, category, type, amount, account"
      )
      .eq("user_id", user.id)
      .order("date", { ascending: false })

    if (error) {
      toast.error(error.message)
      setAllRows([])
      return
    }

    const rows = (data as TransactionDbRow[]).map(transactionFromDb)
    setAllRows(rows)
  }, [])

  useEffect(() => {
    // Initial client-side fetch; this component intentionally hydrates data into local state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTransactions()
  }, [loadTransactions])

  const filterActive = category !== "all" || search.trim().length > 0

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()

    return [...(allRows ?? [])]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((t) => {
        if (category !== "all" && t.category !== category) return false
        if (!q) return true
        return t.description.toLowerCase().includes(q)
      })
  }, [allRows, search, category])

  const openCreate = () => {
    setFormMode("create")
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (row: TransactionRow) => {
    setFormMode("edit")
    setEditing(row)
    setFormOpen(true)
  }

  const handleFormSubmit = async (values: TransactionFormValues) => {
    const supabase = createClient()
    const payload = {
      date: values.date,
      description: values.description,
      category: values.category,
      type: values.type,
      amount: values.amount,
      account: values.account,
    }

    if (formMode === "create") {
      const { error } = await supabase.from("transactions").insert(payload)
      if (error) {
        toast.error(error.message)
        throw new Error(error.message)
      }
      toast.success("Transaction added")
    } else if (editing) {
      const { error } = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", editing.id)
      if (error) {
        toast.error(error.message)
        throw new Error(error.message)
      }
      toast.success("Transaction updated")
    }

    await loadTransactions()
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    const supabase = createClient()
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", deleteTarget.id)

    if (error) {
      toast.error(error.message)
      throw new Error(error.message)
    }
    toast.success("Transaction deleted")
    await loadTransactions()
  }

  return (
    <div className="space-y-6">
      <TransactionsToolbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        onAddTransaction={openCreate}
      />

      {allRows === null ? (
        <StateCard tone="loading" title="Loading transactions..." />
      ) : (
        <TransactionsTable
          rows={rows}
          filterActive={filterActive}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      )}

      <TransactionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initial={editing}
        onSubmit={handleFormSubmit}
      />

      <TransactionDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        description={deleteTarget?.description ?? ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
