"use client"

import { useState, useEffect } from "react"
import type { Inquiry } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Phone, Mail, Car } from "lucide-react"

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/admin/inquiries")
      const data = await response.json()
      setInquiries(data)
    } catch (error) {
      console.error("Error fetching inquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: Inquiry["status"]) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setInquiries(inquiries.map((inquiry) => (inquiry.id === id ? { ...inquiry, status } : inquiry)))
      }
    } catch (error) {
      console.error("Error updating inquiry:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "default"
      case "contacted":
        return "secondary"
      case "closed":
        return "outline"
      default:
        return "default"
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-3xl border border-border/80 bg-card">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600/20 border-t-blue-600"></div>
          <p className="text-sm text-muted-foreground">Loading inquiries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Customer care</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Customer inquiries</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Keep conversations moving and follow up with customers.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card data-aos="zoom-in-up" data-aos-duration="1300" className="rounded-3xl border-border/80 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center space-x-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/10"><MessageSquare className="h-5 w-5 text-blue-600" /></span>
              <div>
                <p className="text-sm text-muted-foreground">Total inquiries</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{inquiries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-aos="zoom-in-down" data-aos-duration="1300" className="rounded-3xl border-border/80 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center space-x-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-600/10"><MessageSquare className="h-5 w-5 text-orange-600" /></span>
              <div>
                <p className="text-sm text-muted-foreground">New inquiries</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{inquiries.filter((i) => i.status === "new").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-aos="zoom-in-left" data-aos-duration="1300" className="rounded-3xl border-border/80 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center space-x-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600/10"><MessageSquare className="h-5 w-5 text-green-600" /></span>
              <div>
                <p className="text-sm text-muted-foreground">Closed</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{inquiries.filter((i) => i.status === "closed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card data-aos="zoom-in-right" data-aos-duration="1300" className="rounded-3xl border-border/80 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">All inquiries</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Recent customer messages and their current status.</p>
          </div>
          <Badge variant="secondary" className="w-fit rounded-full px-3">{inquiries.length} messages</Badge>
        </CardHeader>
        <CardContent>
          {inquiries.length > 0 ? (
            <div className="space-y-3">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="rounded-2xl border border-border/80 p-4 sm:p-5">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-foreground">{inquiry.name}</h4>
                        <Badge variant={getStatusColor(inquiry.status)} className="rounded-full">{inquiry.status}</Badge>
                      </div>
                      <div className="mb-2 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-5">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="break-all">{inquiry.email}</span>
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{inquiry.phone}</span>
                          </div>
                        )}
                      </div>
                      {inquiry.car && (
                        <div className="mb-2 flex items-center gap-2 text-sm text-blue-600">
                          <Car className="h-4 w-4" />
                          <span>
                            {inquiry.car.year} {inquiry.car.make} {inquiry.car.model}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-muted-foreground">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground">{inquiry.message}</p>
                  </div>
                  <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" className="rounded-full" asChild>
                        <a href={`mailto:${inquiry.email}`}>
                          <Mail className="h-4 w-4 mr-1" />
                          Reply
                        </a>
                      </Button>
                      {inquiry.phone && (
                        <Button size="sm" variant="outline" className="rounded-full" asChild>
                          <a href={`tel:${inquiry.phone}`}>
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </a>
                        </Button>
                      )}
                    </div>

                    <Select
                      value={inquiry.status}
                      onValueChange={(value: Inquiry["status"]) => updateStatus(inquiry.id, value)}
                    >
                      <SelectTrigger                       className="w-full rounded-xl sm:w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="font-medium text-foreground">No inquiries yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Customer messages will appear here.</p>
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
