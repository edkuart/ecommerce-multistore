import type { Request, Response } from "express";
import * as categoryService from "../services/category.service";

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

export async function getCategories(req: Request, res: Response): Promise<void> {
  const includeInactive =
    Boolean(req.user) && (parseBoolean(req.query.includeInactive) ?? false);
  const categories = await categoryService.listCategories(includeInactive);
  res.status(200).json(categories);
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  const name = parseString(req.body.name);

  if (!name) {
    res.status(400).json({ message: "name is required" });
    return;
  }

  const category = await categoryService.createCategory({
    name,
    slug: parseString(req.body.slug) ?? null,
    description: parseString(req.body.description) ?? null,
    isActive: parseBoolean(req.body.isActive),
    sortOrder: parseNumber(req.body.sortOrder),
  });

  res.status(201).json(category);
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  const id = parseString(req.params.id);

  if (!id) {
    res.status(400).json({ message: "Category id is required" });
    return;
  }

  const category = await categoryService.updateCategory(id, {
    ...(req.body.name !== undefined ? { name: parseString(req.body.name) } : {}),
    ...(req.body.slug !== undefined ? { slug: parseString(req.body.slug) ?? null } : {}),
    ...(req.body.description !== undefined
      ? { description: parseString(req.body.description) ?? null }
      : {}),
    ...(req.body.isActive !== undefined
      ? { isActive: parseBoolean(req.body.isActive) }
      : {}),
    ...(req.body.sortOrder !== undefined
      ? { sortOrder: parseNumber(req.body.sortOrder) }
      : {}),
  });

  if (!category) {
    res.status(404).json({ message: "Category not found" });
    return;
  }

  res.status(200).json(category);
}
