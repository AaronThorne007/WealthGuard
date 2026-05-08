# WealthGuard

WealthGuard is a simple personal finance website for tracking spending, income, and savings goals.

## Use the App

Open the live site here: [wealth-guard-five.vercel.app](https://wealth-guard-five.vercel.app/)

## What You Can Do

- Add, edit, and delete transactions
- View a yearly dashboard with totals, charts, and insights
- Search and filter transaction history
- Create savings goals and update progress
- Load demo data for a quick preview

## Quick Start (for users)

1. Create an account or log in.
2. Go to **Dashboard**.
3. If you want sample content, click **Load demo data**.
4. Use **Transactions** to add income and expenses.
5. Use **Goals** to track savings progress.

## Dashboard Overview

The dashboard shows:

- Total balance
- Yearly income and yearly expenses
- Daily spending chart
- Spending by category chart
- Key insights (top spending category and highest spend day)

Use the year buttons on the dashboard to switch between years.

## Notes

- Demo data replaces your current transactions and goals for your account.
- Your data is shown per signed-in account.

## Developer Notes

### Local setup

1. Install dependencies:
   - `npm install`
2. Add environment variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Start the app:
   - `npm run dev`
4. Open:
   - [http://localhost:3000](http://localhost:3000)

### Database

- Supabase tables used by the app:
  - `transactions`
  - `goals`
- `supabase/goals.sql` includes the goals table and RLS policies.
- Demo data is loaded from the app API route and overwrites existing rows for the signed-in user.

### Quality checks

- Run lint:
  - `npm run lint`

## Author

Aaron
CISC 4900 Senior project