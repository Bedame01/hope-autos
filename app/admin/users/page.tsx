"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Mail, Phone } from "lucide-react"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-3xl border border-border/80 bg-card">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600/20 border-t-blue-600"></div>
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  const customerUsers = filteredUsers.filter((user) => user.role === "customer")
  const adminUsers = filteredUsers.filter((user) => user.role === "admin")

  return (
    <div className="space-y-7">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">People</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">User management</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Manage customer accounts and admin users.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card data-aos="zoom-in-left" data-aos-duration="1300" className="rounded-3xl border-border/80 shadow-sm py-3">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center space-x-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/10"><Users className="h-5 w-5 text-blue-600" /></span>
              <div>
                <p className="text-sm text-muted-foreground">Total customers</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{customerUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-aos="zoom-in-right" data-aos-duration="1300" className="rounded-3xl border-border/80 shadow-sm py-3">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center space-x-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600/10"><Users className="h-5 w-5 text-purple-600" /></span>
              <div>
                <p className="text-sm text-muted-foreground">Admin users</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{adminUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card data-aos="zoom-in-left" data-aos-duration="1300" className="rounded-3xl border-border/80 shadow-sm py-2! md:py-4!">
        <CardContent className="p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 rounded-2xl border-border/80 bg-background pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card data-aos="zoom-in-right" data-aos-duration="1300" className="rounded-3xl border-border/80 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">All users</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Customer and admin accounts in one place.</p>
          </div>
          <Badge variant="secondary" className="w-fit rounded-full px-3">{filteredUsers.length} users</Badge>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex flex-col gap-3 rounded-2xl border border-border/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-foreground">{user.name}</h4>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="rounded-full">{user.role}</Badge>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-5">
                      <div className="flex min-w-0 items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="break-all">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="font-medium text-foreground">No users found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try searching another name or email.</p>
            </div>
          )}
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
