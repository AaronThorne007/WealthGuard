import { Wallet } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/dashboard/format"
import { cn } from "@/lib/utils"

type SummaryCardsProps = {
  balance: number
  monthlyIncome: number
  monthlyExpenses: number
  monthLabel: string
}

function StatCard({
  title,
  value,
  helper,
  className,
}: {
  title: string
  value: string
  helper?: string
  className?: string
}) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
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
  monthLabel,
}: SummaryCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total balance"
        value={formatCurrency(balance)}
        helper="Net of all income and expenses"
        className="border-indigo-100"
      />
      <StatCard
        title="Monthly income"
        value={formatCurrency(monthlyIncome)}
        helper={`Income in ${monthLabel}`}
      />
      <StatCard
        title="Monthly expenses"
        value={formatCurrency(monthlyExpenses)}
        helper={`Expenses in ${monthLabel}`}
      />

      <Card className="md:col-span-3">
        <CardContent className="flex items-center gap-3 py-4 text-sm text-muted-foreground">
          <span className="grid size-9 place-items-center rounded-lg bg-indigo-50 text-indigo-700">
            <Wallet className="size-4" aria-hidden="true" />
          </span>
          <span>
            Totals and charts use your transactions from Supabase. Monthly
            figures use the UTC calendar month shown above.
          </span>
        </CardContent>
      </Card>
    </section>
  )
}
