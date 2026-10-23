import * as React from "react"
import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from "@react-email/components"

interface NewsletterEmailProps {
  subject: string
  message: string
  unsubscribeUrl: string
}

export function NewsletterEmail({ subject, message, unsubscribeUrl }: NewsletterEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={{ backgroundColor: "#f3f4f6", fontFamily: "Arial, sans-serif", margin: 0, padding: "32px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: "12px", margin: "0 auto", maxWidth: "600px", padding: "32px" }}>
          <Text style={{ color: "#2563eb", fontSize: "12px", fontWeight: "bold", letterSpacing: "3px" }}>HOPE AUTOS</Text>
          <Heading style={{ color: "#171717", fontSize: "28px", lineHeight: "1.2" }}>{subject}</Heading>
          <Section>
            {message.split(/\n{2,}/).map((paragraph, index) => (
              <Text key={index} style={{ color: "#374151", fontSize: "16px", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                {paragraph}
              </Text>
            ))}
          </Section>
          <Text style={{ color: "#737373", fontSize: "12px", lineHeight: "1.6", marginTop: "32px" }}>
            You are receiving this email because you subscribed to Hope Autos updates.{" "}
            <Link href={unsubscribeUrl} style={{ color: "#2563eb" }}>Unsubscribe</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
