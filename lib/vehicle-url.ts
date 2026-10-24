export function getVehicleUrl(carId: string) {
  const isProduction = process.env.NODE_ENV === "production"
  const productionBaseUrl = "https://hope-autos.com"
  const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim()

  let baseUrlValue = configuredBaseUrl || (isProduction ? productionBaseUrl : "")
  if (!baseUrlValue) {
    throw new Error("NEXT_PUBLIC_BASE_URL must be configured to generate vehicle URLs")
  }

  let baseUrl: URL
  try {
    baseUrl = new URL(baseUrlValue)
  } catch {
    throw new Error("NEXT_PUBLIC_BASE_URL must be a valid absolute URL")
  }

  const hostname = baseUrl.hostname.replace(/^\[|\]$/g, "")
  const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(hostname) || hostname.endsWith(".localhost")
  if (isProduction && isLocalHost) {
    baseUrlValue = productionBaseUrl
    baseUrl = new URL(baseUrlValue)
  }

  if (
    !["http:", "https:"].includes(baseUrl.protocol) ||
    baseUrl.pathname !== "/" ||
    baseUrl.username ||
    baseUrl.password ||
    baseUrl.search ||
    baseUrl.hash ||
    (isProduction && baseUrl.protocol !== "https:")
  ) {
    throw new Error("NEXT_PUBLIC_BASE_URL must be a valid HTTPS site URL in production")
  }

  return new URL(`/cars/${encodeURIComponent(carId)}`, baseUrl.origin).toString()
}
