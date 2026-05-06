import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isProtected =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/transactions" ||
    pathname.startsWith("/transactions/") ||
    pathname === "/goals" ||
    pathname.startsWith("/goals/")

  const isAuthPage =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/signup" ||
    pathname.startsWith("/signup/")

  if (!user && isProtected) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("next", pathname)

    const redirectResponse = NextResponse.redirect(redirectUrl)
    response.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c)
    })
    return redirectResponse
  }

  if (user && isAuthPage) {
    const redirectResponse = NextResponse.redirect(
      new URL("/dashboard", request.url)
    )
    response.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c)
    })
    return redirectResponse
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
