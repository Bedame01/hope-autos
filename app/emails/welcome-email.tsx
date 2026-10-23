import * as React from "react"
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface WelcomeEmailProps {
  name: string
  email: string
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export function WelcomeEmail({ name, email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Hope Autos — your account is ready.</Preview>
      <Body style={{ backgroundColor: "#f3f4f6", fontFamily: "Arial, sans-serif", margin: 0, padding: "32px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: "12px", margin: "0 auto", maxWidth: "600px", padding: "32px" }}>
          <Heading style={{ color: "#2563eb", fontSize: "28px", textAlign: "center" }}>Welcome to Hope Autos</Heading>
          <Text style={{ color: "#374151", fontSize: "16px" }}>Hi {name},</Text>
          <Text style={{ color: "#374151", fontSize: "16px", lineHeight: "1.6" }}>
            Your account has been created. Browse our premium collection and find your perfect car.
          </Text>
          <Section style={{ textAlign: "center", padding: "16px 0 24px" }}>
            <Button href={`${baseUrl}/cars`} style={{ backgroundColor: "#2563eb", borderRadius: "6px", color: "#ffffff", padding: "12px 24px", textDecoration: "none" }}>
              Browse vehicles
            </Button>
          </Section>
          <Text style={{ color: "#6b7280", fontSize: "14px" }}>
            You can save favorite vehicles and manage price alerts in your account settings for {email}.
          </Text>
          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
          <Text style={{ color: "#6b7280", fontSize: "12px", textAlign: "center" }}>
            Hope Autos | <Link href={`${baseUrl}/faq`} style={{ color: "#2563eb" }}>Visit our FAQ</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
