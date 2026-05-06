"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { GoalDeleteDialog } from "@/components/goals/goal-delete-dialog"
import {
  GoalFormDialog,
  type GoalFormValues,
} from "@/components/goals/goal-form-dialog"
import { GoalsGrid } from "@/components/goals/goals-grid"
import type { Goal } from "@/components/goals/goal-types"
import { Button } from "@/components/ui/button"
import { StateCard } from "@/components/ui/state-card"
import { createClient } from "@/lib/supabase/client"
import { goalFromDb, type GoalDbRow } from "@/lib/goals/db-row"
import { clamp } from "@/lib/goals/format"

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[] | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editing, setEditing] = useState<Goal | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null)

  const loadGoals = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setGoals([])
      return
    }

    const { data, error } = await supabase
      .from("goals")
      .select("id, user_id, title, saved, target")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      toast.error(error.message)
      setGoals([])
      return
    }

    const rows = (data as GoalDbRow[]).map(goalFromDb)
    setGoals(rows)
  }, [])

  useEffect(() => {
    // Initial client-side fetch; this component intentionally hydrates data into local state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadGoals()
  }, [loadGoals])

  const openCreate = () => {
    setFormMode("create")
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (goal: Goal) => {
    setFormMode("edit")
    setEditing(goal)
    setFormOpen(true)
  }

  const handleFormSubmit = async (values: GoalFormValues) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error("You must be signed in")
      throw new Error("Not signed in")
    }

    if (formMode === "create") {
      const { error } = await supabase.from("goals").insert({
        title: values.title,
        target: values.target,
        saved: 0,
      })

      if (error) {
        toast.error(error.message)
        throw new Error(error.message)
      }
      toast.success("Goal created")
    } else if (editing) {
      const nextSaved = clamp(values.saved, 0, values.target)
      const { error } = await supabase
        .from("goals")
        .update({
          title: values.title,
          target: values.target,
          saved: nextSaved,
        })
        .eq("id", editing.id)

      if (error) {
        toast.error(error.message)
        throw new Error(error.message)
      }
      toast.success("Goal updated")
    }

    await loadGoals()
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    const supabase = createClient()
    const { error } = await supabase.from("goals").delete().eq("id", deleteTarget.id)

    if (error) {
      toast.error(error.message)
      throw new Error(error.message)
    }
    toast.success("Goal deleted")
    await loadGoals()
  }

  const handleUpdateSaved = async (goalId: string, delta: number) => {
    const goal = goals?.find((g) => g.id === goalId)
    if (!goal) return

    const nextSaved = clamp(goal.saved + delta, 0, goal.target)
    if (nextSaved === goal.saved) return

    const supabase = createClient()
    const { error } = await supabase
      .from("goals")
      .update({ saved: nextSaved })
      .eq("id", goalId)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Progress updated")
    await loadGoals()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Goals
          </h1>
          <p className="text-sm text-muted-foreground">
            Track savings targets and update progress
          </p>
        </div>

        <Button
          type="button"
          onClick={openCreate}
          className="bg-indigo-600 text-white hover:bg-indigo-600/90"
        >
          <Plus className="size-4" aria-hidden="true" />
          <span className="ml-2">Create New Goal</span>
        </Button>
      </div>

      {goals === null ? (
        <StateCard tone="loading" title="Loading goals..." />
      ) : goals.length === 0 ? (
        <StateCard
          title="No goals yet"
          description="Create your first goal to start tracking savings progress."
        />
      ) : (
        <GoalsGrid
          goals={goals}
          onUpdateSaved={handleUpdateSaved}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      )}

      <GoalFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initial={editing}
        onSubmit={handleFormSubmit}
      />

      <GoalDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title={deleteTarget?.title ?? ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
