import * as React from "react"
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components"

interface PriceAlertEmailProps {
  name: string
  carMake: string
  carModel: string
  year: number
  oldPrice: number
  newPrice: number
  discount: number
  carUrl: string
  currency: string
}

export function PriceAlertEmail({
  name,
  carMake,
  carModel,
  year,
  oldPrice,
  newPrice,
  discount,
  carUrl,
  currency,
}: PriceAlertEmailProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price)

  return (
    <Html>
      <Head />
      <Preview>A vehicle in your favorites has dropped in price.</Preview>
      <Body style={{ backgroundColor: "#f3f4f6", fontFamily: "Arial, sans-serif", margin: 0, padding: "32px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: "12px", margin: "0 auto", maxWidth: "600px", padding: "32px" }}>
          <Heading style={{ color: "#2563eb", fontSize: "26px" }}>Price drop alert</Heading>
          <Text style={{ color: "#374151", fontSize: "16px" }}>Hi {name},</Text>
          <Text style={{ color: "#374151", fontSize: "16px", lineHeight: "1.6" }}>
            The {year} {carMake} {carModel} in your favorites has a new price.
          </Text>
          <Section style={{ backgroundColor: "#f3f4f6", borderRadius: "8px", padding: "20px" }}>
            <Text style={{ color: "#6b7280", textDecoration: "line-through" }}>Previous price: {formatPrice(oldPrice)}</Text>
            <Text style={{ color: "#16a34a", fontSize: "20px", fontWeight: "bold" }}>New price: {formatPrice(newPrice)}</Text>
            <Text style={{ color: "#374151" }}>You save {discount}% ({formatPrice(oldPrice - newPrice)}).</Text>
          </Section>
          <Section style={{ padding: "24px 0", textAlign: "center" }}>
            <Button href={carUrl} style={{ backgroundColor: "#2563eb", borderRadius: "6px", color: "#ffffff", padding: "12px 24px", textDecoration: "none" }}>
              View vehicle
            </Button>
          </Section>
          <Text style={{ color: "#6b7280", fontSize: "12px", textAlign: "center" }}>Hope Autos | Your Trusted Auto Dealership</Text>
        </Container>
      </Body>
    </Html>
  )
}
