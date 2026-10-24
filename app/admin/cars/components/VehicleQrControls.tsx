"use client"

import { useCallback, useEffect, useState } from "react"
import QRCode from "qrcode"
import { Copy, Download, Loader2, Printer, QrCode, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Car } from "@/lib/types"

interface VehicleQrControlsProps {
  car: Car
  autoOpen?: boolean
}

export default function VehicleQrControls({ car, autoOpen = false }: VehicleQrControlsProps) {
  const [open, setOpen] = useState(autoOpen)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [vehicleUrl, setVehicleUrl] = useState("")
  const [qrImage, setQrImage] = useState("")
  const [copied, setCopied] = useState(false)

  const generateQr = useCallback(async () => {
    setLoading(true)
    setError("")
    setQrImage("")

    try {
      const response = await fetch(`/api/admin/cars/${encodeURIComponent(car.id)}/qr`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Unable to get the vehicle URL")
      }

      setVehicleUrl(data.url)
      const image = await QRCode.toDataURL(data.url, {
        errorCorrectionLevel: "H",
        margin: 4,
        width: 1024,
      })
      setQrImage(image)
    } catch (qrError) {
      console.error("Error generating vehicle QR code:", qrError)
      setError(qrError instanceof Error ? qrError.message : "Unable to generate this QR code")
    } finally {
      setLoading(false)
    }
  }, [car.id])

  useEffect(() => {
    if (open) {
      void generateQr()
    }
  }, [open, generateQr])

  const copyVehicleUrl = async () => {
    try {
      await navigator.clipboard.writeText(vehicleUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (copyError) {
      console.error("Error copying vehicle URL:", copyError)
      setError("Could not copy the vehicle URL. Please copy it from the field.")
    }
  }

  return (
    <>
      <Button type="button" variant="outline" className="rounded-full" onClick={() => setOpen(true)}>
        <QrCode className="mr-2 h-4 w-4" />
        View QR code
      </Button>

      {open && (
        <div className="vehicle-qr-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <section
            className="vehicle-qr-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vehicle-qr-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="vehicle-qr-dialog-header">
              <div>
                <h2 id="vehicle-qr-title" className="text-xl font-semibold">Vehicle QR code</h2>
                <p className="text-sm text-muted-foreground">
                  QR code for {car.year} {car.make} {car.model}
                </p>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label="Close QR code dialog" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="vehicle-qr-printable">
              <img className="vehicle-qr-logo" src="/icons/logo-black.png" alt="Hope Autos" />
              <p className="vehicle-qr-brand text-blue-500!">HOPE AUTOS</p>
              <h1>{car.year} {car.make} {car.model}</h1>
              {qrImage ? (
                <img className="vehicle-qr-image" src={qrImage} alt={`QR code linking to ${vehicleUrl}`} />
              ) : (
                <div className="vehicle-qr-image vehicle-qr-image-loading">
                  {loading ? <Loader2 className="h-10 w-10 animate-spin" /> : "QR code unavailable"}
                </div>
              )}
              <p className="vehicle-qr-instruction">SCAN TO VIEW THIS VEHICLE</p>
              <p className="vehicle-qr-url">{vehicleUrl}</p>
            </div>

            <div className="vehicle-qr-screen-actions">
              {error && (
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {error}
                </div>
              )}
              {vehicleUrl && (
                <div className="mb-4">
                  <label htmlFor={`vehicle-url-${car.id}`} className="mb-1 block text-sm font-medium">
                    Permanent vehicle URL
                  </label>
                  <input
                    id={`vehicle-url-${car.id}`}
                    readOnly
                    value={vehicleUrl}
                    className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {error && (
                  <Button type="button" variant="outline" onClick={() => void generateQr()} disabled={loading}>
                    Retry QR generation
                  </Button>
                )}
                {qrImage && (
                  <>
                    <Button type="button" onClick={() => void copyVehicleUrl()}>
                      <Copy className="mr-2 h-4 w-4" />
                      {copied ? "Copied" : "Copy vehicle URL"}
                    </Button>
                    <a
                      className="inline-flex h-10 items-center justify-center rounded-md border border-blue-600 bg-blue-500 px-4 py-2 text-sm text-[#fff] font-medium"
                      href={qrImage}
                      download={`hope-autos-${car.id}-qr.png`}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PNG
                    </a>
                    <Button type="button" variant="outline" onClick={() => window.print()}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print QR label
                    </Button>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
