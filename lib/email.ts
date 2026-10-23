import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import type { ReactElement } from "react"

let transporter: nodemailer.Transporter | undefined

function getSmtpConfig() {
  const port = Number(process.env.SMTP_PORT || 587)
  const secureSetting = process.env.SMTP_SECURE?.toLowerCase()
  const secure = secureSetting === undefined ? port === 465 : secureSetting === "true"

  if (
    !process.env.SMTP_HOST ||
    !Number.isInteger(port) ||
    port <= 0 ||
    port > 65535 ||
    (secureSetting !== undefined && secureSetting !== "true" && secureSetting !== "false") ||
    !process.env.SMTP_FROM_EMAIL ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    return null
  }

  return {
    host: process.env.SMTP_HOST,
    port,
    secure,
    from: process.env.SMTP_FROM_EMAIL,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  }
}

export const isEmailServiceConfigured = () => getSmtpConfig() !== null

function getTransporter() {
  const smtp = getSmtpConfig()
  if (!smtp) {
    throw new Error("SMTP email delivery is not configured.")
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    })
  }

  return { transporter, from: smtp.from }
}

export async function sendEmail({
  to,
  subject,
  react,
  text,
  headers,
}: {
  to: string
  subject: string
  react: ReactElement
  text?: string
  headers?: Record<string, string>
}) {
  const html = await render(react)
  const { transporter: smtp, from } = getTransporter()
  return smtp.sendMail({
    from,
    to,
    subject,
    html,
    text,
    headers,
  })
}

export async function verifyEmailConnection() {
  const { transporter: smtp } = getTransporter()
  await smtp.verify()
}
