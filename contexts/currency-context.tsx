"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type Currency = "EUR" | "USD" | "MAD"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatPrice: (priceInEur: number) => string
  getCurrencySymbol: () => string
  formatPriceWithSymbol: (priceInEur: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Conversion rates (1 EUR = base)
const CONVERSION_RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 1.1, // 1 EUR = 1.1 USD
  MAD: 11,  // 1 EUR = 11 MAD
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("EUR")

  const formatPrice = (priceInEur: number): string => {
    const convertedPrice = priceInEur * CONVERSION_RATES[currency]
    return convertedPrice.toFixed(2)
  }

  const getCurrencySymbol = (): string => {
    switch (currency) {
      case "USD":
        return "$"
      case "MAD":
        return "DH"
      case "EUR":
      default:
        return "€"
    }
  }

  const formatPriceWithSymbol = (priceInEur: number): string => {
    const formattedPrice = formatPrice(priceInEur)
    if (currency === "MAD") {
      return `${formattedPrice} DH`
    }
    return `${getCurrencySymbol()}${formattedPrice}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, getCurrencySymbol, formatPriceWithSymbol }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

