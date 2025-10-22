import type * as React from "react"

interface WelcomeEmailProps {
  name: string
  email: string
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({ name, email }) => (
  <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
    <div style={{ textAlign: "center", marginBottom: "30px" }}>
      <h1 style={{ color: "#2563eb", fontSize: "28px", margin: "0" }}>Welcome to Hope Autos</h1>
    </div>

    <div style={{ backgroundColor: "#f3f4f6", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
      <p style={{ fontSize: "16px", color: "#374151", margin: "0 0 15px 0" }}>Hi {name},</p>
      <p style={{ fontSize: "16px", color: "#374151", margin: "0 0 15px 0" }}>
        Welcome to Hope Autos! We're excited to have you on board. Your account has been successfully created.
      </p>
      <p style={{ fontSize: "16px", color: "#374151", margin: "0" }}>
        Browse our premium collection of vehicles and find your perfect car today.
      </p>
    </div>

    <div style={{ marginBottom: "20px" }}>
      <h2 style={{ fontSize: "18px", color: "#1f2937", marginBottom: "15px" }}>Getting Started:</h2>
      <ul style={{ fontSize: "14px", color: "#374151", lineHeight: "1.8" }}>
        <li>✓ Browse our latest inventory</li>
        <li>✓ Create a wishlist of your favorite vehicles</li>
        <li>✓ Set up price alerts for your dream cars</li>
        <li>✓ Schedule test drives</li>
      </ul>
    </div>

    <div style={{ backgroundColor: "#dbeafe", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
      <p style={{ fontSize: "14px", color: "#1e40af", margin: "0" }}>
        💡 <strong>Tip:</strong> Enable notifications in your settings to get alerts about new arrivals and price drops.
      </p>
    </div>

    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <a
        href={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/cars`}
        style={{
          display: "inline-block",
          backgroundColor: "#2563eb",
          color: "#ffffff",
          padding: "12px 30px",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        Browse Vehicles
      </a>
    </div>

    <hr style={{ borderColor: "#e5e7eb", margin: "30px 0" }} />

    <div style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
      <p>Hope Autos | Your Trusted Auto Dealership</p>
      <p>
        Questions? Visit our{" "}
        <a href={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/faq`} style={{ color: "#2563eb" }}>
          FAQ page
        </a>{" "}
        or contact our support team.
      </p>
    </div>
  </div>
)