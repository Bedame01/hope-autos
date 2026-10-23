# Email Service Checklist

## Configuration

- [ ] SMTP host, port, username, and password supplied by the email provider
- [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM_EMAIL` set in `.env.local`
- [ ] `SMTP_SECURE=true` set for implicit TLS on port 465 (or omitted for port 465); use `false` for STARTTLS on port 587
- [ ] Sender address is authorized by the SMTP provider
- [ ] `NEXT_PUBLIC_BASE_URL` points to the correct app origin
- [ ] Credentials configured in the production hosting environment and not committed

## Implementation

- [ ] React Email templates in `app/emails/`
- [ ] SMTP rendering and sending through `lib/email.ts`
- [ ] Welcome, password-reset, price-alert, and new-arrival email paths use the shared sender
- [ ] Newsletter email includes an unsubscribe link and `List-Unsubscribe` header
- [ ] Failure handling reports per-recipient newsletter delivery counts

## Validation

- [ ] `pnpm diagnose-issue` confirms email settings are present without printing credentials
- [ ] `pnpm verify-setup` can connect and authenticate with SMTP
- [ ] Test a password reset with a controlled account
- [ ] Test a newsletter campaign with a controlled subscriber
- [ ] Confirm newsletter unsubscribe stops future campaigns
- [ ] Check delivery, spam placement, and bounces in the mailbox/provider logs
