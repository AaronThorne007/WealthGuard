"use client"

import type { Goal } from "@/components/goals/goal-types"

import { GoalCard } from "./goal-card"

type GoalsGridProps = {
  goals: Goal[]
  onUpdateSaved: (goalId: string, delta: number) => void
  onEdit: (goal: Goal) => void
  onDelete: (goal: Goal) => void
}

export function GoalsGrid({
  goals,
  onUpdateSaved,
  onEdit,
  onDelete,
}: GoalsGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {goals.map((g) => (
        <GoalCard
          key={g.id}
          goal={g}
          onUpdateSaved={onUpdateSaved}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  )
}
