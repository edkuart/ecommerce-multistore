import type { Request, Response } from "express";
import { uploadProductImages } from "../services/image.service";
import * as productService from "../services/product.service";
import type { ProductVariantInput } from "../services/product.service";
import type { ProductStockStatus } from "../models/Product";

function parseNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

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

function parseImages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((image): image is string => typeof image === "string");
}

function parseStockStatus(value: unknown): ProductStockStatus | undefined {
  const status = parseString(value);
  if (status === "in_stock" || status === "out_of_stock" || status === "preorder") {
    return status;
  }
  return undefined;
}

function parseVariants(value: unknown): ProductVariantInput[] | undefined {
  if (value === undefined) return undefined;

  const parsed = typeof value === "string" ? JSON.parse(value) : value;

  if (!Array.isArray(parsed)) return undefined;

  return parsed
    .map((variant) => ({
      size: parseString(variant?.size) ?? "",
      color: parseString(variant?.color) ?? "",
      stock: parseNumber(variant?.stock) ?? 0,
      price: parseNumber(variant?.price) ?? null,
    }))
    .filter((variant) => variant.size && variant.color);
}

export async function getProducts(req: Request, res: Response): Promise<void> {
  const requestedActive = parseBoolean(req.query.active);
  const products = await productService.listProducts({
    storeId: parseString(req.query.storeId),
    category: parseString(req.query.category),
    categoryId: parseString(req.query.categoryId),
    featured: parseBoolean(req.query.featured),
    active: req.user ? requestedActive : (requestedActive ?? true),
    search: parseString(req.query.search),
  });
  res.status(200).json(products);
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  const id = parseString(req.params.id);

  if (!id) {
    res.status(400).json({ message: "Product id is required" });
    return;
  }

  const product = await productService.findProductById(id);

  if (!product || (!req.user && product.isActive === false)) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.status(200).json(product);
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const price = parseNumber(req.body.price);
  const stock = parseNumber(req.body.stock);

  const name = parseString(req.body.name);

  if (!name || price === undefined) {
    res.status(400).json({ message: "name and price are required" });
    return;
  }

  const uploadedImages = await uploadProductImages(
    req.files as Express.Multer.File[] | undefined,
  );
  const bodyImages = parseImages(req.body.images);
  const variants = parseVariants(req.body.variants);

  const product = await productService.createProduct({
    storeId: parseString(req.body.storeId) ?? null,
    categoryId: parseString(req.body.categoryId) ?? null,
    name,
    slug: parseString(req.body.slug) ?? null,
    sku: parseString(req.body.sku) ?? null,
    description: parseString(req.body.description) ?? null,
    shortDescription: parseString(req.body.shortDescription) ?? null,
    price,
    compareAtPrice: parseNumber(req.body.compareAtPrice) ?? null,
    currency: parseString(req.body.currency) ?? "GTQ",
    stock,
    trackInventory: parseBoolean(req.body.trackInventory) ?? true,
    stockStatus: parseStockStatus(req.body.stockStatus),
    images: [...bodyImages, ...uploadedImages],
    category: parseString(req.body.category) ?? null,
    isActive: parseBoolean(req.body.isActive),
    isFeatured: parseBoolean(req.body.isFeatured),
    variants,
  });

  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const id = parseString(req.params.id);
  const uploadedImages = await uploadProductImages(
    req.files as Express.Multer.File[] | undefined,
  );
  const bodyImages = Array.isArray(req.body.images)
    ? parseImages(req.body.images)
    : undefined;
  const price = parseNumber(req.body.price);
  const compareAtPrice = parseNumber(req.body.compareAtPrice);
  const stock = parseNumber(req.body.stock);
  const name = parseString(req.body.name);
  const variants = parseVariants(req.body.variants);

  if (!id) {
    res.status(400).json({ message: "Product id is required" });
    return;
  }

  const product = await productService.updateProduct(id, {
    ...(req.body.categoryId !== undefined
      ? { categoryId: parseString(req.body.categoryId) ?? null }
      : {}),
    ...(req.body.storeId !== undefined
      ? { storeId: parseString(req.body.storeId) ?? null }
      : {}),
    ...(name !== undefined ? { name } : {}),
    ...(req.body.slug !== undefined ? { slug: parseString(req.body.slug) ?? null } : {}),
    ...(req.body.sku !== undefined ? { sku: parseString(req.body.sku) ?? null } : {}),
    ...(req.body.description !== undefined
      ? { description: parseString(req.body.description) ?? null }
      : {}),
    ...(req.body.shortDescription !== undefined
      ? { shortDescription: parseString(req.body.shortDescription) ?? null }
      : {}),
    ...(price !== undefined ? { price } : {}),
    ...(req.body.compareAtPrice !== undefined
      ? { compareAtPrice: compareAtPrice ?? null }
      : {}),
    ...(req.body.currency !== undefined
      ? { currency: parseString(req.body.currency) ?? "GTQ" }
      : {}),
    ...(stock !== undefined ? { stock } : {}),
    ...(req.body.trackInventory !== undefined
      ? { trackInventory: parseBoolean(req.body.trackInventory) }
      : {}),
    ...(req.body.stockStatus !== undefined
      ? { stockStatus: parseStockStatus(req.body.stockStatus) }
      : {}),
    ...(req.body.category !== undefined
      ? { category: parseString(req.body.category) ?? null }
      : {}),
    ...(req.body.isActive !== undefined
      ? { isActive: parseBoolean(req.body.isActive) }
      : {}),
    ...(req.body.isFeatured !== undefined
      ? { isFeatured: parseBoolean(req.body.isFeatured) }
      : {}),
    ...(variants !== undefined ? { variants } : {}),
    ...(bodyImages || uploadedImages.length
      ? { images: [...(bodyImages ?? []), ...uploadedImages] }
      : {}),
  });

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.status(200).json(product);
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const id = parseString(req.params.id);

  if (!id) {
    res.status(400).json({ message: "Product id is required" });
    return;
  }

  const deleted = await productService.deleteProduct(id);

  if (!deleted) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.status(204).send();
}
