import type { Goal } from "@/components/goals/goal-types"

export type GoalDbRow = {
  id: string
  user_id: string
  title: string
  saved: string | number
  target: string | number
}

function toFiniteNumber(value: string | number) {
  const parsed = typeof value === "string" ? parseFloat(value) : value
  return Number.isFinite(parsed) ? parsed : 0
}

export function goalFromDb(row: GoalDbRow): Goal {
  return {
    id: row.id,
    title: row.title,
    saved: toFiniteNumber(row.saved),
    target: toFiniteNumber(row.target),
  }
}
