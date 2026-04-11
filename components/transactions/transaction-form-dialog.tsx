"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TRANSACTION_ACCOUNTS,
  TRANSACTION_CATEGORIES,
  type TransactionCategory,
  type TransactionRow,
  type TransactionType,
} from "@/components/transactions/transaction-types"

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function categoryDefaultType(category: TransactionCategory): TransactionType {
  return category === "Income" ? "income" : "expense"
}

export type TransactionFormValues = {
  date: string
  description: string
  category: TransactionCategory
  type: TransactionType
  amount: number
  account: TransactionRow["account"]
}

type TransactionFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initial: TransactionRow | null
  onSubmit: (values: TransactionFormValues) => Promise<void>
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  mode,
  initial,
  onSubmit,
}: TransactionFormDialogProps) {
  const [date, setDate] = useState(todayIso)
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<TransactionCategory>("Other")
  const [type, setType] = useState<TransactionType>("expense")
  const [amountStr, setAmountStr] = useState("")
  const [account, setAccount] = useState<TransactionRow["account"]>("Checking")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (mode === "edit" && initial) {
      setDate(initial.date)
      setDescription(initial.description)
      setCategory(initial.category)
      setType(initial.type)
      setAmountStr(String(initial.amount))
      setAccount(initial.account)
    } else {
      setDate(todayIso())
      setDescription("")
      setCategory("Other")
      setType("expense")
      setAmountStr("")
      setAccount("Checking")
    }
  }, [open, mode, initial])

  const handleCategoryChange = (value: TransactionCategory) => {
    setCategory(value)
    setType(categoryDefaultType(value))
  }

  const handleSave = async () => {
    const trimmed = description.trim()
    if (!trimmed) return

    const amount = parseFloat(amountStr)
    if (!Number.isFinite(amount) || amount <= 0) return

    setSaving(true)
    try {
      await onSubmit({
        date,
        description: trimmed,
        category,
        type,
        amount,
        account,
      })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  const amountValid = Number.isFinite(parseFloat(amountStr)) && parseFloat(amountStr) > 0
  const canSave = description.trim().length > 0 && amountValid && !saving

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add transaction" : "Edit transaction"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 py-1">
          <div className="grid gap-1.5">
            <Label htmlFor="tx-date">Date</Label>
            <Input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="tx-description">Description</Label>
            <Input
              id="tx-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Grocery run"
              autoComplete="off"
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(v) => handleCategoryChange(v as TransactionCategory)}
            >
              <SelectTrigger aria-label="Category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as TransactionType)}
            >
              <SelectTrigger aria-label="Income or expense">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="tx-amount">Amount (USD)</Label>
            <Input
              id="tx-amount"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Account</Label>
            <Select
              value={account}
              onValueChange={(v) => setAccount(v as TransactionRow["account"])}
            >
              <SelectTrigger aria-label="Account">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_ACCOUNTS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-indigo-600 text-white hover:bg-indigo-600/90"
            disabled={!canSave}
            onClick={handleSave}
          >
            {saving ? "Saving…" : mode === "create" ? "Add" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
