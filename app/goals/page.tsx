"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { GoalsGrid } from "@/components/goals/goals-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mockGoals, type Goal } from "@/lib/mock/goals"
 
 export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals)

  function updateSaved(goalId: string, delta: number) {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, saved: g.saved + delta } : g))
    )
  }

   return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-lg font-semibold tracking-tight text-foreground">
            Goals
          </div>
          <div className="text-sm text-muted-foreground">
            Static UI with mock data (manual progress updates)
          </div>
        </div>

        <Button className="bg-indigo-600 text-white hover:bg-indigo-600/90">
          <Plus className="size-4" aria-hidden="true" />
          <span className="ml-2">Create New Goal</span>
        </Button>
      </div>

      <GoalsGrid goals={goals} onUpdateSaved={updateSaved} />

      <Card>
        <CardContent className="py-4 text-sm text-muted-foreground">
          Ready for later: replace the mock goals array with real rows from
          Supabase, and swap the update handler to write changes to the database.
        </CardContent>
      </Card>
    </div>
   )
 }
