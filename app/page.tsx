import Link from "next/link"
import { ArrowRight, BarChart3, Flag, HandCoins } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-9rem)] w-full max-w-3xl items-center py-8">
      <Card className="w-full shadow-sm">
        <CardContent className="space-y-6 p-8 sm:p-10">
          <div className="space-y-3 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Welcome to WealthGuard
            </h1>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
              A simple personal finance tracker for transactions, goals, and
              yearly spending insights.
            </p>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg border bg-background p-3 text-center">
              <HandCoins
                className="mx-auto mb-2 size-4 text-indigo-600"
                aria-hidden="true"
              />
              Track transactions
            </div>
            <div className="rounded-lg border bg-background p-3 text-center">
              <BarChart3
                className="mx-auto mb-2 size-4 text-indigo-600"
                aria-hidden="true"
              />
              View yearly trends
            </div>
            <div className="rounded-lg border bg-background p-3 text-center">
              <Flag
                className="mx-auto mb-2 size-4 text-indigo-600"
                aria-hidden="true"
              />
              Manage savings goals
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild variant="brand">
              <Link href="/dashboard">
                Enter dashboard <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            Choose an option to continue.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
