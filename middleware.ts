import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

    // Protect admin routes
    if (isAdminRoute) {
      if (!token) {
        const signInUrl = new URL("/auth/signin", req.url)
        signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
        return NextResponse.redirect(signInUrl)
      }

      if (token.role !== "admin") {
        const unauthorizedUrl = new URL("/auth/unauthorized", req.url)
        return NextResponse.redirect(unauthorizedUrl)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

        if (isAdminRoute) {
          return token?.role === "admin"
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: ["/admin/:path*"],
}
