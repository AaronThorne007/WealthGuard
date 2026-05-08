import { ReactNode } from "react"

import { AppHeader } from "@/components/app/app-header"
import { AppSidebar } from "@/components/app/app-sidebar"
import { createClient } from "@/lib/supabase/server"

export async function AppShell({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-screen-2xl">
        <div className="hidden w-[280px] shrink-0 md:block">
          <div className="sticky top-0 h-dvh">
            <AppSidebar />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader isSignedIn={Boolean(user)} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
