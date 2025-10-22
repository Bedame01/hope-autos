# Hope Autos Email Service Implementation Checklist

## Pre-Setup Verification

- [ ] Node.js 16+ installed
- [ ] npm/yarn available
- [ ] PostgreSQL database configured
- [ ] Git repository initialized
- [ ] `.env.local` file exists

## Installation Steps

- [ ] Run `npm install resend react-email`
- [ ] Create Resend account at https://resend.com
- [ ] Copy API key from Resend Dashboard
- [ ] Add `RESEND_API_KEY` to `.env.local`
- [ ] Set `RESEND_FROM_EMAIL=onboarding@resend.dev` for testing
- [ ] Set `NEXT_PUBLIC_BASE_URL=http://localhost:3000`

## File Structure

- [ ] `lib/email.ts` - Created and configured
- [ ] `lib/email-service.ts` - Created with utility functions
- [ ] `app/emails/welcome-email.tsx` - Created
- [ ] `app/emails/forgot-password-email.tsx` - Created
- [ ] `app/emails/price-alert-email.tsx` - Created
- [ ] `app/emails/new-arrival-email.tsx` - Created

## API Routes

- [ ] `app/api/auth/signup/route.ts` - Welcome email integration
- [ ] `app/api/auth/forgot-password/route.ts` - Reset email
- [ ] `app/api/auth/reset-password/route.ts` - Complete reset
- [ ] `app/api/auth/verify-reset-token/route.ts` - Token validation
- [ ] `app/api/notifications/price-alert/route.ts` - Price alerts
- [ ] `app/api/notifications/new-arrivals/route.ts` - New arrivals
- [ ] `app/api/user/email-logs/route.ts` - Email history
- [ ] `app/api/notifications/email/route.ts` - Email preferences

## UI Pages

- [ ] `app/faq/page.tsx` - FAQ page created
- [ ] `app/faq/loading.tsx` - Loading state
- [ ] `app/auth/forgot-password/page.tsx` - Password reset form
- [ ] `app/auth/forgot-password/loading.tsx` - Loading state
- [ ] `app/auth/reset-password/page.tsx` - Reset form with token
- [ ] `app/auth/reset-password/loading.tsx` - Loading state
- [ ] `app/settings/page.tsx` - Email preferences UI

## Database Setup

- [ ] Prisma schema updated with all models
- [ ] `PasswordResetToken` model added
- [ ] `UserPreferences` model has email fields
- [ ] Run `npx prisma migrate dev`
- [ ] Database tables created

## Configuration Files

- [ ] `.env.example` updated with email variables
- [ ] `.env.local` has all required variables
- [ ] `next.config.mjs` configured
- [ ] `tsconfig.json` valid

## Script Setup

- [ ] `scripts/create-admin.ts` - Admin creation script
- [ ] Run `npx ts-node scripts/create-admin.ts`
- [ ] Admin user created successfully

## Documentation

- [ ] `docs/email-service-setup.md` - Complete guide created
- [ ] All sections properly formatted
- [ ] Code examples working
- [ ] Links verified

## Local Testing

### Welcome Email
- [ ] User signup works
- [ ] Welcome email sent to `onboarding@resend.dev`
- [ ] Email contains correct content
- [ ] Links work correctly

### Password Reset
- [ ] Forgot password form loads
- [ ] Email sent on form submission
- [ ] Reset link works
- [ ] Token expires after 1 hour
- [ ] New password accepted

### Preferences
- [ ] Settings page loads
- [ ] Email preferences toggle works
- [ ] Preferences save to database
- [ ] Saved state persists on reload

### Email Logs
- [ ] User can view email history
- [ ] Pagination works
- [ ] Email types display correctly
- [ ] Delivery status shown

## Integration Testing

- [ ] All API endpoints respond correctly
- [ ] Error handling works
- [ ] Success messages display
- [ ] Failed emails don't crash app
- [ ] User preferences respected

## Security Checklist

- [ ] API key not exposed in code
- [ ] `.env.local` is gitignored
- [ ] Reset tokens are hashed
- [ ] Tokens expire after 1 hour
- [ ] Password validation enforced
- [ ] Rate limiting implemented

## Email Content Verification

- [ ] Welcome email has brand colors
- [ ] Footer includes company info
- [ ] All links use `NEXT_PUBLIC_BASE_URL`
- [ ] Email templates are responsive
- [ ] Mobile preview looks good

## Performance Testing

- [ ] Email sending < 2 seconds
- [ ] No blocking on user actions
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Error handling efficient

## Production Readiness

- [ ] Custom domain verified in Resend
- [ ] SPF record added to DNS
- [ ] DKIM records configured
- [ ] Monitoring dashboard set up
- [ ] Alert thresholds configured

## Deployment Steps

- [ ] Production `.env` configured
- [ ] `RESEND_FROM_EMAIL=noreply@hopeautos.com`
- [ ] `NEXT_PUBLIC_BASE_URL=https://hopeautos.com`
- [ ] Deploy to production
- [ ] Test email delivery in prod
- [ ] Monitor for failures

## Post-Deployment

- [ ] Check Resend Dashboard daily
- [ ] Monitor delivery rates
- [ ] Review bounce rates
- [ ] Check spam complaints
- [ ] Verify link clicks tracked

## Sign-Off

- [ ] All checklist items completed
- [ ] Testing successful
- [ ] Documentation complete
- [ ] Ready for production
- [ ] Stakeholder approval obtained

**Date Completed:** _______________
**Completed By:** _______________
**Reviewed By:** _______________

## Notes

Add any additional notes or issues encountered:

_________________________________________________
_________________________________________________
_________________________________________________
