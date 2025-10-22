import type * as React from "react"

interface ForgotPasswordEmailProps {
  name: string
  resetUrl: string
}

export const ForgotPasswordEmail: React.FC<Readonly<ForgotPasswordEmailProps>> = ({ name, resetUrl }) => (
  <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
    <div style={{ textAlign: "center", marginBottom: "30px" }}>
      <h1 style={{ color: "#2563eb", fontSize: "28px", margin: "0" }}>Reset Your Password</h1>
    </div>

    <div style={{ backgroundColor: "#f3f4f6", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
      <p style={{ fontSize: "16px", color: "#374151", margin: "0 0 15px 0" }}>Hi {name},</p>
      <p style={{ fontSize: "16px", color: "#374151", margin: "0 0 15px 0" }}>
        We received a request to reset your password. Click the button below to create a new password.
      </p>
      <p style={{ fontSize: "14px", color: "#6b7280", margin: "0" }}>
        This link will expire in 1 hour for security reasons.
      </p>
    </div>

    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <a
        href={resetUrl}
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
        Reset Password
      </a>
    </div>

    <div style={{ backgroundColor: "#fee2e2", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
      <p style={{ fontSize: "14px", color: "#991b1b", margin: "0" }}>
        <strong>Security Notice:</strong> If you didn't request this, please ignore this email or contact our support
        team immediately.
      </p>
    </div>

    <div style={{ backgroundColor: "#f0fdf4", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
      <p style={{ fontSize: "14px", color: "#166534", margin: "0" }}>
        Or copy and paste this link in your browser: <br />
        <code
          style={{
            fontSize: "12px",
            wordBreak: "break-all",
            color: "#166534",
          }}
        >
          {resetUrl}
        </code>
      </p>
    </div>

    <hr style={{ borderColor: "#e5e7eb", margin: "30px 0" }} />

    <div style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
      <p>Hope Autos | Your Trusted Auto Dealership</p>
      <p>This is an automated security email. Please do not reply.</p>
    </div>
  </div>
)