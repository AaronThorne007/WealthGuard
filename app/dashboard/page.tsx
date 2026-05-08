import Link from "next/link"
import { AlertTriangle, Check, ReceiptText } from "lucide-react"

import { CategoryDonutChart } from "@/components/dashboard/category-donut-chart"
import { DailySpendingChart } from "@/components/dashboard/daily-spending-chart"
import { InsightsCard } from "@/components/dashboard/insights-card"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { Button } from "@/components/ui/button"
import { StateCard } from "@/components/ui/state-card"
import { aggregateDashboard } from "@/lib/dashboard/aggregate"
import { createClient } from "@/lib/supabase/server"
import { transactionFromDb, type TransactionDbRow } from "@/lib/transactions/db-row"

type Props = {
  searchParams?: Promise<{ year?: string }>
}

function isValidYear(value: string) {
  return /^\d{4}$/.test(value)
}

export default async function DashboardPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {}
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
      <StateCard
        title="Could not load dashboard"
        description={error.message}
        tone="destructive"
        icon={<AlertTriangle className="size-5" aria-hidden="true" />}
      />
    )
  }

  const rows = ((data ?? []) as TransactionDbRow[]).map(transactionFromDb)
  const yearOptions = Array.from(new Set(rows.map((r) => r.date.slice(0, 4)))).sort(
    (a, b) => b.localeCompare(a)
  )
  const currentYear = String(new Date().getUTCFullYear())
  const requestedYear =
    typeof sp.year === "string" && isValidYear(sp.year) ? sp.year : null
  const activeYear =
    requestedYear && yearOptions.includes(requestedYear)
      ? requestedYear
      : yearOptions[0] ?? currentYear
  const yearRange = { start: `${activeYear}-01-01`, end: `${activeYear}-12-31` }
  const dashboard = aggregateDashboard(rows, yearRange)
  const rowsInActiveYear = rows.filter(
    (r) => r.date >= yearRange.start && r.date <= yearRange.end
  )

  if (rows.length === 0) {
    return (
      <div className="space-y-6">
        <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Yearly snapshot for {activeYear}
            </p>
          </div>
        </section>

        <StateCard
          title="No transactions yet"
          description="Add transactions to see your balance, spending charts, and insights."
          icon={<ReceiptText className="size-5" aria-hidden="true" />}
          action={
            <Button asChild>
              <Link href="/transactions">Go to transactions</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Yearly snapshot for {activeYear}
          </p>
          {yearOptions.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {yearOptions.map((year) => {
                const active = year === activeYear
                return (
                  <Button
                    key={year}
                    asChild
                    size="sm"
                    variant={active ? "brand" : "outline"}
                    className={
                      active
                        ? "shrink-0"
                        : "shrink-0"
                    }
                  >
                    <Link href={`/dashboard?year=${year}`}>
                      {active ? <Check className="size-3.5" aria-hidden="true" /> : null}
                      {year}
                    </Link>
                  </Button>
                )
              })}
            </div>
          ) : null}
        </div>
        <Button asChild variant="outline">
          <Link href="/transactions">Add transaction</Link>
        </Button>
      </section>

      <SummaryCards
        balance={dashboard.balance}
        yearlyIncome={dashboard.monthlyIncome}
        yearlyExpenses={dashboard.monthlyExpenses}
        periodLabel={activeYear}
      />

      {rowsInActiveYear.length === 0 ? (
        <StateCard
          title={`No data for ${activeYear}`}
          description="Pick another year above or add transactions in this year to populate charts and insights."
          icon={<ReceiptText className="size-5" aria-hidden="true" />}
        />
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <DailySpendingChart data={dashboard.dailySpending} periodLabel={activeYear} />
        </div>
        <div className="min-w-0">
          <CategoryDonutChart
            data={dashboard.spendingByCategory}
            periodLabel={activeYear}
          />
        </div>
      </section>

      <InsightsCard
        yearlyIncome={dashboard.monthlyIncome}
        yearlyExpenses={dashboard.monthlyExpenses}
        spendingByCategory={dashboard.spendingByCategory}
        dailySpending={dashboard.dailySpending}
      />
    </div>
  )
}
