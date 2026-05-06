"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function DemoDataButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    const confirmed = window.confirm(
      "Load demo data and replace your current transactions and goals?"
    )
    if (!confirmed) return

    setLoading(true)
    try {
      const res = await fetch("/api/demo-data", { method: "POST" })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(body?.error ?? "Could not load demo data")
      }

      toast.success("Demo data loaded")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load demo data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={handleClick} disabled={loading}>
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
      {loading ? "Loading demo..." : "Load demo data"}
    </Button>
  )
}
