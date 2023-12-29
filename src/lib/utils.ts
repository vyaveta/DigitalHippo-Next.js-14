import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "INR" | "GBP" | "BDT",
    notation?: Intl.NumberFormatOptions["notation"]
  } = {}
){
  const {currency = "INR", notation = "compact"} = options // setting up the default values if the options doesnt include currency or notation
  const numericPrice = typeof price === "string" ? parseFloat(price) : price

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2
  }).format(numericPrice)
} 