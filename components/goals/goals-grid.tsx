"use client"

import type { Goal } from "@/lib/mock/goals"
import { GoalCard } from "./goal-card"

type GoalsGridProps = {
  goals: Goal[]
  onUpdateSaved: (goalId: string, delta: number) => void
}

export function GoalsGrid({ goals, onUpdateSaved }: GoalsGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {goals.map((g) => (
        <GoalCard key={g.id} goal={g} onUpdateSaved={onUpdateSaved} />
      ))}
    </section>
  )
}

