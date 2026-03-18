import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/server"

type Props = {
  searchParams?: Promise<{
    error?: string
    message?: string
    next?: string
  }>
}

export default async function LoginPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {}

  async function signIn(formData: FormData) {
    "use server"

    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    const next = String(formData.get("next") ?? "/dashboard")

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`)
    }

    redirect(next)
  }

  return (
    <div className="mx-auto w-full max-w-md pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>Sign in with your email and password.</CardDescription>
        </CardHeader>
        <CardContent>
          {sp.error ? (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {sp.error}
            </div>
          ) : null}

          {sp.message ? (
            <div className="mb-4 rounded-lg border border-border bg-muted px-3 py-2 text-sm">
              {sp.message}
            </div>
          ) : null}

          <form action={signIn} className="space-y-4">
            <input type="hidden" name="next" value={sp.next ?? "/dashboard"} />

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            <Button className="w-full">Log in</Button>
          </form>

          <div className="mt-4 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-foreground underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

