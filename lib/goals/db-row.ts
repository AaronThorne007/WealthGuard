import type { Goal } from "@/components/goals/goal-types"

export type GoalDbRow = {
  id: string
  user_id: string
  title: string
  saved: string | number
  target: string | number
}

export function goalFromDb(row: GoalDbRow): Goal {
  return {
    id: row.id,
    title: row.title,
    saved: typeof row.saved === "string" ? parseFloat(row.saved) : row.saved,
    target: typeof row.target === "string" ? parseFloat(row.target) : row.target,
  }
}
