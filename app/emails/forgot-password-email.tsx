import * as React from "react"
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Text } from "@react-email/components"

interface ForgotPasswordEmailProps {
  name: string
  resetLink: string
}

export function ForgotPasswordEmail({ name, resetLink }: ForgotPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Hope Autos password.</Preview>
      <Body style={{ backgroundColor: "#f3f4f6", fontFamily: "Arial, sans-serif", margin: 0, padding: "32px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: "12px", margin: "0 auto", maxWidth: "600px", padding: "32px" }}>
          <Heading style={{ color: "#2563eb", fontSize: "26px" }}>Password reset request</Heading>
          <Text style={{ color: "#374151", fontSize: "16px" }}>Hi {name},</Text>
          <Text style={{ color: "#374151", fontSize: "16px", lineHeight: "1.6" }}>
            We received a request to reset your password. Use the button below to choose a new one.
          </Text>
          <Button href={resetLink} style={{ backgroundColor: "#2563eb", borderRadius: "6px", color: "#ffffff", display: "inline-block", padding: "12px 24px", textDecoration: "none" }}>
            Reset password
          </Button>
          <Text style={{ color: "#92400e", fontSize: "14px", lineHeight: "1.6", marginTop: "24px" }}>
            This link expires in 1 hour. If you didn’t request a reset, you can ignore this email.
          </Text>
          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
          <Text style={{ color: "#6b7280", fontSize: "12px" }}>Hope Autos | Your Trusted Auto Dealership</Text>
        </Container>
      </Body>
    </Html>
  )
}
