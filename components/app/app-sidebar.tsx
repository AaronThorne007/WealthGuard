 "use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Flag, HandCoins, LayoutGrid } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/transactions", label: "Transactions", icon: HandCoins },
  { href: "/goals", label: "Goals", icon: Flag },
] as const

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
          <BarChart3 className="size-5" aria-hidden="true" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">WealthGuard</div>
          <div className="text-xs text-muted-foreground">Finance tracker</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "text-muted-foreground hover:bg-muted hover:text-foreground",
                isActive &&
                  "bg-indigo-50 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700"
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-3 text-xs text-muted-foreground">Track with clarity</div>
    </aside>
  )
}
