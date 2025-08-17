"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { signIn, getProviders } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Car, Mail, Lock, Loader2 } from "lucide-react"
// import Image from "next/image"
// import google_icon from "@/public/icons/google-login-icon.png"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const error = searchParams.get("error")
  const message = searchParams.get("message")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  useEffect(() => {
    if (error) {
      switch (error) {
        case "CredentialsSignin":
          setAuthError("Invalid email or password")
          break
        case "OAuthSignin":
        case "OAuthCallback":
        case "OAuthCreateAccount":
          setAuthError("Error with Google sign-in. Please try again.")
          break
        case "OAuthAccountNotLinked":
          setAuthError("This email is already registered. Please sign in with your email and password first.")
          break
        case "EmailSignin":
          setAuthError("Error sending verification email")
          break
        case "Callback":
          setAuthError("Error during authentication callback")
          break
        case "AccessDenied":
          setAuthError("Access denied. You cancelled the sign-in process.")
          break
        default:
          setAuthError("An error occurred during sign in")
      }
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAuthError("")

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setAuthError("Invalid email or password")
      } else if (result?.ok) {
        router.push(callbackUrl)
      }
    } catch (error) {
      setAuthError("An error occurred during sign in")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setAuthError("")

    try {
      await signIn("google", {
        callbackUrl,
        redirect: true,
      })
    } catch (error) {
      console.error("Google sign-in error:", error)
      setAuthError("Failed to sign in with Google. Please try again.")
    } finally {
      setGoogleLoading(false)
    }
  }

  const hasGoogleProvider = providers?.google

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center flex-col justify-center py-12 px-5 sm:px-8 lg:px-10">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {/* <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Hope Autos</span>
          </Link> */}
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-[var(--text-color)]">
            Or{" "}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <Card className="max-sm:px-1">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Success Message */}
            {message && (
              <Alert>
                <AlertDescription className="text-green-800">{message}</AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {authError && (
              <Alert variant="destructive">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            {/* OAuth Buttons - Only show if Google provider is available */}
            {hasGoogleProvider && (
              <>
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent py-5 cursor-pointer"
                    onClick={handleGoogleSignIn}
                    disabled={loading || googleLoading}
                  >
                    {googleLoading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      // <Image 
                      //   src={google_icon}
                      //   alt="google-icon"
                      //   className="size-5.5 mr-1"
                      // />

                      <svg width="16" height="16" data-view-component="true">        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" data-view-component="true" className="octicon color-fg-default">
                        <g clip-path="url(#clip0_643_9687)">
                          <path d="M8.00018 3.16667C9.18018 3.16667 10.2368 3.57333 11.0702 4.36667L13.3535 2.08333C11.9668 0.793333 10.1568 0 8.00018 0C4.87352 0 2.17018 1.79333 0.853516 4.40667L3.51352 6.47C4.14352 4.57333 5.91352 3.16667 8.00018 3.16667Z" fill="#EA4335"></path>
                          <path d="M15.66 8.18335C15.66 7.66002 15.61 7.15335 15.5333 6.66669H8V9.67335H12.3133C12.12 10.66 11.56 11.5 10.72 12.0667L13.2967 14.0667C14.8 12.6734 15.66 10.6134 15.66 8.18335Z" fill="#4285F4"></path>
                          <path d="M3.51 9.53001C3.35 9.04668 3.25667 8.53334 3.25667 8.00001C3.25667 7.46668 3.34667 6.95334 3.51 6.47001L0.85 4.40668C0.306667 5.48668 0 6.70668 0 8.00001C0 9.29334 0.306667 10.5133 0.853333 11.5933L3.51 9.53001Z" fill="#FBBC05"></path>
                          <path d="M8.0001 16C10.1601 16 11.9768 15.29 13.2968 14.0633L10.7201 12.0633C10.0034 12.5467 9.0801 12.83 8.0001 12.83C5.91343 12.83 4.14343 11.4233 3.5101 9.52667L0.850098 11.59C2.1701 14.2067 4.87343 16 8.0001 16Z" fill="#34A853"></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_643_9687">
                            <rect width="16" height="16" fill="white"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                      </svg>
                      // <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      //   <path
                      //     fill="currentColor"
                      //     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      //   />
                      //   <path
                      //     fill="currentColor"
                      //     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      //   />
                      //   <path
                      //     fill="currentColor"
                      //     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      //   />
                      //   <path
                      //     fill="currentColor"
                      //     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      //   />
                      // </svg>
                    )}
                    {googleLoading ? "Signing in..." : "Continue with Google"}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border-line)]" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[var(--background-secondary)] text-[var(--text-color)]">Or continue with email</span>
                  </div>
                </div>
              </>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10 border border-[var(--border-line)] py-5"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading || googleLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10 pr-10 border border-[var(--border-line)] py-5"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading || googleLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[var(--text-color)]"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || googleLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={loading || googleLoading}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full py-5 cursor-pointer" disabled={loading || googleLoading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-[var(--text-color)]">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-t border-[var(--border-line)] mt-18 mb-3 pt-8 md:pt-10 text-center">
        <p className="text-[var(--text-color)] text-sm">
          © {new Date().getFullYear()} Hope Autos. All rights reserved. |
          <Link href="/privacy" className="hover:text-[var(--text-color)] ml-1">
            Privacy Policy
          </Link>{" "}
          |
          <Link href="/terms" className="hover:text-[var(--text-color)] ml-1">
            Terms of Service
          </Link>
        </p>
      </div>

    </div>
  )
}
