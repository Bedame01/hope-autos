export function getVehicleUrl(carId: string) {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL

  if (!configuredBaseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL must be configured to generate vehicle URLs")
  }

  let baseUrl: URL
  try {
    baseUrl = new URL(configuredBaseUrl)
  } catch {
    throw new Error("NEXT_PUBLIC_BASE_URL must be a valid absolute URL")
  }

  if (
    !["http:", "https:"].includes(baseUrl.protocol) ||
    baseUrl.pathname !== "/" ||
    baseUrl.username ||
    baseUrl.password ||
    baseUrl.search ||
    baseUrl.hash ||
    (process.env.NODE_ENV === "production" &&
      (baseUrl.protocol !== "https:" ||
        ["localhost", "127.0.0.1", "::1"].includes(baseUrl.hostname) ||
        baseUrl.hostname.endsWith(".localhost")))
  ) {
    throw new Error("NEXT_PUBLIC_BASE_URL must be a valid HTTPS site URL in production")
  }

  return new URL(`/cars/${encodeURIComponent(carId)}`, baseUrl.origin).toString()
}
