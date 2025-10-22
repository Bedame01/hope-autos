import type * as React from "react"

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

export const PriceAlertEmail: React.FC<Readonly<PriceAlertEmailProps>> = ({
  name,
  carMake,
  carModel,
  year,
  oldPrice,
  newPrice,
  discount,
  carUrl,
  currency,
}) => (
  <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
    <div style={{ textAlign: "center", marginBottom: "30px" }}>
      <h1 style={{ color: "#2563eb", fontSize: "28px", margin: "0" }}>Price Alert! 🚗</h1>
    </div>

    <div style={{ backgroundColor: "#f3f4f6", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
      <p style={{ fontSize: "16px", color: "#374151", margin: "0 0 15px 0" }}>Hi {name},</p>
      <p style={{ fontSize: "16px", color: "#374151", margin: "0" }}>
        Great news! The price has dropped on a car you're interested in!
      </p>
    </div>

    <div
      style={{
        backgroundColor: "#fef3c7",
        border: "2px solid #fbbf24",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h2 style={{ fontSize: "18px", color: "#92400e", margin: "0 0 15px 0" }}>
        {year} {carMake} {carModel}
      </h2>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 5px 0" }}>Old Price</p>
          <p style={{ fontSize: "18px", color: "#374151", margin: "0", textDecoration: "line-through" }}>
            {currency} {oldPrice.toLocaleString()}
          </p>
        </div>
        <div style={{ fontSize: "28px", color: "#16a34a" }}>→</div>
        <div>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 5px 0" }}>New Price</p>
          <p style={{ fontSize: "24px", color: "#16a34a", margin: "0", fontWeight: "bold" }}>
            {currency} {newPrice.toLocaleString()}
          </p>
        </div>
      </div>
      <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #fbbf24" }}>
        <p style={{ fontSize: "14px", color: "#92400e", margin: "0" }}>
          <strong>
            You Save: {currency} {(oldPrice - newPrice).toLocaleString()} ({discount}%)
          </strong>
        </p>
      </div>
    </div>

    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <a
        href={carUrl}
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
        View Car Details
      </a>
    </div>

    <div style={{ backgroundColor: "#dbeafe", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
      <p style={{ fontSize: "14px", color: "#1e40af", margin: "0" }}>
        💡 Don't miss out! Prices change quickly. View the car now to schedule a test drive.
      </p>
    </div>

    <hr style={{ borderColor: "#e5e7eb", margin: "30px 0" }} />

    <div style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
      <p>Hope Autos | Your Trusted Auto Dealership</p>
      <p>
        Manage your alerts in your{" "}
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/settings`}
          style={{ color: "#2563eb" }}
        >
          settings
        </a>
      </p>
    </div>
  </div>
)