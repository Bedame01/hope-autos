# OAuth & Email Setup Guide

## Issue 1: "Access Denied - You do not have permission to sign in"

### Root Causes
1. ❌ Callback URL not registered in Google Console
2. ❌ Invalid OAuth credentials
3. ❌ NEXTAUTH_URL mismatch
4. ❌ Database issues creating user

### Solution

#### Step 1: Generate NEXTAUTH_SECRET
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

#### Step 2: Update .env.local
\`\`\`bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"
\`\`\`

#### Step 3: Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable "Google+ API"
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Choose "Web application"
6. Add authorized origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`
8. Copy credentials to `.env.local`:
   \`\`\`
   GOOGLE_CLIENT_ID="your-id-here"
   GOOGLE_CLIENT_SECRET="your-secret-here"
   \`\`\`

#### Step 4: Test OAuth Setup
\`\`\`bash
pnpm diagnose-issue
pnpm verify-setup
\`\`\`

---

## Issue 2: Email Delivery System Not Working

### Root Causes
1. ❌ SMTP settings are missing or incorrect
2. ❌ Sender address is not authorized by the provider
3. ❌ Email templates have errors
4. ❌ Environment variables not loaded

### Solution

#### Step 1: Get SMTP Credentials
Ask your email provider for the SMTP hostname, port, username, password, and authorized sender address.

#### Step 2: Configure .env.local
\`\`\`bash
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-smtp-username"
SMTP_PASSWORD="your-smtp-password"
SMTP_FROM_EMAIL="Hope Autos <noreply@example.com>"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
\`\`\`

#### Step 3: Verify SMTP Access
1. Confirm outbound SMTP is allowed from the app host.
2. Use port `465` with `SMTP_SECURE=true` for implicit TLS, or port `587` with `SMTP_SECURE=false` for STARTTLS.
3. Use a sender address authorized by your provider.

#### Step 4: Test Email Service
\`\`\`bash
pnpm verify-setup
\`\`\`

#### Step 5: Check Email Logs
The application will create logs in the console. Check for:
- ✅ "SMTP server connection and authentication successful"

---

## Complete Setup Checklist

### Prerequisites
- [ ] Node.js 18+
- [ ] PostgreSQL database
- [ ] Google Cloud project
- [ ] SMTP email provider
- [ ] Cloudinary account (for images)

### Environment Configuration
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set `DATABASE_URL`
- [ ] Set `NEXTAUTH_SECRET` (generate new)
- [ ] Set `NEXTAUTH_URL` (http://localhost:3000 for dev)
- [ ] Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- [ ] Set SMTP host, port, username, password, and sender address
- [ ] Set `NEXT_PUBLIC_BASE_URL`

### Database Setup
- [ ] Run migrations: `npx prisma migrate dev`
- [ ] Seed data (optional): `npx ts-node scripts/seed.ts`
- [ ] Create admin: `npx ts-node scripts/create-admin.ts`

### OAuth Setup
- [ ] Create Google OAuth credentials
- [ ] Add authorized origins
- [ ] Add authorized redirect URIs
- [ ] Test login at `/auth/signin`

### Email Setup
- [ ] Obtain SMTP credentials
- [ ] Verify SMTP connection and sender address
- [ ] Test email sending

### Verification
- [ ] Run diagnostic: `npx ts-node scripts/diagnose-issues.ts`
- [ ] Run verification: `npx ts-node scripts/verify-setup.ts`
- [ ] Test signup with email
- [ ] Test signup with Google
- [ ] Check email delivery

---

## Troubleshooting

### OAuth Issues

**Q: "Invalid OAuth Client" error**
A: Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET match your Google Console credentials

**Q: "Redirect URI mismatch" error**
A: The redirect URI must exactly match in Google Console:
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

**Q: "Access Denied" on Google sign-in**
A: Ensure:
1. Callback URL added to Google Console
2. NEXTAUTH_SECRET is set
3. NEXTAUTH_URL matches your deployment URL
4. Database is connected

### Email Issues

**Q: "Email service not configured" warning**
A: Set all required SMTP settings in .env.local

**Q: "Failed to send email" error**
A: Check:
1. SMTP host, port, and credentials are valid
2. SMTP_FROM_EMAIL is authorized by your provider
3. Email is in correct format
4. Recipient email is valid

**Q: Emails not arriving**
A: Check:
1. Recipient email spam folder
2. Sender email is authorized by your provider
3. Email domain is not blocked
4. Provider sending limits or account restrictions

---

## Testing Locally

### Test OAuth Sign-up
1. Go to `http://localhost:3000/auth/signup`
2. Click "Sign in with Google"
3. Use your Google account
4. Should redirect to dashboard

### Test Email Sending
1. Go to `http://localhost:3000/auth/signup`
2. Sign up with email/password
3. Check console for email service logs
4. Welcome email should be sent

### Test SMTP Delivery
Verify the SMTP connection and then send a campaign to a controlled subscriber:
\`\`\`bash
pnpm verify-setup
\`\`\`

---

## Production Deployment

### Before Deploying
1. [ ] All environment variables set in hosting platform
2. [ ] Database connection string points to production DB
3. [ ] Google OAuth credentials configured for production domain
4. [ ] SMTP sender address authorized for production domain
5. [ ] NEXTAUTH_SECRET set to secure random value
6. [ ] NODE_ENV set to "production"

### Vercel Deployment
1. Connect your GitHub repository
2. Add environment variables in Settings → Environment Variables
3. Deploy automatically on push to main

### Environment Variables for Vercel
\`\`\`
DATABASE_URL=<production-db-url>
NEXTAUTH_SECRET=<random-secure-secret>
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=<prod-google-id>
GOOGLE_CLIENT_SECRET=<prod-google-secret>
SMTP_HOST=<your-smtp-host>
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<your-smtp-username>
SMTP_PASSWORD=<your-smtp-password>
SMTP_FROM_EMAIL="Hope Autos <noreply@yourdomain.com>"
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
CLOUDINARY_API_KEY=<your-key>
CLOUDINARY_API_SECRET=<your-secret>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud>
\`\`\`

---

## Support

If you encounter issues:
1. Run `npx ts-node scripts/diagnose-issues.ts`
2. Run `npx ts-node scripts/verify-setup.ts`
3. Check console logs for detailed error messages
4. Refer to specific sections above
\`\`\`

Finally, let's update the package.json scripts:
