# Resend Email Service Setup Guide

This guide will help you set up Resend for sending transactional emails from Hope Autos.

## What is Resend?

Resend is a modern email API built for developers. It provides:
- Easy-to-use API
- React email components
- Excellent deliverability
- Real-time analytics

## Setup Steps

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Click "Sign Up"
3. Complete the registration process
4. Verify your email address

### 2. Create an API Key

1. Go to the [Resend Dashboard](https://dashboard.resend.com)
2. Click on "API Keys" in the left sidebar
3. Click "Create API Key"
4. Give it a name (e.g., "Hope Autos Production")
5. Copy the API key

### 3. Configure Your Domain

For production, you'll want to use your own domain:

1. In the Resend Dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., mail.hope-autos.com)
4. Follow the DNS configuration steps
5. Verify the domain

### 4. Environment Variables

Add the following to your `.env.local` file:

\`\`\`bash
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@your-domain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
\`\`\`

For development, you can use:
\`\`\`bash
RESEND_FROM_EMAIL=onboarding@resend.dev
\`\`\`

### 5. Install Resend SDK

The SDK is already included in the package.json:

\`\`\`bash
npm install resend
\`\`\`

## Email Templates

All email templates are created as React components in `/app/emails/`:

- `welcome-email.tsx` - Sent on user signup
- `forgot-password-email.tsx` - Password reset emails
- `price-alert-email.tsx` - Price drop notifications
- `new-arrival-email.tsx` - New vehicle notifications

## Testing Emails

### Development

During development, use the test domain:

\`\`\`bash
RESEND_FROM_EMAIL=onboarding@resend.dev
\`\`\`

This is a special domain Resend provides for testing.

### Production

For production:

1. Use your verified domain
2. Use a production API key
3. Set proper environment variables

## Email Limits

**Free Plan:**
- Up to 100 emails/day
- Resend domain only

**Pro Plan:**
- Up to 100,000 emails/month
- Custom domains

## Monitoring Emails

In the Resend Dashboard, you can:

1. View all sent emails
2. Check delivery status
3. View bounce/complaint rates
4. Monitor open and click rates
5. View email logs

## Troubleshooting

### Email Not Sending

1. Check API key is correct
2. Verify FROM_EMAIL is allowed
3. Check email address format
4. Review error logs in terminal

### Domain Configuration

1. Verify DNS records are correctly set
2. Wait 24 hours for propagation
3. Use DNS checker tools to verify

### Rate Limiting

If you hit rate limits:
- Wait before retrying
- Upgrade to a higher plan
- Batch send operations

## Cost

- **Free:** 100 emails/day, Resend domain
- **Pro:** $20/month for 100k emails/month
- **Enterprise:** Custom pricing

## Support

- Documentation: [docs.resend.com](https://docs.resend.com)
- Email: support@resend.com
- Discord Community: Join their Discord

## Next Steps

1. ✅ Create Resend account
2. ✅ Generate API key
3. ✅ Add environment variables
4. ✅ Test with welcome email
5. ✅ Monitor in Resend Dashboard
6. ✅ Configure custom domain (production)
