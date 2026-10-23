"use client"

import type React from "react"
import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { signIn, getProviders } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Car, Mail, Lock } from "lucide-react"
import Image from "next/image"
import google_icon from "@/public/icons/google-login-icon.png"
import logoBlack from '@/public/icons/logo-black.png'
import { ThemeLogo } from "@/components/Theme-logo"

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-background dark:to-[#1e1f1e] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex justify-center mb-2">
            <ThemeLogo  />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-color">
            Or{" "}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          {/* <CardHeader>
            <CardTitle>Welcome back</CardTitle>
          </CardHeader> */}
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

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-color mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10 rounded-full py-5.5 font-medium"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading || googleLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-color mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10 pr-10 rounded-full py-5.5 font-medium"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading || googleLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-color"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || googleLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:text-blue-500 font-medium">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full rounded-2xl py-5.5" disabled={loading || googleLoading}>
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

            {/* OAuth Buttons - Only show if Google provider is available */}
            {hasGoogleProvider && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-color">Or continue with Google</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-full py-5.5 bg-transparent"
                    onClick={handleGoogleSignIn}
                    disabled={loading || googleLoading}
                  >
                    {googleLoading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Image 
                        src={google_icon}
                        alt="google-icon"
                        className="size-5.5 mr-1"
                      />
                    )}
                    {googleLoading ? "Signing in..." : "Continue with Google"}
                  </Button>
                </div>
              </>
            )}

            <div className="text-center">
              <p className="text-sm text-color">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
