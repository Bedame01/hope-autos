interface ForgotPasswordEmailProps {
  name: string
  resetLink: string
}

export const ForgotPasswordEmail = ({ name, resetLink }: ForgotPasswordEmailProps) => (
  <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
    <div style={{ textAlign: "center", marginBottom: "30px" }}>
      <h1 style={{ color: "#2563eb", fontSize: "28px", margin: "0" }}>Password Reset Request</h1>
    </div>

    <div style={{ backgroundColor: "#f3f4f6", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
      <p style={{ fontSize: "16px", color: "#374151", margin: "0 0 15px 0" }}>Hi {name},</p>
      <p style={{ fontSize: "16px", color: "#374151", margin: "0 0 15px 0" }}>
        We received a request to reset your password. Click the link below to create a new password:
      </p>
    </div>

    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <a
        href={resetLink}
        style={{
          display: "inline-block",
          backgroundColor: "#dc2626",
          color: "#ffffff",
          padding: "12px 30px",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        Reset Password
      </a>
    </div>

    <div style={{ backgroundColor: "#fef3c7", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
      <p style={{ fontSize: "14px", color: "#92400e", margin: "0" }}>
        ⚠️ <strong>This link expires in 24 hours.</strong> If you didn't request this, please ignore this email.
      </p>
    </div>

    <div
      style={{
        fontSize: "12px",
        color: "#6b7280",
        marginTop: "30px",
        paddingTop: "20px",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <p style={{ margin: "5px 0" }}>Hope Autos | Your Trusted Auto Dealership</p>
      <p style={{ margin: "5px 0" }}>If you have any questions, contact our support team.</p>
    </div>
  </div>
)