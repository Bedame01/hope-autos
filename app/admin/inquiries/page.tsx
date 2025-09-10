"use client"

import { useState, useEffect } from "react"
import type { Inquiry } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Phone, Mail, Car } from "lucide-react"
import Link from "next/link"

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Inquiries</h1>
        <p className="text-[var(--text-color)]">Manage customer inquiries and follow-ups</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-aos="zoom-in-up" data-aos-duration="1300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-[var(--text-color)]">Total Inquiries</p>
                <p className="text-2xl font-bold">{inquiries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-aos="zoom-in-down" data-aos-duration="1300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-[var(--text-color)]">New Inquiries</p>
                <p className="text-2xl font-bold">{inquiries.filter((i) => i.status === "new").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-aos="zoom-in-left" data-aos-duration="1300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-[var(--text-color)]">Closed</p>
                <p className="text-2xl font-bold">{inquiries.filter((i) => i.status === "closed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card data-aos="zoom-in-right" data-aos-duration="1300">
        <CardHeader>
          <CardTitle>All Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiries.length > 0 ? (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="border rounded-lg p-4 overflow-x-auto">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{inquiry.name}</h4>
                        <Badge variant={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-[var(--text-color)] mb-2">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{inquiry.email}</span>
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{inquiry.phone}</span>
                          </div>
                        )}
                      </div>
                      {inquiry.car && (
                        <div className="flex items-center space-x-1 text-sm text-blue-600 mb-2">
                          <Car className="h-4 w-4" />
                          <span>
                            {inquiry.car.year} {inquiry.car.make} {inquiry.car.model}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--text-color)]">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-color font-medium">{inquiry.message}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`mailto:${inquiry.email}`}>
                          <Mail className="h-4 w-4 mr-1" />
                          Reply
                        </a>
                      </Button>
                      {inquiry.phone && (
                        <Button size="sm" variant="outline" asChild>
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
                      <SelectTrigger className="w-32">
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
              <p className="text-[var(--text-color)]">No inquiries yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="border-t border-[var(--border-line)] mt-8 pt-8 md:pt-10 text-center text-sm sm:text-[15px]">
        <p className="text-[var(--text-color)] mb-1.5">
          © {new Date().getFullYear()} Hope Autos Limited. All rights reserved.
        </p>
        <p className="text-[var(--text-color)]">No 1 Nigeria Best Vehicle Dealership</p>
      </div>

    </div>
  )
}
