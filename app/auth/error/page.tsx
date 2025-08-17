"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Car, AlertTriangle, ArrowLeft } from "lucide-react"

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
  OAuthSignin: "Error in constructing an authorization URL.",
  OAuthCallback: "Error in handling the response from an OAuth provider.",
  OAuthCreateAccount: "Could not create OAuth provider user in the database.",
  EmailCreateAccount: "Could not create email provider user in the database.",
  Callback: "Error in the OAuth callback handler route.",
  OAuthAccountNotLinked: "The email on the account is already linked, but not with this OAuth account.",
  EmailSignin: "Sending the e-mail with the verification token failed.",
  CredentialsSignin: "The authorize callback returned null in the Credentials provider.",
  SessionRequired: "The content of this page requires you to be signed in at all times.",
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") as keyof typeof errorMessages

  const errorMessage = errorMessages[error] || errorMessages.Default

  const getErrorTitle = (error: string) => {
    switch (error) {
      case "OAuthAccountNotLinked":
        return "Account Already Exists"
      case "AccessDenied":
        return "Access Denied"
      case "Configuration":
        return "Configuration Error"
      default:
        return "Authentication Error"
    }
  }

  const getErrorSolution = (error: string) => {
    switch (error) {
      case "OAuthAccountNotLinked":
        return "An account with this email already exists. Please sign in with your email and password, then link your Google account in settings."
      case "AccessDenied":
        return "You cancelled the sign-in process or don't have permission to access this application."
      case "Configuration":
        return "There's a server configuration issue. Please contact support if this persists."
      default:
        return "Please try signing in again. If the problem persists, contact support."
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Hope Autos</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-900">{getErrorTitle(error)}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>

            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 mb-2">What can you do?</h4>
              <p className="text-sm text-blue-800">{getErrorSolution(error)}</p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/signin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Try Again
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">Go Home</Link>
              </Button>

              {error === "OAuthAccountNotLinked" && (
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/auth/signin?tab=email">Sign in with Email</Link>
                </Button>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need help?{" "}
                <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-500">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
