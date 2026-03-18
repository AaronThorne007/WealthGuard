"use client"

import { Flag } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Goal } from "@/lib/mock/goals"
import { formatCurrency, percent } from "@/lib/mock/goals"
import { cn } from "@/lib/utils"

import { ProgressUpdate } from "./progress-update"

type GoalCardProps = {
  goal: Goal
  onUpdateSaved: (goalId: string, delta: number) => void
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

export function GoalCard({ goal, onUpdateSaved }: GoalCardProps) {
  const p = percent(goal.saved, goal.target)
  const remaining = Math.max(0, goal.target - goal.saved)

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-indigo-50 text-indigo-700">
            <Flag className="size-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 truncate">{goal.title}</span>
        </CardTitle>
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

