import type { Request, Response } from "express";
import type { InventoryMovementType } from "../models/InventoryMovement";
import * as inventoryService from "../services/inventory.service";
import type { InventoryMetricsPeriod } from "../services/inventory.service";
import { resolveStoreFilter } from "../shared/utils/storeAccess";

const movementTypes: InventoryMovementType[] = [
  "CREATION",
  "RESTOCK",
  "SALE",
  "ADJUSTMENT",
  "RETURN",
  "DAMAGE",
];

function parseString(value: unknown): string | undefined {
  if (Array.isArray(value)) return parseString(value[0]);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function parseNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseDate(value: unknown): Date | undefined {
  const raw = parseString(value);
  if (!raw) return undefined;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function parseMovementType(value: unknown): InventoryMovementType | undefined {
  const type = parseString(value)?.toUpperCase();
  return movementTypes.includes(type as InventoryMovementType)
    ? (type as InventoryMovementType)
    : undefined;
}

function parsePeriod(value: unknown): InventoryMetricsPeriod | undefined {
  const period = parseString(value);
  if (
    period === "7d" ||
    period === "30d" ||
    period === "month" ||
    period === "all"
  ) {
    return period;
  }
  return undefined;
}

function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows: unknown[][]): string {
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function formatCsvDate(value: Date | string | undefined): string {
  if (!value) return "";
  return new Date(value).toISOString();
}

export async function getInventoryMovements(
  req: Request,
  res: Response,
): Promise<void> {
  const storeFilter = await resolveStoreFilter(
    req.user!.id,
    req.user!.role,
    parseString(req.query.storeId),
  );
  if (!storeFilter.allowed) {
    res.status(403).json({ message: storeFilter.reason });
    return;
  }

  const movements = await inventoryService.listInventoryMovements({
    productId: parseString(req.query.productId),
    storeId: storeFilter.storeId,
    type: parseMovementType(req.query.type),
    from: parseDate(req.query.from),
    to: parseDate(req.query.to),
  });

  res.status(200).json(movements);
}

export async function exportInventoryMovements(
  req: Request,
  res: Response,
): Promise<void> {
  const storeFilter = await resolveStoreFilter(
    req.user!.id,
    req.user!.role,
    parseString(req.query.storeId),
  );
  if (!storeFilter.allowed) {
    res.status(403).json({ message: storeFilter.reason });
    return;
  }

  const movements = await inventoryService.listInventoryMovements({
    productId: parseString(req.query.productId),
    storeId: storeFilter.storeId,
    type: parseMovementType(req.query.type),
    from: parseDate(req.query.from),
    to: parseDate(req.query.to),
    limit: 5000,
  });
  const header = [
    "fecha",
    "tipo",
    "tienda",
    "producto",
    "sku",
    "cantidad",
    "stock_resultante",
    "nota",
    "referencia",
    "registrado_por",
  ];
  const rows = movements.map((movement) => {
    const product = movement.get("product") as
      | { name?: string; sku?: string | null }
      | undefined;
    const store = movement.get("store") as { name?: string } | undefined;

    return [
      formatCsvDate(movement.createdAt),
      movement.type,
      store?.name ?? "",
      product?.name ?? movement.productId,
      product?.sku ?? "",
      movement.quantity,
      movement.stockAfter,
      movement.note ?? "",
      movement.referenceId ?? "",
      movement.createdBy ?? "",
    ];
  });
  const csv = "\uFEFF" + toCsv([header, ...rows]);
  const filename = `inventario-${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.status(200).send(csv);
}

export async function getInventoryMetrics(
  req: Request,
  res: Response,
): Promise<void> {
  const storeFilter = await resolveStoreFilter(
    req.user!.id,
    req.user!.role,
    parseString(req.query.storeId),
  );
  if (!storeFilter.allowed) {
    res.status(403).json({ message: storeFilter.reason });
    return;
  }

  const metrics = await inventoryService.getInventoryMetrics({
    storeId: storeFilter.storeId,
    period: parsePeriod(req.query.period) ?? "30d",
  });

  res.status(200).json(metrics);
}

export async function getInventorySalesByDay(
  req: Request,
  res: Response,
): Promise<void> {
  const storeFilter = await resolveStoreFilter(
    req.user!.id,
    req.user!.role,
    parseString(req.query.storeId),
  );
  if (!storeFilter.allowed) {
    res.status(403).json({ message: storeFilter.reason });
    return;
  }

  const salesByDay = await inventoryService.getSalesByDay({
    storeId: storeFilter.storeId,
    period: parsePeriod(req.query.period) ?? "30d",
  });

  res.status(200).json(salesByDay);
}

export async function getInventoryTopProducts(
  req: Request,
  res: Response,
): Promise<void> {
  const storeFilter = await resolveStoreFilter(
    req.user!.id,
    req.user!.role,
    parseString(req.query.storeId),
  );
  if (!storeFilter.allowed) {
    res.status(403).json({ message: storeFilter.reason });
    return;
  }

  const topProducts = await inventoryService.getTopProducts({
    storeId: storeFilter.storeId,
    period: parsePeriod(req.query.period) ?? "30d",
    limit: parseNumber(req.query.limit) ?? 5,
  });

  res.status(200).json(topProducts);
}

export async function createInventoryMovement(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const productId = parseString(req.body.productId);
    const type = parseMovementType(req.body.type);
    const quantity = parseNumber(req.body.quantity);

    if (!productId || !type || quantity === undefined) {
      res.status(400).json({
        message: "productId, type and quantity are required",
      });
      return;
    }

    const movement = await inventoryService.createInventoryMovement({
      productId,
      storeId: parseString(req.body.storeId) ?? null,
      variantId: parseString(req.body.variantId) ?? null,
      type,
      quantity,
      note: parseString(req.body.note) ?? null,
      referenceId: parseString(req.body.referenceId) ?? null,
      createdBy: req.user?.email ?? null,
    });

    res.status(201).json(movement);
  } catch (error) {
    const message = (error as Error).message;

    if (
      [
        "PRODUCT_NOT_FOUND",
        "VARIANT_NOT_FOUND",
        "STORE_REQUIRED",
        "QUANTITY_REQUIRED",
        "INSUFFICIENT_STOCK",
      ].includes(message)
    ) {
      res.status(400).json({ message });
      return;
    }

    res.status(500).json({ message: "Could not create inventory movement" });
  }
}
