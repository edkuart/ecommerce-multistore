import type { Request, Response } from "express";
import type { StoreType } from "../models/Store";
import * as storeService from "../services/store.service";

const storeTypes: StoreType[] = [
  "girls_clothing",
  "general_clothing",
  "wholesale",
  "shoes",
  "other",
];

function parseString(value: unknown): string | undefined {
  if (Array.isArray(value)) return parseString(value[0]);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return undefined;
  if (["true", "1", "yes"].includes(value.toLowerCase())) return true;
  if (["false", "0", "no"].includes(value.toLowerCase())) return false;
  return undefined;
}

function parseNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseStoreType(value: unknown): StoreType | undefined {
  const type = parseString(value);
  return storeTypes.includes(type as StoreType) ? (type as StoreType) : undefined;
}

export async function getStores(req: Request, res: Response): Promise<void> {
  const includeInactive =
    Boolean(req.user) && (parseBoolean(req.query.includeInactive) ?? false);
  const stores = await storeService.listStores(includeInactive);
  res.status(200).json(stores);
}

export async function createStore(req: Request, res: Response): Promise<void> {
  const name = parseString(req.body.name);

  if (!name) {
    res.status(400).json({ message: "name is required" });
    return;
  }

  const store = await storeService.createStore({
    name,
    slug: parseString(req.body.slug) ?? null,
    type: parseStoreType(req.body.type) ?? "other",
    description: parseString(req.body.description) ?? null,
    whatsappPhone: parseString(req.body.whatsappPhone) ?? null,
    logoUrl: parseString(req.body.logoUrl) ?? null,
    isActive: parseBoolean(req.body.isActive),
    sortOrder: parseNumber(req.body.sortOrder),
  });

  res.status(201).json(store);
}

export async function updateStore(req: Request, res: Response): Promise<void> {
  const id = parseString(req.params.id);

  if (!id) {
    res.status(400).json({ message: "Store id is required" });
    return;
  }

  const name = parseString(req.body.name);

  if (req.body.name !== undefined && !name) {
    res.status(400).json({ message: "name cannot be empty" });
    return;
  }

  const store = await storeService.updateStore(id, {
    ...(name !== undefined ? { name } : {}),
    ...(req.body.slug !== undefined ? { slug: parseString(req.body.slug) ?? null } : {}),
    ...(req.body.type !== undefined ? { type: parseStoreType(req.body.type) } : {}),
    ...(req.body.description !== undefined
      ? { description: parseString(req.body.description) ?? null }
      : {}),
    ...(req.body.whatsappPhone !== undefined
      ? { whatsappPhone: parseString(req.body.whatsappPhone) ?? null }
      : {}),
    ...(req.body.logoUrl !== undefined
      ? { logoUrl: parseString(req.body.logoUrl) ?? null }
      : {}),
    ...(req.body.isActive !== undefined
      ? { isActive: parseBoolean(req.body.isActive) }
      : {}),
    ...(req.body.sortOrder !== undefined
      ? { sortOrder: parseNumber(req.body.sortOrder) ?? 0 }
      : {}),
  });

  if (!store) {
    res.status(404).json({ message: "Store not found" });
    return;
  }

  res.status(200).json(store);
}
