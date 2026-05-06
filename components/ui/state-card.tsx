import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type StateCardProps = {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
  tone?: "default" | "destructive" | "loading"
  className?: string
}

export function StateCard({
  title,
  description,
  action,
  icon,
  tone = "default",
  className,
}: StateCardProps) {
  if (tone === "loading") {
    return (
      <div
        className={cn(
          "rounded-xl border bg-background p-6 text-left text-sm shadow-sm",
          className
        )}
      >
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="h-3 w-64 max-w-full rounded bg-muted/80" />
          <div className="h-3 w-48 max-w-[90%] rounded bg-muted/70" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "rounded-xl border bg-background p-10 text-center text-sm shadow-sm",
        tone === "destructive" &&
          "border-destructive/30 bg-destructive/5 text-destructive",
        className
      )}
    >
      {icon ? (
        <div className="mb-3 flex justify-center text-muted-foreground">{icon}</div>
      ) : null}
      <p className="font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-2 text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
