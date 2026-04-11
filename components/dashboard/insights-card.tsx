import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/dashboard/format"

type InsightsCardProps = {
  monthlyIncome: number
  monthlyExpenses: number
  spendingByCategory: Array<{ category: string; spend: number }>
  dailySpending: Array<{ date: string; spend: number }>
}

function percent(part: number, total: number) {
  if (total <= 0) return 0
  return Math.round((part / total) * 100)
}

export function InsightsCard({
  monthlyIncome,
  monthlyExpenses,
  spendingByCategory,
  dailySpending,
}: InsightsCardProps) {
  const savings = monthlyIncome - monthlyExpenses
  const savingsRate = monthlyIncome > 0 ? Math.round((savings / monthlyIncome) * 100) : 0

  const topCategory = spendingByCategory[0]
  const topCategoryPct = topCategory ? percent(topCategory.spend, monthlyExpenses) : 0

  const highestDay = [...dailySpending].sort((a, b) => b.spend - a.spend)[0]

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="rounded-lg border bg-white p-3">
          <div className="text-muted-foreground">Estimated savings</div>
          <div className="mt-1 flex items-baseline justify-between gap-3">
            <div className="text-xl font-semibold tracking-tight">
              {formatCurrency(savings)}
            </div>
            <div className="text-xs text-muted-foreground tabular-nums">
              {savingsRate}% of income
            </div>
          </div>
        </div>

        <ul className="space-y-2 text-muted-foreground">
          <li>
            Biggest spending category:{" "}
            <span className="font-medium text-foreground">
              {topCategory ? topCategory.category : "—"}
            </span>{" "}
            {topCategory ? (
              <span className="tabular-nums">({topCategoryPct}%)</span>
            ) : null}
          </li>
          <li>
            Highest spend day:{" "}
            <span className="font-medium text-foreground">
              {highestDay ? highestDay.date : "—"}
            </span>{" "}
            {highestDay ? (
              <span className="tabular-nums">
                ({formatCurrency(highestDay.spend)})
              </span>
            ) : null}
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

