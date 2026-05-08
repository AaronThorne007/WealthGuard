"use client"

import { useEffect, useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StateCard } from "@/components/ui/state-card"
import type { CategorySpendPoint } from "@/lib/dashboard/aggregate"
import { formatCurrency } from "@/lib/dashboard/format"

export function CategoryDonutChart({
  data,
  periodLabel,
}: {
  data: CategorySpendPoint[]
  periodLabel: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Client-only chart rendering gate for hydration safety.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const total = data.reduce((a, d) => a + d.spend, 0)
  const top = data[0]

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Spending by category</CardTitle>
        <p className="text-xs text-muted-foreground">
          Breakdown of expense categories in {periodLabel}.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 md:items-center">
        <div className="h-[240px]">
          {!mounted ? (
            <StateCard tone="loading" title="Loading chart..." className="h-full" />
          ) : data.length === 0 ? (
            <StateCard
              title="No category data yet"
              description="Add expense transactions to view category breakdowns."
              className="grid h-full place-items-center p-6"
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    String(name),
                  ]}
                  cursor={{ fill: "hsl(var(--muted) / 0.25)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                  }}
                />
                <Pie
                  data={data}
                  dataKey="spend"
                  nameKey="category"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={2}
                  stroke="hsl(var(--background))"
                >
                  {data.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-sm text-muted-foreground">Total expenses</div>
            <div className="text-2xl font-semibold tracking-tight">
              {formatCurrency(total)}
            </div>
          </div>

          {top ? (
            <div className="rounded-lg border bg-background p-3 text-sm">
              <div className="text-muted-foreground">Top category</div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{ background: top.color }}
                    aria-hidden="true"
                  />
                  <span className="font-medium">{top.category}</span>
                </div>
                <span className="tabular-nums">
                  {formatCurrency(top.spend)}
                </span>
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            {data.slice(1, 6).map((d) => (
              <div key={d.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{ background: d.color }}
                    aria-hidden="true"
                  />
                  <span>{d.category}</span>
                </div>
                <span className="tabular-nums text-foreground">
                  {formatCurrency(d.spend)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
