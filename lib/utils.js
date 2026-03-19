import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const INR_LOCALE = "en-IN"
const INR_CURRENCY = "INR"

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function roundCurrency(value) {
  const amount = toNumber(value)
  return Math.round((amount + Number.EPSILON) * 100) / 100
}

export function formatINR(value, options = {}) {
  const amount = toNumber(value)
  return new Intl.NumberFormat(INR_LOCALE, {
    style: "currency",
    currency: INR_CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount)
}

export function formatIndianNumber(value, options = {}) {
  const amount = toNumber(value)
  return new Intl.NumberFormat(INR_LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount)
}

export function calculateINRFees(subtotal, rates = {}) {
  const serviceFeeRate = rates.serviceFeeRate ?? 0.05
  const processingFeeRate = rates.processingFeeRate ?? 0.03
  const taxRate = rates.taxRate ?? 0.18

  const normalizedSubtotal = toNumber(subtotal)
  const serviceFee = roundCurrency(normalizedSubtotal * serviceFeeRate)
  const processingFee = roundCurrency(normalizedSubtotal * processingFeeRate)
  const tax = roundCurrency((normalizedSubtotal + serviceFee + processingFee) * taxRate)

  return {
    serviceFee,
    processingFee,
    tax,
  }
}
