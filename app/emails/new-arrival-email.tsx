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

export const NewArrivalEmail = ({ name, cars, currency }: NewArrivalEmailProps) => {
  const formatPrice = (price: number) => {
    if (currency === "NGN") {
      return `₦${price.toLocaleString()}`
    }
    return `$${(price / 100).toLocaleString()}`
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#2563eb", fontSize: "28px", margin: "0" }}>🚗 New Vehicles Just In!</h1>
      </div>

      <div style={{ backgroundColor: "#f3f4f6", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <p style={{ fontSize: "16px", color: "#374151", margin: "0" }}>
          Hi {name}, check out {cars.length} brand new vehicles that just arrived at Hope Autos!
        </p>
      </div>

      {cars.map((car, index) => (
        <div
          key={car.id}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
            <div>
              <h3 style={{ margin: "0 0 5px 0", color: "#1f2937" }}>
                {car.year} {car.make} {car.model}
              </h3>
              <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
                {car.fuelType} • {car.transmission} • {car.bodyType}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0", color: "#2563eb", fontWeight: "bold", fontSize: "18px" }}>
                {formatPrice(car.price)}
              </p>
              <p style={{ margin: "5px 0 0 0", color: "#6b7280", fontSize: "12px" }}>
                {car.mileage.toLocaleString()} km
              </p>
            </div>
          </div>
        </div>
      ))}

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
          Browse All Vehicles
        </a>
      </div>

      <div style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
        <p>Hope Autos | Your Trusted Auto Dealership</p>
        <p>
          Don't want to receive these emails?{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/settings`}
            style={{ color: "#2563eb" }}
          >
            Update your preferences
          </a>
        </p>
      </div>
    </div>
  )
}