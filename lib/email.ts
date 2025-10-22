import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@hope-autos.com"
const COMPANY_NAME = "Hope Autos"

export { resend, FROM_EMAIL, COMPANY_NAME }