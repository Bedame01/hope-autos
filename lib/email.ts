import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️  RESEND_API_KEY is not set. Email service will not work.")
}

export const resend = new Resend(process.env.RESEND_API_KEY || "")

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

export const isEmailServiceConfigured = () => {
  return !!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== ""
}