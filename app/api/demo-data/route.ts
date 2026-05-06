import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

function isoDaysAgo(daysAgo: number) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const demoTransactions = [
    {
      user_id: user.id,
      date: isoDaysAgo(20),
      description: "Paycheck",
      category: "Income",
      type: "income",
      amount: 2600,
      account: "Checking",
    },
    {
      user_id: user.id,
      date: isoDaysAgo(18),
      description: "Rent payment",
      category: "Rent",
      type: "expense",
      amount: 1200,
      account: "Checking",
    },
    {
      user_id: user.id,
      date: isoDaysAgo(16),
      description: "Supermarket",
      category: "Groceries",
      type: "expense",
      amount: 128.5,
      account: "Checking",
    },
    {
      user_id: user.id,
      date: isoDaysAgo(14),
      description: "Gas",
      category: "Transport",
      type: "expense",
      amount: 52.75,
      account: "Checking",
    },
    {
      user_id: user.id,
      date: isoDaysAgo(12),
      description: "Streaming + internet",
      category: "Bills",
      type: "expense",
      amount: 94.99,
      account: "Checking",
    },
    {
      user_id: user.id,
      date: isoDaysAgo(9),
      description: "Dinner out",
      category: "Dining",
      type: "expense",
      amount: 41.2,
      account: "Checking",
    },
    {
      user_id: user.id,
      date: isoDaysAgo(7),
      description: "Freelance payout",
      category: "Income",
      type: "income",
      amount: 420,
      account: "Checking",
    },
    {
      user_id: user.id,
      date: isoDaysAgo(5),
      description: "New headphones",
      category: "Shopping",
      type: "expense",
      amount: 89.99,
      account: "Checking",
    },
  ]

  const demoGoals = [
    { user_id: user.id, title: "Emergency Fund", target: 2000, saved: 850 },
    { user_id: user.id, title: "Summer Trip", target: 1200, saved: 430 },
    { user_id: user.id, title: "New Laptop", target: 1500, saved: 620 },
  ]

  const { error: deleteTransactionsError } = await supabase
    .from("transactions")
    .delete()
    .eq("user_id", user.id)

  if (deleteTransactionsError) {
    return NextResponse.json(
      { error: deleteTransactionsError.message },
      { status: 500 }
    )
  }

  const { error: deleteGoalsError } = await supabase
    .from("goals")
    .delete()
    .eq("user_id", user.id)

  if (deleteGoalsError) {
    return NextResponse.json({ error: deleteGoalsError.message }, { status: 500 })
  }

  const { error: insertTransactionsError } = await supabase
    .from("transactions")
    .insert(demoTransactions)

  if (insertTransactionsError) {
    return NextResponse.json(
      { error: insertTransactionsError.message },
      { status: 500 }
    )
  }

  const { error: insertGoalsError } = await supabase.from("goals").insert(demoGoals)

  if (insertGoalsError) {
    return NextResponse.json({ error: insertGoalsError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
