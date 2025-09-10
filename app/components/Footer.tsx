'use client'

import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import Image from "next/image"

import logoWhite from '@/public/icons/logo-white.png'
import logoBlack from '@/public/icons/logo-black.png'
import { useTheme } from "next-themes"

export default function Footer() {
  const { theme, setTheme } = useTheme()

  return (
    <footer className="bg-[var(--background)] text-[var(--text-color)] border-t border-[var(--border-line)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image src={theme === "dark" ? logoWhite : theme === 'light' ? logoBlack : logoWhite} alt='logo' className="max-sm:w-8 w-10 h-auto text-blue-600" />
                <span className="text-2xl font-bold text-gray-900 tracking-[-1px]">Hope <span className="text-blue-600">Autos.</span></span>
              </Link>
            </div>
            <p className="text-[var(--foreground)] mb-4">
              Your trusted partner in finding the perfect vehicle. We offer quality cars, exceptional service, and
              competitive prices.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>(234) 8133531046 | (234) 8122770203</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <a href="mailto: talk2hopeautos@gmail.com" className="hover:text-blue-600">talk2hopeautos@gmail.com</a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>36 Adedayo House, Cement bus-stop, Beside Quest filling station, Lagos.</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cars" className="text-[var(--text-color)] hover:text-gray-500">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[var(--text-color)] hover:text-gray-500">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--text-color)] hover:text-gray-500">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-[var(--text-color)] hover:text-gray-500">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Services</h3>
            <ul className="space-y-2">
              <li>
                <p className="text-[var(--text-color)] hover:text-gray-500">
                  Auto Sales
                </p>
              </li>
              <li>
                <p className="text-[var(--text-color)] hover:text-gray-500">
                  Auto Engineering Pre-Order
                </p>
              </li>
              <li>
                <p className="text-[var(--text-color)] hover:text-gray-500">
                  Car Loan
                </p>
              </li>
              <li>
                <p className="text-[var(--text-color)] hover:text-gray-500">
                  Direct Import
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className="border-t border-[var(--border-line)] mt-8 pt-8 text-center">
          <p className="text-[var(--text-color)]">
            © {new Date().getFullYear()} Hope Autos. All rights reserved. |
            <Link href="/privacy" className="hover:text-gray-500 ml-1">
              Privacy Policy
            </Link>{" "}
            |
            <Link href="/terms" className="hover:text-gray-500 ml-1">
              Terms of Service
            </Link>
          </p>
        </div> */}
        <div className="border-t border-[var(--border-line)] mt-8 pt-8 md:pt-10 text-center text-sm sm:text-base">
          <p className="text-[var(--text-color)] mb-1.5">
            © {new Date().getFullYear()} Hope Autos Limited. All rights reserved.
          </p>
          <p className="text-[var(--text-color)]">No 1 Nigeria Best Vehicle Dealership</p>
        </div>
      </div>
    </footer>
  )
}
