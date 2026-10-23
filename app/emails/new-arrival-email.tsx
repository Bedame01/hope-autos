import * as React from "react"
import { Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text } from "@react-email/components"

interface CarPreview {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: string
  bodyType: string
  transmission: string
}

interface NewArrivalEmailProps {
  name: string
  cars: CarPreview[]
  currency: string
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export function NewArrivalEmail({ name, cars, currency }: NewArrivalEmailProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price)

  return (
    <Html>
      <Head />
      <Preview>{`${cars.length} new vehicles just arrived at Hope Autos.`}</Preview>
      <Body style={{ backgroundColor: "#f3f4f6", fontFamily: "Arial, sans-serif", margin: 0, padding: "32px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: "12px", margin: "0 auto", maxWidth: "600px", padding: "32px" }}>
          <Heading style={{ color: "#2563eb", fontSize: "26px" }}>New vehicles just arrived</Heading>
          <Text style={{ color: "#374151", fontSize: "16px" }}>Hi {name}, take a look at our latest inventory:</Text>
          {cars.map((car) => (
            <Section key={car.id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", marginBottom: "12px", padding: "16px" }}>
              <Heading as="h2" style={{ color: "#1f2937", fontSize: "18px", margin: "0 0 8px" }}>
                {`${car.year} ${car.make} ${car.model}`}
              </Heading>
              <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                {`${car.fuelType} · ${car.transmission} · ${car.bodyType} · ${car.mileage.toLocaleString()} km`}
              </Text>
              <Text style={{ color: "#2563eb", fontSize: "18px", fontWeight: "bold" }}>{formatPrice(car.price)}</Text>
              <Link href={`${baseUrl}/cars/${car.id}`} style={{ color: "#2563eb" }}>View vehicle</Link>
            </Section>
          ))}
          <Section style={{ padding: "16px 0", textAlign: "center" }}>
            <Button href={`${baseUrl}/cars`} style={{ backgroundColor: "#2563eb", borderRadius: "6px", color: "#ffffff", padding: "12px 24px", textDecoration: "none" }}>
              Browse all vehicles
            </Button>
          </Section>
          <Text style={{ color: "#6b7280", fontSize: "12px", textAlign: "center" }}>
            Hope Autos | <Link href={`${baseUrl}/settings`} style={{ color: "#2563eb" }}>Manage email preferences</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
