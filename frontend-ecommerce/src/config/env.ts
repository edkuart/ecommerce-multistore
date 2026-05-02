export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8800",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  whatsappPhone: process.env.NEXT_PUBLIC_WA_PHONE || "50200000000",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "GTQ",
} as const;
