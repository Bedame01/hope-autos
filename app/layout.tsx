import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "./components/Header"
// import Footer from "./components/Footer"
import { AuthProvider } from "./components/AuthProvider"
import { ThemeProvider } from "./components/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"

import favicon from '@/public/icons/logo-icon.png'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hope Autos - Limited",
  description: "Find your perfect car at Hope Autos. Quality pre-owned and new vehicles with excellent service.",
  keywords: "hope cars, hope autos limited, Hope Autos, Ride like a boss, cars, dealership, automotive, used cars, new cars, nigeria car, car dealership,"
    // generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
    {/* <!-- Inter & Inter Tight Font --> */}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
    {/* Favicon */}
    <link rel="icon" href={favicon.src} type="image/png" />

    {/* Rubik Font */}
    <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet"></link>

    {/* <!-- Alkatra Font --> */}
    <link href="https://fonts.googleapis.com/css2?family=Norican&display=swap" rel="stylesheet" />
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"></link>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
      </head>
      <body className='bg-gradient-to-br from-background via-background to-muted'>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            {/* <Footer /> */}
            <script>
              AOS.init();
            </script>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
