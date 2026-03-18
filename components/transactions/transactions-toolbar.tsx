"use client"

import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { transactionCategories } from "@/lib/mock/transactions"

type TransactionsToolbarProps = {
  title?: string
  search: string
  onSearchChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
}

export function TransactionsToolbar({
  title = "Transactions",
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: TransactionsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </div>
        <div className="text-sm text-muted-foreground">
          Static UI with mock data (ready to wire to real data later)
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative sm:w-[260px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search description…"
            className="pl-9"
            aria-label="Search transactions"
          />
        </div>

        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="sm:w-[190px]" aria-label="Filter by category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {transactionCategories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="bg-indigo-600 text-white hover:bg-indigo-600/90">
          <Plus className="size-4" aria-hidden="true" />
          <span className="ml-2">Add Transaction</span>
        </Button>
      </div>
    </div>
  )
}

