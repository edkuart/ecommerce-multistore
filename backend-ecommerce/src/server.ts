import http from "http";
import app from "./app";
import { env } from "./config/env";
import { sequelize, syncModels } from "./models";
import { backfillInitialInventoryMovements } from "./services/inventory.service";
import { ensureDefaultStores } from "./services/store.service";

const PORT = env.port;
const server = http.createServer(app);

server.requestTimeout = 30_000;
server.headersTimeout = 35_000;
server.keepAliveTimeout = 65_000;

async function start(): Promise<void> {
  await syncModels();
  await ensureDefaultStores();
  const backfilledMovements = await backfillInitialInventoryMovements();

  if (backfilledMovements > 0) {
    console.log(`Inventory ledger initialized for ${backfilledMovements} products`);
  }

  server.listen(PORT, () => {
    console.log(`Ecommerce backend listening on port ${PORT}`);
  });
}

let shuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`Shutdown signal received: ${signal}`);

  server.close(async () => {
    await sequelize.close();
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 12_000).unref();
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
