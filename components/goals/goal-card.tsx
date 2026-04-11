"use client"

import { Flag, MoreVertical, Pencil, Trash2 } from "lucide-react"

import type { Goal } from "@/components/goals/goal-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency, percent } from "@/lib/goals/format"
import { cn } from "@/lib/utils"

import { ProgressUpdate } from "./progress-update"

type GoalCardProps = {
  goal: Goal
  onUpdateSaved: (goalId: string, delta: number) => void
  onEdit: (goal: Goal) => void
  onDelete: (goal: Goal) => void
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-[width]"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export function GoalCard({ goal, onUpdateSaved, onEdit, onDelete }: GoalCardProps) {
  const p = percent(goal.saved, goal.target)
  const remaining = Math.max(0, goal.target - goal.saved)

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex min-w-0 flex-1 items-center gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-700">
              <Flag className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 truncate">{goal.title}</span>
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Goal actions"
              >
                <MoreVertical className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(goal)}>
                <Pencil className="mr-2 size-4" aria-hidden="true" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(goal)}
              >
                <Trash2 className="mr-2 size-4" aria-hidden="true" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Saved</div>
            <div className="text-lg font-semibold tabular-nums">
              {formatCurrency(goal.saved)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Target</div>
            <div className="text-lg font-semibold tabular-nums">
              {formatCurrency(goal.target)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className={cn("tabular-nums", p === 100 && "text-emerald-700")}>
              {p}%
            </span>
          </div>
          <ProgressBar value={p} />
          <div className="text-xs text-muted-foreground">
            {remaining === 0 ? (
              <span className="font-medium text-emerald-700">Goal reached.</span>
            ) : (
              <span>
                {formatCurrency(remaining)} remaining
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-foreground">Update progress</div>
          <ProgressUpdate onAdd={(amount) => onUpdateSaved(goal.id, amount)} />
        </div>
      </CardContent>
    </Card>
  )
}
