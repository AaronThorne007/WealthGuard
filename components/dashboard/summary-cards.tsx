import Link from "next/link"
import { Wallet } from "lucide-react"

import { DemoDataButton } from "@/components/dashboard/demo-data-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/dashboard/format"
import { cn } from "@/lib/utils"

type SummaryCardsProps = {
  balance: number
  yearlyIncome: number
  yearlyExpenses: number
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
  yearlyIncome,
  yearlyExpenses,
  periodLabel,
}: SummaryCardsProps) {
  const yearlyNet = yearlyIncome - yearlyExpenses
  const yearlyHealth = yearlyNet >= 0 ? "Surplus" : "Deficit"
  const spendingRatio =
    yearlyIncome > 0 ? Math.round((yearlyExpenses / yearlyIncome) * 100) : 0

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
        value={formatCurrency(yearlyIncome)}
        helper={`Income in ${periodLabel}`}
        badge={yearlyHealth}
      />
      <StatCard
        title="Yearly expenses"
        value={formatCurrency(yearlyExpenses)}
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
