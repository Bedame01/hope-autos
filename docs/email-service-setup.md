# Hope Autos - Email Service Setup Guide

## Overview

This guide walks you through integrating Resend as the email service provider for Hope Autos. Resend is a modern email API that provides reliable delivery, beautiful email templates, and excellent developer experience.

**Table of Contents:**
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Email Types](#email-types)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)
- [Best Practices](#best-practices)

## Prerequisites

Before getting started, ensure you have:

- Node.js 16.x or higher
- npm or yarn package manager
- A Resend account (free at https://resend.com)
- PostgreSQL database configured
- Environment variables set up

## Installation

### 1. Install Required Packages

\`\`\`bash
npm install resend react-email
npm install --save-dev @react-email/components
\`\`\`

### 2. Create Resend Account

1. Visit https://resend.com
2. Click "Sign Up"
3. Enter your email and create account
4. Verify your email
5. Go to Dashboard → API Keys
6. Copy your API key

### 3. Set Environment Variables

Create or update `.env.local`:

\`\`\`bash
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev

# Application URL (for email links)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://...
\`\`\`

### 4. Install Dependencies

\`\`\`bash
npm install
npm run dev
\`\`\`

## Configuration

### Email Service File

Location: `lib/email.ts`

This file initializes the Resend client:

\`\`\`typescript
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

export { resend, FROM_EMAIL }
\`\`\`

### Email Service Layer

Location: `lib/email-service.ts`

Contains utility functions:
- `sendPriceAlertToFavorites(carId, oldPrice, newPrice)`
- `sendNewArrivalsNotification(carIds)`

### Database Schema

All email-related models are in `prisma/schema.prisma`:

\`\`\`prisma
model UserPreferences {
  emailNotifications    Boolean  @default(true)
  priceAlerts           Boolean  @default(true)
  newArrivals           Boolean  @default(true)
  // ... other fields
}

model PasswordResetToken {
  userId    String   @unique
  token     String   @unique
  expiresAt DateTime
}
\`\`\`

## Email Types

### 1. Welcome Email

**Location:** `app/emails/welcome-email.tsx`

**Sent On:** User account creation

**Contains:**
- Personalized greeting
- Account activation confirmation
- Getting started guide with 4 key actions
- Call-to-action button to browse vehicles
- FAQ and support links

**Customization:**
- Change company name in footer
- Modify welcome message
- Update action items list

### 2. Forgot Password Email

**Location:** `app/emails/forgot-password-email.tsx`

**Sent On:** Password reset request

**Contains:**
- Secure password reset link (1-hour expiry)
- Security notice
- Backup link for copy-paste
- Support contact information

**Features:**
- Cryptographically secure tokens
- Token expiration for security
- One-time use enforcement
- Fallback copy-paste link

### 3. Price Alert Email

**Location:** `app/emails/price-alert-email.tsx`

**Sent On:** Price drop on favorite car

**Contains:**
- Vehicle details (make, model, year)
- Price comparison (old vs new)
- Savings calculation
- Discount percentage
- Direct link to vehicle

**Customization:**
- Change alert threshold
- Modify savings display
- Update CTA text

### 4. New Arrivals Email

**Location:** `app/emails/new-arrival-email.tsx`

**Sent On:** New vehicles added to inventory

**Contains:**
- List of new vehicles
- Price and mileage per vehicle
- Links to each vehicle
- Browse all vehicles CTA

**Features:**
- Batch email support
- Multiple vehicle display
- Individual vehicle links
- Responsive design

## API Endpoints

### Authentication Routes

#### POST `/api/auth/signup`

Create user account with welcome email.

**Request:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "+1234567890"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "user_cuid",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
\`\`\`

**Email Sent:** Welcome email

---

#### POST `/api/auth/forgot-password`

Send password reset email.

**Request:**
\`\`\`json
{
  "email": "john@example.com"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "If account exists, reset link sent to email"
}
\`\`\`

**Email Sent:** Password reset email with secure token

---

#### POST `/api/auth/reset-password`

Complete password reset with token.

**Request:**
\`\`\`json
{
  "token": "reset_token_from_email",
  "password": "NewPass123",
  "confirmPassword": "NewPass123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Password reset successfully"
}
\`\`\`

---

#### POST `/api/auth/verify-reset-token`

Verify reset token validity.

**Request:**
\`\`\`json
{
  "token": "reset_token"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Token is valid"
}
\`\`\`

### Notification Routes

#### POST `/api/notifications/price-alert`

Send price alert email (requires auth).

**Request:**
\`\`\`json
{
  "carId": "car_cuid",
  "oldPrice": 50000,
  "newPrice": 45000
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Price alert email sent"
}
\`\`\`

---

#### POST `/api/notifications/new-arrivals`

Send new arrivals to subscribed users (bulk).

**Request:**
\`\`\`json
{
  "carIds": ["car_1", "car_2", "car_3"]
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "New arrival notifications sent",
  "usersNotified": 42,
  "failures": 0
}
\`\`\`

### Settings Routes

#### GET `/api/user/preferences`

Get user email preferences (auth required).

**Response (200):**
\`\`\`json
{
  "id": "pref_cuid",
  "emailNotifications": true,
  "priceAlerts": true,
  "newArrivals": true,
  "theme": "light",
  "currency": "USD"
}
\`\`\`

#### PUT `/api/user/preferences`

Update user preferences (auth required).

**Request:**
\`\`\`json
{
  "emailNotifications": true,
  "priceAlerts": false,
  "newArrivals": true
}
\`\`\`

#### GET `/api/user/email-logs`

Get email delivery history (auth required).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response (200):**
\`\`\`json
{
  "logs": [
    {
      "id": "log_1",
      "type": "welcome",
      "recipient": "user@example.com",
      "subject": "Welcome to Hope Autos",
      "status": "delivered",
      "sentAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10
}
\`\`\`

## Testing

### Test Email Addresses

During development, use Resend's test email:
- **Test Email:** `onboarding@resend.dev`
- **No Daily Limits:** Can send unlimited test emails
- **For Production:** Use your verified domain

### Test Workflow

#### 1. Test Welcome Email

\`\`\`bash
# Start application
npm run dev

# Visit signup page
http://localhost:3000/auth/signup

# Create account with test email
Name: Test User
Email: onboarding@resend.dev
Password: TestPass123

# Check Resend dashboard for email
\`\`\`

#### 2. Test Password Reset

\`\`\`bash
# Go to sign in page
http://localhost:3000/auth/signin

# Click "Forgot Password"

# Enter email
Email: onboarding@resend.dev

# Check email for reset link

# Click link and reset password
\`\`\`

#### 3. Test Price Alerts

\`\`\`bash
# Sign in as user
http://localhost:3000/auth/signin

# Add car to favorites
# Click heart icon on car

# Reduce car price via admin panel
http://localhost:3000/admin

# Trigger price alert via API
curl -X POST http://localhost:3000/api/notifications/price-alert \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"carId":"car123","oldPrice":50000,"newPrice":45000}'

# Check email
\`\`\`

#### 4. Test New Arrivals

\`\`\`bash
# Add new cars via admin

# Send notifications
curl -X POST http://localhost:3000/api/notifications/new-arrivals \
  -H "Content-Type: application/json" \
  -d '{"carIds":["car1","car2","car3"]}'

# Check emails
\`\`\`

## Troubleshooting

### Email Not Sending

**Problem:** Email never arrives

**Solutions:**

1. **Check API Key:**
   \`\`\`bash
   echo $RESEND_API_KEY
   # Should show: re_xxxxxxxxxxxx
   \`\`\`

2. **Check Email Address:**
   - During testing: Use `onboarding@resend.dev`
   - Don't use real emails in development

3. **Check Logs:**
   \`\`\`bash
   # Terminal logs should show:
   # "Email sent to onboarding@resend.dev"
   \`\`\`

4. **Verify Resend API:**
   \`\`\`bash
   curl -X GET https://api.resend.com/emails \
     -H "Authorization: Bearer $RESEND_API_KEY"
   \`\`\`

### Emails Going to Spam

**Problem:** Emails appear in spam folder

**Solutions:**

1. **Use Test Email:** `onboarding@resend.dev` won't go to spam

2. **For Production:**
   - Verify custom domain in Resend
   - Add SPF record
   - Add DKIM record
   - Add DMARC record

3. **Check Email Content:**
   - Avoid spam trigger words
   - Use professional formatting
   - Include unsubscribe link

### User Not Receiving Email

**Problem:** Email should work but doesn't arrive

**Diagnostics:**

1. **Check User Preferences:**
   \`\`\`bash
   # In Prisma Studio
   npx prisma studio

   # Go to user_preferences
   # Check emailNotifications = true
   \`\`\`

2. **Check Email Address:**
   \`\`\`bash
   # Verify email format
   # Must be valid email address
   \`\`\`

3. **Check Rate Limits:**
   - Free tier: 100 emails/day
   - Check Resend dashboard

## Production Deployment

### Step 1: Verify Custom Domain

1. In Resend Dashboard: Domains
2. Add your domain (e.g., hopeautos.com)
3. Add DNS records provided:
   - SPF record
   - DKIM record (optional but recommended)
   - DMARC record (optional)
4. Wait for verification

### Step 2: Update Environment

On Vercel:

1. Settings → Environment Variables
2. Add/Update:
   - `RESEND_API_KEY=re_your_key`
   - `RESEND_FROM_EMAIL=noreply@hopeautos.com`
   - `NEXT_PUBLIC_BASE_URL=https://hopeautos.com`

3. Redeploy: `vercel deploy --prod`

### Step 3: Test Production

\`\`\`bash
# Test email delivery
curl -X POST https://hopeautos.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
\`\`\`

### Step 4: Monitor

Resend Dashboard:
- Delivery rate
- Bounce rate
- Open rate
- Click rate

## Best Practices

### 1. Error Handling

Always wrap email sending in try/catch:

\`\`\`typescript
try {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Title",
    react: EmailTemplate(props),
  })
} catch (error) {
  console.error("Email error:", error)
  // Don't block user flow if email fails
}
\`\`\`

### 2. Async Sending

Send emails asynchronously:

\`\`\`typescript
// Don't await email sending in user flows
sendWelcomeEmail(user.email)
  .catch(err => console.error("Email failed:", err))

// Respond immediately to user
return res.json({ success: true })
\`\`\`

### 3. Respect User Preferences

Always check preferences:

\`\`\`typescript
const user = await getUser(userId)
if (user.preferences.emailNotifications) {
  // Send email
}
\`\`\`

### 4. Rate Limiting

Implement rate limits:

\`\`\`typescript
const rateLimit = {
  resetPassword: 3, // per hour
  notifications: 5, // per day
}
\`\`\`

### 5. Unsubscribe Links

Always include in emails:

\`\`\`typescriptreact
<a href={`${BASE_URL}/settings`}>
  Manage email preferences
</a>
\`\`\`

## Support & Resources

- **Resend Docs:** https://resend.com/docs
- **Email Templates:** https://react.email
- **API Reference:** https://resend.com/docs/api-reference
- **Status Page:** https://status.resend.com
- **Support Email:** support@resend.com
\`\`\`

Now the email service checklist:
