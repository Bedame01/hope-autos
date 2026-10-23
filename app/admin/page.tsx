"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { DashboardStats } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Car, Users, MessageSquare, TrendingUp, Eye } from "lucide-react"

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
      <div className="flex min-h-64 items-center justify-center rounded-3xl border border-border/80 bg-card">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600/20 border-t-blue-600"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="rounded-3xl border border-destructive/20 bg-card p-8 text-center">
        <p className="font-medium text-foreground">Dashboard data is unavailable.</p>
        <p className="mt-1 text-sm text-muted-foreground">Please refresh the page to try again.</p>
      </div>
    )
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
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Hope Autos / Workspace</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">A clear view of what’s happening across your dealership.</p>
      </div>
      <Button asChild className="w-fit rounded-full px-5">
        <Link href="/admin/cars/new"><Car className="mr-2 h-4 w-4" />Add a vehicle</Link>
      </Button>
    </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card data-aos="zoom-in-up" data-aos-duration="1300" key={stat.title} className="rounded-3xl border-border/80 shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
                  </div>
                  <div className={`rounded-2xl p-3 ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Inquiries */}
      <Card data-aos="zoom-in-up" data-aos-duration="1300" className="rounded-3xl border-border/80 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Inquiries</CardTitle>
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <Link href="/admin/inquiries">
                <Eye className="h-4 w-4 mr-2" />
                View all <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentInquiries.length > 0 ? (
            <div className="space-y-4">
              {stats.recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex flex-col gap-3 rounded-2xl border border-border/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-foreground">{inquiry.name}</h4>
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
                    <p className="break-all text-sm text-muted-foreground">{inquiry.email}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{inquiry.message}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No recent inquiries yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card data-aos="zoom-in-up" data-aos-duration="1300" className="rounded-3xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Button className="rounded-full" asChild>
              <Link href="/admin/cars/new">Add new car</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/admin/inquiries">Manage Inquiries</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/admin/users">View Users</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-border pt-6 text-center text-sm">
        <p className="mb-1.5 text-muted-foreground">
          © {new Date().getFullYear()} Hope Autos Limited. All rights reserved.
        </p>
        <p className="text-muted-foreground">No 1 Nigeria Best Vehicle Dealership</p>
      </div>

    </div>
  )
}
