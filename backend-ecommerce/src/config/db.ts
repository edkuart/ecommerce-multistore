import "./env";
import dns from "dns";
import { Sequelize } from "sequelize";

dns.setDefaultResultOrder("ipv4first");

function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function buildDatabaseUrlFromParams(): string {
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "5432";
  const name = process.env.DB_NAME || "ecommerce";
  const user = process.env.DB_USER || "postgres";
  const pass = process.env.DB_PASSWORD || "postgres";

  return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${name}`;
}

function useSsl(): boolean {
  const value = process.env.DB_SSL?.trim().toLowerCase();
  return process.env.NODE_ENV === "production" || ["1", "true", "yes"].includes(value || "");
}

const databaseUrl = hasDatabaseUrl()
  ? process.env.DATABASE_URL!.trim()
  : buildDatabaseUrlFromParams();

export const databaseSchema = process.env.DB_SCHEMA?.trim() || "ecommerce";

export const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging:
    process.env.DB_LOG_SQL === "true"
      ? (sql: string) => console.debug(sql)
      : false,
  define: {
    schema: databaseSchema,
  },
  pool: {
    max: 10,
    min: 0,
    idle: 10000,
    acquire: 30000,
  },
  dialectOptions: {
    family: 4,
    ...(useSsl()
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {}),
  },
});

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
}
