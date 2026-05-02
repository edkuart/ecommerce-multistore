import { Op } from "sequelize";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import type { ProductStockStatus } from "../models/Product";
import { ProductVariant } from "../models/ProductVariant";
import { Store } from "../models/Store";
import { sequelize } from "../config/db";
import { appendSlugSuffix, createSlug } from "../shared/utils/slug";

export type ProductVariantInput = {
  size: string;
  color: string;
  stock?: number;
  price?: number | null;
};

export type ProductInput = {
  storeId?: string | null;
  categoryId?: string | null;
  name: string;
  slug?: string | null;
  sku?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  stock?: number;
  trackInventory?: boolean;
  stockStatus?: ProductStockStatus;
  images?: string[];
  category?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
  variants?: ProductVariantInput[];
};

export type ProductListFilters = {
  storeId?: string;
  category?: string;
  categoryId?: string;
  featured?: boolean;
  active?: boolean;
  search?: string;
};

const productInclude = [
  { model: ProductVariant, as: "variants" },
  { model: Category, as: "categoryDetails" },
  { model: Store, as: "store" },
];

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function buildUniqueProductSlug(
  name: string,
  preferredSlug?: string | null,
  excludeProductId?: string,
): Promise<string> {
  const baseSlug = createSlug(preferredSlug || name) || "producto";
  let slug = baseSlug;
  let suffix = 2;

  while (
    await Product.findOne({
      where: {
        slug,
        ...(excludeProductId ? { id: { [Op.ne]: excludeProductId } } : {}),
      },
    })
  ) {
    slug = appendSlugSuffix(baseSlug, String(suffix));
    suffix += 1;
  }

  return slug;
}

function inferStockStatus(stock: number, status?: ProductStockStatus): ProductStockStatus {
  if (status) return status;
  return stock > 0 ? "in_stock" : "out_of_stock";
}

export async function listProducts(filters: ProductListFilters = {}): Promise<Product[]> {
  const where: Record<string, unknown> = {};

  if (filters.active !== undefined) where.isActive = filters.active;
  if (filters.storeId) where.storeId = filters.storeId;
  if (filters.featured !== undefined) where.isFeatured = filters.featured;
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.category) {
    where[Op.or as unknown as string] = [
      { category: filters.category },
      { "$categoryDetails.slug$": filters.category },
    ];
  }
  if (filters.search) {
    const term = `%${filters.search}%`;
    where[Op.and as unknown as string] = [
      ...(where[Op.and as unknown as string] as unknown[] ?? []),
      {
        [Op.or]: [
          { name: { [Op.iLike]: term } },
          { sku: { [Op.iLike]: term } },
          { shortDescription: { [Op.iLike]: term } },
          { category: { [Op.iLike]: term } },
        ],
      },
    ];
  }

  return Product.findAll({
    where,
    include: productInclude,
    order: [
      ["isFeatured", "DESC"],
      ["createdAt", "DESC"],
    ],
  });
}

export async function findProductById(idOrSlug: string): Promise<Product | null> {
  if (isUuid(idOrSlug)) {
    return Product.findByPk(idOrSlug, {
      include: productInclude,
    });
  }

  return Product.findOne({
    where: { slug: idOrSlug },
    include: productInclude,
  });
}

export async function createProduct(input: ProductInput): Promise<Product> {
  return sequelize.transaction(async (transaction) => {
    const stock = input.stock ?? 0;
    const product = await Product.create(
      {
        categoryId: input.categoryId ?? null,
        storeId: input.storeId ?? null,
        name: input.name.trim(),
        slug: await buildUniqueProductSlug(input.name, input.slug),
        sku: input.sku?.trim() || null,
        description: input.description ?? null,
        shortDescription: input.shortDescription ?? null,
        price: input.price,
        compareAtPrice: input.compareAtPrice ?? null,
        currency: input.currency ?? "GTQ",
        stock,
        trackInventory: input.trackInventory ?? input.stock !== undefined,
        stockStatus: inferStockStatus(stock, input.stockStatus),
        images: input.images ?? [],
        category: input.category ?? null,
        isActive: input.isActive ?? true,
        isFeatured: input.isFeatured ?? false,
      },
      { transaction },
    );

    if (input.variants?.length) {
      await ProductVariant.bulkCreate(
        input.variants.map((variant) => ({
          productId: product.id,
          size: variant.size.trim(),
          color: variant.color.trim(),
          stock: variant.stock ?? 0,
          price: variant.price ?? null,
        })),
        { transaction },
      );
    }

    return Product.findByPk(product.id, {
      include: productInclude,
      transaction,
    }) as Promise<Product>;
  });
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product | null> {
  return sequelize.transaction(async (transaction) => {
    const product = await Product.findByPk(id, { transaction });

    if (!product) return null;

    await product.update(
      {
        ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
        ...(input.storeId !== undefined ? { storeId: input.storeId } : {}),
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        ...(input.slug !== undefined
          ? {
              slug: await buildUniqueProductSlug(
                input.name || product.name,
                input.slug,
                id,
              ),
            }
          : {}),
        ...(input.sku !== undefined ? { sku: input.sku?.trim() || null } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.shortDescription !== undefined
          ? { shortDescription: input.shortDescription }
          : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.compareAtPrice !== undefined
          ? { compareAtPrice: input.compareAtPrice }
          : {}),
        ...(input.currency !== undefined ? { currency: input.currency } : {}),
        ...(input.stock !== undefined ? { stock: input.stock } : {}),
        ...(input.trackInventory !== undefined
          ? { trackInventory: input.trackInventory }
          : {}),
        ...(input.stock !== undefined || input.stockStatus !== undefined
          ? {
              stockStatus: inferStockStatus(
                input.stock ?? product.stock,
                input.stockStatus,
              ),
            }
          : {}),
        ...(input.images !== undefined ? { images: input.images } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
      },
      { transaction },
    );

    if (input.variants !== undefined) {
      await ProductVariant.destroy({ where: { productId: id }, transaction });

      if (input.variants.length) {
        await ProductVariant.bulkCreate(
          input.variants.map((variant) => ({
            productId: id,
            size: variant.size.trim(),
            color: variant.color.trim(),
            stock: variant.stock ?? 0,
            price: variant.price ?? null,
          })),
          { transaction },
        );
      }
    }

    return Product.findByPk(id, {
      include: productInclude,
      transaction,
    });
  });
}

export async function deleteProduct(id: string): Promise<boolean> {
  const deleted = await Product.destroy({ where: { id } });
  return deleted > 0;
}
