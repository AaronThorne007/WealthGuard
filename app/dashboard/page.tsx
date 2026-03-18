import { CategoryDonutChart } from "@/components/dashboard/category-donut-chart"
import { DailySpendingChart } from "@/components/dashboard/daily-spending-chart"
import { InsightsCard } from "@/components/dashboard/insights-card"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { mockDashboard } from "@/lib/mock/dashboard"

 export default function DashboardPage() {
   return (
     <div className="space-y-6">
      <SummaryCards
        balance={mockDashboard.balance}
        monthlyIncome={mockDashboard.monthlyIncome}
        monthlyExpenses={mockDashboard.monthlyExpenses}
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <DailySpendingChart data={mockDashboard.dailySpending} />
        </div>
        <div className="min-w-0">
          <CategoryDonutChart data={mockDashboard.spendingByCategory} />
        </div>
      </section>

      <InsightsCard
        monthlyIncome={mockDashboard.monthlyIncome}
        monthlyExpenses={mockDashboard.monthlyExpenses}
        spendingByCategory={mockDashboard.spendingByCategory}
        dailySpending={mockDashboard.dailySpending}
      />
     </div>
   )
 }
