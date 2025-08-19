"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const searchParams = useSearchParams()
  const carId = searchParams.get("car")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    carId: carId || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: result.message,
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          carId: carId || "",
        })
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Something went wrong",
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-[var(--text-color)]">
            Get in touch with our team for any questions or to schedule a test drive
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="text-[var(--text-color)] border border-[var(--border-line)] py-5"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="text-[var(--text-color)] border border-[var(--border-line)] py-5"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="text-[var(--text-color)] border border-[var(--border-line)] py-5"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    className="bg-transparent border border-[var(--border-line)]"
                  />
                </div>

                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-md ${
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full btn1 py-6 cursor-pointer">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-[var(--text-color)]">(234) 8133531046 | (234) 8122770203</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto: talk2hopeautos@gmail.com" className="text-[var(--text-color)] hover:text-blue-600">talk2hopeautos@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-[var(--text-color)]">
                      36 Adedayo House, Cement bus-stop,
                      <br />
                      Beside Quest filling station, Lagos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>12:00 PM - 5:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border-line)] mt-15 mb-3 pt-8 md:pt-10 text-center px-2">
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
