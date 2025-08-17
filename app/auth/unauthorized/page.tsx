"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Car, Shield, ArrowLeft, LogOut } from "lucide-react"

export default function UnauthorizedPage() {
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
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
              <Shield className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-orange-900">Access Restricted</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                You don't have permission to access the admin panel. This area is restricted to administrators only.
              </AlertDescription>
            </Alert>

            {session && (
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Current Account</h4>
                <p className="text-sm text-blue-800">
                  Signed in as: <strong>{session.user.email}</strong>
                </p>
                <p className="text-sm text-blue-800">
                  Role: <strong>{session.user.role}</strong>
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Link>
              </Button>

              {session && (
                <Button variant="outline" onClick={handleSignOut} className="w-full bg-transparent">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              )}

              {!session && (
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need admin access?{" "}
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
