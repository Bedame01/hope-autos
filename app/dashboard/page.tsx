"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Search, Settings, Car, TrendingUp, Clock } from "lucide-react"
import type { Car as CarType, Inquiry } from "@/lib/types"

interface DashboardStats {
  favoriteCount: number
  activeInquiries: number
  savedSearches: number
  recentlyViewed: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [favoritesCars, setFavoriteCars] = useState<CarType[]>([])
  const [userInquiries, setUserInquiries] = useState<Inquiry[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    favoriteCount: 0,
    activeInquiries: 0,
    savedSearches: 0,
    recentlyViewed: 0,
  })
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

      // Calculate stats
      const activeInquiriesCount = userInquiries.filter((i) => i.status !== "closed").length
      const savedSearchesCount = session?.user?.preferences?.savedSearches?.length || 0

      setStats({
        favoriteCount: favoritesCars.length,
        activeInquiries: activeInquiriesCount,
        savedSearches: savedSearchesCount,
        recentlyViewed: 0, // This would come from a separate API
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Refresh data every 30 seconds for real-time updates
  useEffect(() => {
    if (status === "authenticated") {
      const interval = setInterval(fetchUserData, 30000)
      return () => clearInterval(interval)
    }
  }, [status])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {session.user.name}!</h1>
          <p className="text-muted-foreground">Manage your car shopping experience</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Favorite Cars</p>
                  <p className="text-2xl font-bold text-foreground">{stats.favoriteCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Inquiries</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeInquiries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Saved Searches</p>
                  <p className="text-2xl font-bold text-foreground">{stats.savedSearches}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Recently Viewed</p>
                  <p className="text-2xl font-bold text-foreground">{stats.recentlyViewed}</p>
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
              <Button asChild className="h-12">
                <Link href="/cars">
                  <Car className="h-4 w-4 mr-2" />
                  Browse Cars
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-12 bg-transparent">
                <Link href="/favorites">
                  <Heart className="h-4 w-4 mr-2" />
                  View Favorites
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-12 bg-transparent">
                <Link href="/contact">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-12 bg-transparent">
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
                  {stats.favoriteCount > 0 && <Badge variant="secondary">{stats.favoriteCount}</Badge>}
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
                    <div
                      key={car.id}
                      className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-16 h-12 bg-muted rounded flex-shrink-0 overflow-hidden">
                        {car.images && car.images[0] && (
                          <img
                            src={car.images[0] || "/placeholder.svg"}
                            alt={`${car.make} ${car.model}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground">
                          {car.year} {car.make} {car.model}
                        </h4>
                        <p className="text-sm text-muted-foreground">${car.price.toLocaleString()}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {car.fuelType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {car.bodyType}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/cars/${car.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                  {favoritesCars.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/favorites">View {favoritesCars.length - 3} more favorites</Link>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No favorite cars yet</p>
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
                  {stats.activeInquiries > 0 && <Badge variant="secondary">{stats.activeInquiries} active</Badge>}
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
                    <div key={inquiry.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
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
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {inquiry.car && (
                        <p className="text-sm font-medium mb-1 text-foreground">
                          {inquiry.car.year} {inquiry.car.make} {inquiry.car.model}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">{inquiry.message}</p>
                    </div>
                  ))}
                  {userInquiries.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/inquiries">View {userInquiries.length - 3} more inquiries</Link>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No inquiries yet</p>
                  <Button className="mt-4" asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {favoritesCars.slice(0, 2).map((car) => (
                <div key={`fav-${car.id}`} className="flex items-center space-x-3 text-sm">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-muted-foreground">
                    Added{" "}
                    <Link href={`/cars/${car.id}`} className="text-primary hover:underline">
                      {car.year} {car.make} {car.model}
                    </Link>{" "}
                    to favorites
                  </span>
                </div>
              ))}
              {userInquiries.slice(0, 2).map((inquiry) => (
                <div key={`inq-${inquiry.id}`} className="flex items-center space-x-3 text-sm">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="text-muted-foreground">
                    Sent inquiry about{" "}
                    {inquiry.car && (
                      <Link href={`/cars/${inquiry.car.id}`} className="text-primary hover:underline">
                        {inquiry.car.year} {inquiry.car.make} {inquiry.car.model}
                      </Link>
                    )}
                  </span>
                </div>
              ))}
              {favoritesCars.length === 0 && userInquiries.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
