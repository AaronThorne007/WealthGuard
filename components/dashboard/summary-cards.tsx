import Link from "next/link"
import { Wallet } from "lucide-react"

import { DemoDataButton } from "@/components/dashboard/demo-data-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/dashboard/format"
import { cn } from "@/lib/utils"

type SummaryCardsProps = {
  balance: number
  monthlyIncome: number
  monthlyExpenses: number
  periodLabel: string
}

function StatCard({
  title,
  value,
  helper,
  badge,
  className,
}: {
  title: string
  value: string
  helper?: string
  badge?: string
  className?: string
}) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        {badge ? (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {badge}
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </div>
        {helper ? (
          <div className="text-xs text-muted-foreground">{helper}</div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function SummaryCards({
  balance,
  monthlyIncome,
  monthlyExpenses,
  periodLabel,
}: SummaryCardsProps) {
  const monthlyNet = monthlyIncome - monthlyExpenses
  const monthlyHealth = monthlyNet >= 0 ? "Surplus" : "Deficit"
  const spendingRatio =
    monthlyIncome > 0 ? Math.round((monthlyExpenses / monthlyIncome) * 100) : 0

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total balance"
        value={formatCurrency(balance)}
        helper="Net of all income and expenses"
        badge={balance >= 0 ? "Positive" : "Negative"}
        className="border-indigo-100"
      />
      <StatCard
        title="Yearly income"
        value={formatCurrency(monthlyIncome)}
        helper={`Income in ${periodLabel}`}
        badge={monthlyHealth}
      />
      <StatCard
        title="Yearly expenses"
        value={formatCurrency(monthlyExpenses)}
        helper={`Expenses in ${periodLabel}`}
        badge={`${spendingRatio}% of income`}
      />

      <Card className="md:col-span-3">
        <CardContent className="flex flex-col gap-3 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="grid size-9 place-items-center rounded-lg bg-indigo-50 text-indigo-700">
            <Wallet className="size-4" aria-hidden="true" />
            </span>
            <span>Showing data for {periodLabel}</span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild size="sm" className="bg-indigo-600 text-white hover:bg-indigo-600/90">
              <Link href="/transactions">+ Add transaction</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/goals">Create goal</Link>
            </Button>
            <DemoDataButton />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
