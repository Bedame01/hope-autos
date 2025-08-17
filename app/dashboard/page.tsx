"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Search, Settings, Car } from "lucide-react"
import type { Car as CarType, Inquiry } from "@/lib/types"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [favoritesCars, setFavoriteCars] = useState<CarType[]>([])
  const [userInquiries, setUserInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchUserData()
    }
  }, [status, router])

  const fetchUserData = async () => {
    try {
      // Fetch favorite cars
      const favoritesResponse = await fetch(`/api/user/favorites`)
      if (favoritesResponse.ok) {
        const favorites = await favoritesResponse.json()
        setFavoriteCars(favorites)
      }

      // Fetch user inquiries
      const inquiriesResponse = await fetch(`/api/user/inquiries`)
      if (inquiriesResponse.ok) {
        const inquiries = await inquiriesResponse.json()
        setUserInquiries(inquiries)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session.user.name}!</h1>
          <p className="text-[var(--text-color)]">Manage your car shopping experience</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Favorite Cars</p>
                  <p className="text-2xl font-bold">{favoritesCars.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Active Inquiries</p>
                  <p className="text-2xl font-bold">{userInquiries.filter((i) => i.status !== "closed").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Saved Searches</p>
                  <p className="text-2xl font-bold">{session.user.preferences?.savedSearches?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button asChild>
                <Link href="/cars">
                  <Car className="h-4 w-4 mr-2" />
                  Browse Cars
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/favorites">
                  <Heart className="h-4 w-4 mr-2" />
                  View Favorites
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Favorite Cars */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Favorite Cars</span>
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/favorites">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {favoritesCars.length > 0 ? (
                <div className="space-y-4">
                  {favoritesCars.slice(0, 3).map((car) => (
                    <div key={car.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {car.year} {car.make} {car.model}
                        </h4>
                        <p className="text-sm text-gray-600">${car.price.toLocaleString()}</p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/cars/${car.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No favorite cars yet</p>
                  <Button className="mt-4" asChild>
                    <Link href="/cars">Browse Cars</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Inquiries */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <span>Recent Inquiries</span>
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/inquiries">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {userInquiries.length > 0 ? (
                <div className="space-y-4">
                  {userInquiries.slice(0, 3).map((inquiry) => (
                    <div key={inquiry.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={
                            inquiry.status === "new"
                              ? "default"
                              : inquiry.status === "contacted"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {inquiry.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {inquiry.car && (
                        <p className="text-sm font-medium mb-1">
                          {inquiry.car.year} {inquiry.car.make} {inquiry.car.model}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2">{inquiry.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No inquiries yet</p>
                  <Button className="mt-4" asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
