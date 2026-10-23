"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Currency = "USD" | "NGN"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (curr: Currency) => void
  exchangeRate: number
  setExchangeRate: (rate: number) => void
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
  const [exchangeRate, setExchangeRate] = useState(exchangeRates.NGN)

  useEffect(() => {
    const savedCurrency = (localStorage.getItem("adminCurrency") || localStorage.getItem("currency")) as Currency
    if (savedCurrency && currencySymbols[savedCurrency]) {
      setCurrency(savedCurrency)
    }

    const loadExchangeRate = async () => {
      try {
        const response = await fetch("/api/currency")
        if (!response.ok) throw new Error("Unable to load currency exchange rate")

        const data: { exchangeRate: number } = await response.json()
        if (!Number.isFinite(data.exchangeRate) || data.exchangeRate <= 0) {
          throw new Error("Currency exchange rate is invalid")
        }

        setExchangeRate(data.exchangeRate)
        localStorage.setItem("hope-autos-exchange-rate", String(data.exchangeRate))
      } catch (error) {
        console.error("Error loading currency exchange rate:", error)
      }
    }

    const savedRate = Number(localStorage.getItem("hope-autos-exchange-rate"))
    if (Number.isFinite(savedRate) && savedRate > 0) setExchangeRate(savedRate)

    const onExchangeRateUpdated = () => void loadExchangeRate()
    window.addEventListener("currency-rate-updated", onExchangeRateUpdated)
    void loadExchangeRate()
    return () => window.removeEventListener("currency-rate-updated", onExchangeRateUpdated)
  }, [])

  useEffect(() => {
    localStorage.setItem("adminCurrency", currency)
    localStorage.setItem("currency", currency)
  }, [currency])

  const updateExchangeRate = (rate: number) => {
    setExchangeRate(rate)
    localStorage.setItem("hope-autos-exchange-rate", String(rate))
    window.dispatchEvent(new Event("currency-rate-updated"))
  }

  const getCurrencySymbol = (): string => {
    return currencySymbols[currency]
  }

  const convertPrice = (price: number, fromCurrency: Currency = "USD"): number => {
    if (fromCurrency === currency) return price

    // Convert to USD first if needed
    const usdPrice = fromCurrency === "USD" ? price : price / exchangeRate

    return currency === "USD" ? usdPrice : usdPrice * exchangeRate
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
        exchangeRate,
        setExchangeRate: updateExchangeRate,
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
