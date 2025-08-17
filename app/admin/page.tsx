"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { DashboardStats } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Users, MessageSquare, TrendingUp, Eye } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!stats) {
    return <div>Error loading dashboard data</div>
  }

  const statCards = [
    {
      title: "Total Cars",
      value: stats.totalCars,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Available Cars",
      value: stats.availableCars,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "New Inquiries",
      value: stats.newInquiries,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-[var(--text-color)]">Welcome to the Hope Autos admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-color)]">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Inquiries</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/inquiries">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentInquiries.length > 0 ? (
            <div className="space-y-4">
              {stats.recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{inquiry.name}</h4>
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
                    </div>
                    <p className="text-sm text-[var(--text-color)]">{inquiry.email}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{inquiry.message}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent inquiries</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild>
              <Link href="/admin/cars/new">Add New Car</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/inquiries">Manage Inquiries</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/users">View Users</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-[var(--border-line)] mt-18 mb-3 pt-8 md:pt-10 text-center">
        <p className="text-[var(--text-color)] text-sm">
          © {new Date().getFullYear()} Hope Autos. All rights reserved. |
          <Link href="/privacy" className="hover:text-gray-500 ml-1">
            Privacy Policy
          </Link>{" "}
          |
          <Link href="/terms" className="hover:text-gray-500 ml-1">
            Terms of Service
          </Link>
        </p>
      </div>

    </div>
  )
}
