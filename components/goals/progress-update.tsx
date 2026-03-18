"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ProgressUpdateProps = {
  onAdd: (amount: number) => void
}

export function ProgressUpdate({ onAdd }: ProgressUpdateProps) {
  const [value, setValue] = useState("")

  function submit() {
    const amount = Number(value)
    if (!Number.isFinite(amount) || amount <= 0) return
    onAdd(amount)
    setValue("")
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          $
        </span>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit()
          }}
          inputMode="decimal"
          placeholder="Add amount"
          className="pl-7"
          aria-label="Add progress amount"
        />
      </div>
      <Button
        type="button"
        onClick={submit}
        className="bg-indigo-600 text-white hover:bg-indigo-600/90"
      >
        <Plus className="size-4" aria-hidden="true" />
        <span className="ml-2">Update</span>
      </Button>
    </div>
  )
}

