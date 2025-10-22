import type * as React from "react"

interface Car {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: string
  bodyType: string
  images?: string[]
}

interface NewArrivalEmailProps {
  name: string
  cars: Car[]
  currency: string
}

export const NewArrivalEmail: React.FC<Readonly<NewArrivalEmailProps>> = ({ name, cars, currency }) => (
  <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
    <div style={{ textAlign: "center", marginBottom: "30px" }}>
      <h1 style={{ color: "#2563eb", fontSize: "28px", margin: "0" }}>New Vehicles Arrived! 🎉</h1>
    </div>

    <div style={{ backgroundColor: "#f3f4f6", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
      <p style={{ fontSize: "16px", color: "#374151", margin: "0 0 15px 0" }}>Hi {name},</p>
      <p style={{ fontSize: "16px", color: "#374151", margin: "0" }}>
        Check out our latest arrivals! We've added {cars.length} new{cars.length > 1 ? "vehicles" : "vehicle"} to our
        inventory.
      </p>
    </div>

    {cars.map((car, index) => (
      <div
        key={index}
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "15px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
          <div>
            <h3 style={{ fontSize: "16px", color: "#1f2937", margin: "0 0 5px 0", fontWeight: "bold" }}>
              {car.year} {car.make} {car.model}
            </h3>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: "0" }}>
              {car.bodyType} • {car.fuelType} • {car.transmission || "Automatic"}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "18px", color: "#2563eb", margin: "0", fontWeight: "bold" }}>
              {currency} {car.price.toLocaleString()}
            </p>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: "0" }}>{car.mileage.toLocaleString()} km</p>
          </div>
        </div>
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/cars/${car.id}`}
          style={{
            display: "inline-block",
            color: "#2563eb",
            fontSize: "14px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          View Details →
        </a>
      </div>
    ))}

    <div style={{ textAlign: "center", marginBottom: "20px", marginTop: "30px" }}>
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
        Browse All Vehicles
      </a>
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