"use client"

import { useEffect, useState } from "react"

import type { Goal } from "@/components/goals/goal-types"
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

export type GoalFormValues = {
  title: string
  target: number
  saved: number
}

type GoalFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initial: Goal | null
  onSubmit: (values: GoalFormValues) => Promise<void>
}

export function GoalFormDialog({
  open,
  onOpenChange,
  mode,
  initial,
  onSubmit,
}: GoalFormDialogProps) {
  const [title, setTitle] = useState("")
  const [targetStr, setTargetStr] = useState("")
  const [savedStr, setSavedStr] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (mode === "edit" && initial) {
      setTitle(initial.title)
      setTargetStr(String(initial.target))
      setSavedStr(String(initial.saved))
    } else {
      setTitle("")
      setTargetStr("")
      setSavedStr("0")
    }
  }, [open, mode, initial])

  const handleSave = async () => {
    const trimmed = title.trim()
    if (!trimmed) return

    const target = parseFloat(targetStr)
    if (!Number.isFinite(target) || target <= 0) return

    let saved = 0
    if (mode === "edit") {
      saved = parseFloat(savedStr)
      if (!Number.isFinite(saved) || saved < 0) return
    }

    setSaving(true)
    try {
      await onSubmit({ title: trimmed, target, saved })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  const targetValid = Number.isFinite(parseFloat(targetStr)) && parseFloat(targetStr) > 0
  const savedValid =
    mode === "create" ||
    (Number.isFinite(parseFloat(savedStr)) && parseFloat(savedStr) >= 0)
  const canSave = title.trim().length > 0 && targetValid && savedValid && !saving

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "New goal" : "Edit goal"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 py-1">
          <div className="grid gap-1.5">
            <Label htmlFor="goal-title">Title</Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Emergency fund"
              autoComplete="off"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="goal-target">Target (USD)</Label>
            <Input
              id="goal-target"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={targetStr}
              onChange={(e) => setTargetStr(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {mode === "edit" && (
            <div className="grid gap-1.5">
              <Label htmlFor="goal-saved">Saved so far (USD)</Label>
              <Input
                id="goal-saved"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={savedStr}
                onChange={(e) => setSavedStr(e.target.value)}
                placeholder="0.00"
              />
            </div>
          )}
        </div>

        <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="brand"
            disabled={!canSave}
            onClick={handleSave}
          >
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
