"use client"

import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StateCard } from "@/components/ui/state-card"
import type { DailySpendPoint } from "@/lib/dashboard/aggregate"
import { formatCurrency } from "@/lib/dashboard/format"

function shortDate(iso: string) {
  // "2026-03-04" -> "Mar 4"
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function compactCurrency(value: number) {
  if (value >= 1000) return `$${Math.round(value / 100) / 10}k`
  return `$${Math.round(value)}`
}

export function DailySpendingChart({
  data,
  periodLabel,
}: {
  data: DailySpendPoint[]
  periodLabel: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Client-only chart rendering gate for hydration safety.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Daily spending</CardTitle>
        <p className="text-xs text-muted-foreground">
          Expense totals for each day in {periodLabel}.
        </p>
      </CardHeader>
      <CardContent className="h-[280px]">
        {!mounted ? (
          <StateCard tone="loading" title="Loading chart..." className="h-full" />
        ) : data.length === 0 ? (
          <StateCard
            title="No spending data yet"
            description="Add expense transactions to populate the chart."
            className="grid h-full place-items-center p-6"
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 12, left: -8, bottom: 8 }}
            >
              <defs>
                <linearGradient id="wgSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                  <stop offset="90%" stopColor="#4f46e5" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                className="fill-muted-foreground"
              />
              <YAxis
                tickFormatter={(v) => compactCurrency(Number(v))}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                className="fill-muted-foreground"
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => shortDate(String(label))}
                cursor={{ stroke: "#a5b4fc", strokeWidth: 1 }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                }}
              />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="#4f46e5"
                strokeWidth={2}
                fill="url(#wgSpend)"
                dot={{ r: 2, strokeWidth: 2, fill: "#4f46e5" }}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
