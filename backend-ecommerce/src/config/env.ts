import dotenv from "dotenv";

dotenv.config();

const required = ["JWT_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

if (
  process.env.NODE_ENV === "production" &&
  process.env.JWT_SECRET === "change-me-in-production"
) {
  throw new Error("JWT_SECRET must be changed before production");
}

function toNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toNumber(process.env.PORT, 8800),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  publicAppUrl: process.env.PUBLIC_APP_URL || "http://localhost:3000",
  whatsappBusinessPhone: process.env.WHATSAPP_BUSINESS_PHONE || "",
} as const;

export function isProduction(): boolean {
  return env.nodeEnv === "production";
}
