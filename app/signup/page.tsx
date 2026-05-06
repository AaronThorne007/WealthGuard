import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/server"

type Props = {
  searchParams?: Promise<{
    error?: string
    message?: string
  }>
}

export default async function SignupPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {}

  async function signUp(formData: FormData) {
    "use server"

    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")

    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      redirect(`/signup?error=${encodeURIComponent(error.message)}`)
    }

    redirect(
      "/login?message=" +
        encodeURIComponent(
          "Account created. If email confirmation is enabled, check your inbox before logging in."
        )
    )
  }

  return (
    <div className="mx-auto w-full max-w-md pt-8">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create an account with your email and password.</CardDescription>
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

          <form action={signUp} className="space-y-4">
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
                autoComplete="new-password"
                required
                minLength={6}
              />
              <div className="text-xs text-muted-foreground">Minimum 6 characters.</div>
            </div>

            <Button className="w-full">Create account</Button>
          </form>

          <div className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground underline underline-offset-4">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

