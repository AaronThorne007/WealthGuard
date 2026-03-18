 "use client"
 
 import Link from "next/link"
import { useRouter } from "next/navigation"
 import { usePathname } from "next/navigation"
 import { LogOut, Menu, Plus } from "lucide-react"
 
 import { Button } from "@/components/ui/button"
 import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
 } from "@/components/ui/sheet"
 import { cn } from "@/lib/utils"
 
import { createClient } from "@/lib/supabase/client"

 import { AppSidebar } from "./app-sidebar"
 
 const titleByPrefix: Array<{ prefix: string; title: string }> = [
   { prefix: "/dashboard", title: "Dashboard" },
   { prefix: "/transactions", title: "Transactions" },
   { prefix: "/goals", title: "Goals" },
  { prefix: "/login", title: "Log in" },
  { prefix: "/signup", title: "Sign up" },
 ]
 
 function getTitle(pathname: string | null) {
   if (!pathname) return "WealthGuard"
   const match = titleByPrefix.find(
     (x) => pathname === x.prefix || pathname.startsWith(x.prefix + "/")
   )
   return match?.title ?? "WealthGuard"
 }
 
export function AppHeader({
  className,
  isSignedIn,
}: {
  className?: string
  isSignedIn: boolean
}) {
   const pathname = usePathname()
   const router = useRouter()
   const title = getTitle(pathname)
   const isAuthPage =
     pathname === "/login" ||
     pathname?.startsWith("/login/") ||
     pathname === "/signup" ||
     pathname?.startsWith("/signup/")
 
   async function handleLogout() {
     const supabase = createClient()
     await supabase.auth.signOut()
     router.push("/login")
     router.refresh()
   }
 
   return (
     <header
       className={cn(
         "sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-white/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/60",
         className
       )}
     >
       <Sheet>
         <SheetTrigger asChild>
           <Button
             variant="ghost"
             size="icon"
             className="md:hidden"
             aria-label="Open navigation menu"
           >
             <Menu className="size-5" aria-hidden="true" />
           </Button>
         </SheetTrigger>
         <SheetContent side="left" className="w-[280px] p-0">
           <SheetHeader className="sr-only">
             <SheetTitle>Navigation</SheetTitle>
           </SheetHeader>
           <AppSidebar className="border-r-0" />
         </SheetContent>
       </Sheet>
 
       <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
         <div className="min-w-0">
           <div className="truncate text-sm font-semibold tracking-tight text-foreground">
             {title}
           </div>
           <div className="truncate text-xs text-muted-foreground">
             Manual budget + goals tracker
           </div>
         </div>
 
         <div className="flex items-center gap-2">
         {!isAuthPage && isSignedIn ? (
             <>
               <Button
                 asChild
                 className="bg-indigo-600 text-white hover:bg-indigo-600/90"
                 size="sm"
               >
                 <Link href="/transactions">
                   <Plus className="size-4" aria-hidden="true" />
                   <span className="ml-2 hidden sm:inline">New transaction</span>
                   <span className="ml-2 sm:hidden">New</span>
                 </Link>
               </Button>
 
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={handleLogout}
                 aria-label="Log out"
               >
                 <LogOut className="size-4" aria-hidden="true" />
                 <span className="ml-2 hidden sm:inline">Log out</span>
               </Button>
             </>
           ) : null}
         </div>
       </div>
     </header>
   )
 }
