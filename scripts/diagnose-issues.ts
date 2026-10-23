#!/usr/bin/env node

import { config } from "dotenv"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: ".env.local" })

async function diagnoseIssues() {
  console.log("🔍 HOPE AUTOS - DIAGNOSTIC CHECK")
  console.log("=".repeat(60))
  console.log("")

  // Check Google OAuth Configuration
  console.log("📱 GOOGLE OAUTH CONFIGURATION")
  console.log("-".repeat(60))

  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
  const nextAuthUrl = process.env.NEXTAUTH_URL
  const nextAuthSecret = process.env.NEXTAUTH_SECRET

  if (!googleClientId) {
    console.log("❌ GOOGLE_CLIENT_ID: NOT SET")
  } else {
    console.log(`✅ GOOGLE_CLIENT_ID: SET (${googleClientId.substring(0, 20)}...)`)
  }

  if (!googleClientSecret) {
    console.log("❌ GOOGLE_CLIENT_SECRET: NOT SET")
  } else {
    console.log(`✅ GOOGLE_CLIENT_SECRET: SET (${googleClientSecret.substring(0, 20)}...)`)
  }

  console.log(`${nextAuthUrl ? "✅" : "❌"} NEXTAUTH_URL: ${nextAuthUrl || "NOT SET"}`)
  console.log(`${nextAuthSecret ? "✅" : "❌"} NEXTAUTH_SECRET: ${nextAuthSecret ? "SET" : "NOT SET"}`)

  console.log("")
  console.log("🔧 REQUIRED NEXT AUTH CALLBACK URL")
  console.log("-".repeat(60))
  console.log(`Callback URL: ${nextAuthUrl}/api/auth/callback/google`)
  console.log("")
  console.log("⚠️  Add this URL to your Google Console:")
  console.log("   1. Go to https://console.cloud.google.com")
  console.log("   2. Select your project")
  console.log("   3. Go to Credentials")
  console.log("   4. Edit your OAuth 2.0 Client ID")
  console.log("   5. Add this URL to Authorized redirect URIs")
  console.log("")

  // Check Email Configuration
  console.log("📧 EMAIL SERVICE CONFIGURATION")
  console.log("-".repeat(60))

  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD
  const smtpFromEmail = process.env.SMTP_FROM_EMAIL
  const nextPublicBaseUrl = process.env.NEXT_PUBLIC_BASE_URL

  console.log(`${smtpHost ? "✅" : "⚠️ "} SMTP_HOST: ${smtpHost || "NOT SET"}`)
  console.log(`${smtpPort ? "✅" : "⚠️ "} SMTP_PORT: ${smtpPort || "NOT SET (defaults to 587)"}`)
  console.log(`${smtpUser ? "✅" : "⚠️ "} SMTP_USER: ${smtpUser ? "SET" : "NOT SET"}`)
  console.log(`${smtpPassword ? "✅" : "⚠️ "} SMTP_PASSWORD: ${smtpPassword ? "SET" : "NOT SET"}`)
  console.log(`${smtpFromEmail ? "✅" : "⚠️ "} SMTP_FROM_EMAIL: ${smtpFromEmail || "NOT SET"}`)
  console.log(
    `${nextPublicBaseUrl ? "✅" : "⚠️ "} NEXT_PUBLIC_BASE_URL: ${nextPublicBaseUrl || "NOT SET (using localhost)"}`,
  )

  console.log("")
  console.log("🛠️  SETUP INSTRUCTIONS")
  console.log("-".repeat(60))

  if (!googleClientId || !googleClientSecret) {
    console.log("")
    console.log("Google OAuth Setup:")
    console.log("1. Go to https://console.cloud.google.com")
    console.log("2. Create a new project or select existing")
    console.log("3. Enable Google+ API")
    console.log("4. Go to Credentials → Create OAuth 2.0 Client ID")
    console.log("5. Add Authorized JavaScript origins: " + (nextAuthUrl || "http://localhost:3000"))
    console.log(
      "6. Add Authorized redirect URI: " + (nextAuthUrl || "http://localhost:3000") + "/api/auth/callback/google",
    )
    console.log("7. Copy Client ID and Secret to .env.local")
  }

  if (!smtpHost || !smtpUser || !smtpPassword || !smtpFromEmail) {
    console.log("")
    console.log("Email Service Setup:")
    console.log("1. Get SMTP host, port, username, and password from your email provider")
    console.log("2. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM_EMAIL in .env.local")
  }

  console.log("")
  console.log("=".repeat(60))
  console.log("")

  const allConfigured =
    !!googleClientId &&
    !!googleClientSecret &&
    !!smtpHost &&
    !!smtpUser &&
    !!smtpPassword &&
    !!smtpFromEmail &&
    !!nextAuthUrl &&
    !!nextAuthSecret

  if (allConfigured) {
    console.log("✅ All systems are configured!")
    console.log("")
    console.log("Next steps:")
    console.log("1. Run: npm run dev")
    console.log("2. Test Google OAuth sign-up at /auth/signup")
    console.log("3. Check console for any errors")
  } else {
    console.log("❌ Some configurations are missing. Please set them up above.")
  }

  console.log("")
}

diagnoseIssues().catch(console.error)
