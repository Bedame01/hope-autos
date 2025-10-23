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

export const PriceAlertEmail = ({
  name,
  carMake,
  carModel,
  year,
  oldPrice,
  newPrice,
  discount,
  carUrl,
  currency,
}: PriceAlertEmailProps) => {
  const formatPrice = (price: number) => {
    if (currency === "NGN") {
      return `₦${price.toLocaleString()}`
    }
    return `$${(price / 100).toLocaleString()}`
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#2563eb", fontSize: "28px", margin: "0" }}>💰 Price Drop Alert!</h1>
      </div>

      <div style={{ backgroundColor: "#dbeafe", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <p style={{ fontSize: "16px", color: "#374151", margin: "0 0 15px 0" }}>Hi {name},</p>
        <p style={{ fontSize: "16px", color: "#374151", margin: "0 0 15px 0" }}>
          Great news! The{" "}
          <strong>
            {year} {carMake} {carModel}
          </strong>{" "}
          you liked has dropped in price!
        </p>
      </div>

      <div style={{ backgroundColor: "#f3f4f6", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ color: "#374151" }}>Original Price:</span>
          <span style={{ color: "#6b7280", textDecoration: "line-through" }}>{formatPrice(oldPrice)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ color: "#374151" }}>New Price:</span>
          <span style={{ color: "#16a34a", fontWeight: "bold", fontSize: "18px" }}>{formatPrice(newPrice)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "10px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <span style={{ color: "#374151" }}>You Save:</span>
          <span style={{ color: "#16a34a", fontWeight: "bold" }}>
            {discount}% ({formatPrice(oldPrice - newPrice)})
          </span>
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
          View Vehicle
        </a>
      </div>

      <div style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
        <p>Don't miss this opportunity!</p>
        <p>Hope Autos | Your Trusted Auto Dealership</p>
      </div>
    </div>
  )
}