# Hope Autos Email Service Setup

Hope Autos renders email templates with React Email and sends them through an SMTP server using Nodemailer. The same setup is used for newsletter campaigns, password resets, welcome messages, price alerts, and new-arrival notifications.

## Configure SMTP

Set these variables in `.env.local` for development and in your hosting provider for production:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_EMAIL="Hope Autos <noreply@example.com>"
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Use the SMTP hostname, port, credentials, and permitted sender address supplied by your email provider. For implicit TLS, use port `465` and set `SMTP_SECURE=true`; port `587` with `SMTP_SECURE=false` uses STARTTLS. `SMTP_SECURE` can be omitted, in which case it defaults to `true` only for port `465`.

All five `SMTP_*` values are required to enable delivery. Do not commit SMTP credentials.

## Templates and delivery

- React Email templates live in `app/emails/`.
- `lib/email.ts` renders each React Email component to HTML and sends it through Nodemailer.
- `lib/email-service.ts` contains reusable welcome, password-reset, price-alert, and new-arrival sending functions.
- Admin newsletter campaigns use the `NewsletterEmail` React Email template and include an unsubscribe link and `List-Unsubscribe` header.

## Verify configuration

```powershell
pnpm diagnose-issue
pnpm verify-setup
```

The diagnostic reports whether each SMTP setting is present without displaying the password. The verification script checks the database connection and verifies the SMTP server connection and authentication without sending a test email.

For delivery testing, submit a newsletter to an address you control from the admin newsletter page. Check the application logs and the receiving mailbox's spam folder if it does not arrive.

## Troubleshooting

- **SMTP is not configured:** Check that all required `SMTP_*` settings are set in the runtime environment.
- **Connection timeout or refused:** Confirm `SMTP_HOST`, `SMTP_PORT`, and outbound SMTP access from your hosting provider.
- **Authentication failure:** Verify `SMTP_USER` and `SMTP_PASSWORD` with your email provider.
- **TLS error:** Match `SMTP_SECURE` to the provider's port requirements; use `true` for implicit TLS on port `465`, and `false` for STARTTLS on port `587`.
- **Sender rejected:** Use an address or domain authorized by your SMTP provider in `SMTP_FROM_EMAIL`.
- **Incorrect links:** Set `NEXT_PUBLIC_BASE_URL` to the public application origin in production.
