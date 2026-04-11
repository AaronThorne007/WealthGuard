import Link from "next/link"

import { CategoryDonutChart } from "@/components/dashboard/category-donut-chart"
import { DailySpendingChart } from "@/components/dashboard/daily-spending-chart"
import { InsightsCard } from "@/components/dashboard/insights-card"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { Button } from "@/components/ui/button"
import {
  aggregateDashboard,
  utcCalendarMonthRange,
} from "@/lib/dashboard/aggregate"
import { createClient } from "@/lib/supabase/server"
import { transactionFromDb, type TransactionDbRow } from "@/lib/transactions/db-row"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id, user_id, date, description, category, type, amount, account"
    )
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
        <p className="font-medium text-destructive">Could not load dashboard</p>
        <p className="mt-1 text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  const rows = ((data ?? []) as TransactionDbRow[]).map(transactionFromDb)
  const monthRange = utcCalendarMonthRange()
  const dashboard = aggregateDashboard(rows, monthRange)

  if (rows.length === 0) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            No transactions yet
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Add transactions to see your balance, spending charts, and insights.
          </p>
          <Button asChild className="mt-4">
            <Link href="/transactions">Go to transactions</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SummaryCards
        balance={dashboard.balance}
        monthlyIncome={dashboard.monthlyIncome}
        monthlyExpenses={dashboard.monthlyExpenses}
        monthLabel={`${monthRange.start.slice(0, 7)} (UTC)`}
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <DailySpendingChart data={dashboard.dailySpending} />
        </div>
        <div className="min-w-0">
          <CategoryDonutChart data={dashboard.spendingByCategory} />
        </div>
      </section>

      <InsightsCard
        monthlyIncome={dashboard.monthlyIncome}
        monthlyExpenses={dashboard.monthlyExpenses}
        spendingByCategory={dashboard.spendingByCategory}
        dailySpending={dashboard.dailySpending}
      />
    </div>
  )
}
