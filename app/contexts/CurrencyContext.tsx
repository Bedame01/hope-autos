"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Currency = "USD" | "NGN"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (curr: Currency) => void
  formatPrice: (price: number) => string
  getCurrencySymbol: () => string
  convertPrice: (price: number, fromCurrency?: Currency) => number
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

const currencySymbols = {
  USD: "$",
  NGN: "₦",
}

const currencyNames = {
  USD: "US Dollar",
  NGN: "Nigerian Naira",
}

// Exchange rates (in a real app, you'd fetch these from an API)
const exchangeRates = {
  USD: 1,
  NGN: 1650, // 1 USD = 1650 NGN (approximate rate)
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>("USD")

  // Load saved currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem("adminCurrency") as Currency
    if (savedCurrency && currencySymbols[savedCurrency]) {
      setCurrency(savedCurrency)
    }
  }, [])

  // Save currency preference to localStorage
  useEffect(() => {
    localStorage.setItem("adminCurrency", currency)
  }, [currency])

  const getCurrencySymbol = (): string => {
    return currencySymbols[currency]
  }

  const convertPrice = (price: number, fromCurrency: Currency = "USD"): number => {
    if (fromCurrency === currency) return price

    // Convert to USD first if needed
    const usdPrice = fromCurrency === "USD" ? price : price / exchangeRates[fromCurrency]

    // Convert from USD to target currency
    return currency === "USD" ? usdPrice : usdPrice * exchangeRates[currency]
  }

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price)
    const symbol = getCurrencySymbol()

    // Format with appropriate locale
    const locale = currency === "NGN" ? "en-NG" : "en-US"
    const formattedNumber = convertedPrice.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

    return `${symbol}${formattedNumber}`
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        getCurrencySymbol,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export { currencySymbols, currencyNames, exchangeRates }
