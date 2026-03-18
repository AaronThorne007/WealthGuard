 import { Wallet } from "lucide-react"
 
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
 import { cn } from "@/lib/utils"
 import { formatCurrency } from "@/lib/mock/dashboard"
 
 type SummaryCardsProps = {
   balance: number
   monthlyIncome: number
   monthlyExpenses: number
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
 }: SummaryCardsProps) {
   return (
     <section className="grid gap-4 md:grid-cols-3">
       <StatCard
         title="Total balance"
         value={formatCurrency(balance)}
         helper="Mock data (static prototype)"
         className="border-indigo-100"
       />
       <StatCard
         title="Monthly income"
         value={formatCurrency(monthlyIncome)}
         helper="Sum of positive transactions"
       />
       <StatCard
         title="Monthly expenses"
         value={formatCurrency(monthlyExpenses)}
         helper="Sum of negative transactions"
       />
 
       {/* Small “brand” hint card for the prototype */}
       <Card className="md:col-span-3">
         <CardContent className="flex items-center gap-3 py-4 text-sm text-muted-foreground">
           <span className="grid size-9 place-items-center rounded-lg bg-indigo-50 text-indigo-700">
             <Wallet className="size-4" aria-hidden="true" />
           </span>
           <span>
             This dashboard is a static prototype. Later, these numbers will come
             from your own manual entries stored in Supabase.
           </span>
         </CardContent>
       </Card>
     </section>
   )
 }
