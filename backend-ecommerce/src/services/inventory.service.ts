import { Op } from "sequelize";
import { sequelize } from "../config/db";
import { InventoryMovement } from "../models/InventoryMovement";
import type { InventoryMovementType } from "../models/InventoryMovement";
import { Product } from "../models/Product";
import { ProductVariant } from "../models/ProductVariant";
import { Store } from "../models/Store";

export type InventoryMovementInput = {
  productId: string;
  storeId?: string | null;
  variantId?: string | null;
  type: InventoryMovementType;
  quantity: number;
  note?: string | null;
  referenceId?: string | null;
  createdBy?: string | null;
};

export type InventoryMovementFilters = {
  productId?: string;
  storeId?: string;
  type?: InventoryMovementType;
  from?: Date;
  to?: Date;
  limit?: number;
};

export type InventoryMetricsPeriod = "7d" | "30d" | "month" | "all";

export type InventoryMetricsFilters = {
  storeId?: string;
  period?: InventoryMetricsPeriod;
};

const movementInclude = [
  { model: Product, as: "product" },
  { model: Store, as: "store" },
  { model: ProductVariant, as: "variant" },
];

function signedQuantity(type: InventoryMovementType, quantity: number): number {
  const absoluteQuantity = Math.abs(Math.trunc(quantity));

  if (absoluteQuantity === 0) {
    throw new Error("QUANTITY_REQUIRED");
  }

  if (type === "SALE" || type === "DAMAGE") return -absoluteQuantity;
  if (type === "RESTOCK" || type === "RETURN" || type === "CREATION") {
    return absoluteQuantity;
  }

  return Math.trunc(quantity);
}

function periodStart(period: InventoryMetricsPeriod = "30d"): Date | undefined {
  const now = new Date();

  if (period === "all") return undefined;
  if (period === "7d") {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return start;
  }
  if (period === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const start = new Date(now);
  start.setDate(start.getDate() - 30);
  return start;
}

function movementWhere(filters: InventoryMetricsFilters = {}): Record<string, unknown> {
  const where: Record<string, unknown> = {};
  const from = periodStart(filters.period);

  if (filters.storeId) where.storeId = filters.storeId;
  if (from) where.createdAt = { [Op.gte]: from };

  return where;
}

export async function createInventoryMovement(
  input: InventoryMovementInput,
): Promise<InventoryMovement> {
  return sequelize.transaction(async (transaction) => {
    const product = await Product.findByPk(input.productId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!product) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    const storeId = product.storeId || input.storeId;

    if (!storeId) {
      throw new Error("STORE_REQUIRED");
    }

    if (input.variantId) {
      const variant = await ProductVariant.findOne({
        where: { id: input.variantId, productId: product.id },
        transaction,
      });

      if (!variant) {
        throw new Error("VARIANT_NOT_FOUND");
      }
    }

    const quantity = signedQuantity(input.type, input.quantity);
    const nextStock = product.stock + quantity;

    if (nextStock < 0) {
      throw new Error("INSUFFICIENT_STOCK");
    }

    const movement = await InventoryMovement.create(
      {
        storeId,
        productId: product.id,
        variantId: input.variantId ?? null,
        type: input.type,
        quantity,
        stockAfter: nextStock,
        note: input.note?.trim() || null,
        referenceId: input.referenceId?.trim() || null,
        createdBy: input.createdBy?.trim() || null,
      },
      { transaction },
    );

    await product.update(
      {
        stock: nextStock,
        trackInventory: true,
        stockStatus: nextStock > 0 ? "in_stock" : "out_of_stock",
      },
      { transaction },
    );

    return InventoryMovement.findByPk(movement.id, {
      include: movementInclude,
      transaction,
    }) as Promise<InventoryMovement>;
  });
}

export async function listInventoryMovements(
  filters: InventoryMovementFilters = {},
): Promise<InventoryMovement[]> {
  const where: Record<string, unknown> = {};

  if (filters.productId) where.productId = filters.productId;
  if (filters.storeId) where.storeId = filters.storeId;
  if (filters.type) where.type = filters.type;
  if (filters.from || filters.to) {
    where.createdAt = {
      ...(filters.from ? { [Op.gte]: filters.from } : {}),
      ...(filters.to ? { [Op.lte]: filters.to } : {}),
    };
  }

  return InventoryMovement.findAll({
    where,
    include: movementInclude,
    order: [["createdAt", "DESC"]],
    limit: filters.limit ?? 200,
  });
}

export async function getInventoryMetrics(
  filters: InventoryMetricsFilters = {},
): Promise<{
  totalMovements: number;
  totalSales: number;
  totalRestock: number;
  totalUnitsIn: number;
  totalUnitsOut: number;
  currentUnits: number;
  lowStockCount: number;
  outOfStockCount: number;
}> {
  const movements = await InventoryMovement.findAll({
    where: movementWhere(filters),
    attributes: ["type", "quantity"],
  });
  const productWhere: Record<string, unknown> = {};

  if (filters.storeId) productWhere.storeId = filters.storeId;

  const products = await Product.findAll({
    where: productWhere,
    attributes: ["stock", "trackInventory"],
  });

  const totalUnitsIn = movements
    .filter((movement) => movement.quantity > 0)
    .reduce((sum, movement) => sum + movement.quantity, 0);
  const totalUnitsOut = movements
    .filter((movement) => movement.quantity < 0)
    .reduce((sum, movement) => sum + Math.abs(movement.quantity), 0);
  const totalSales = movements
    .filter((movement) => movement.type === "SALE")
    .reduce((sum, movement) => sum + Math.abs(movement.quantity), 0);
  const totalRestock = movements
    .filter((movement) =>
      ["CREATION", "RESTOCK", "RETURN"].includes(movement.type),
    )
    .reduce((sum, movement) => sum + Math.abs(movement.quantity), 0);
  const trackedProducts = products.filter((product) => product.trackInventory);

  return {
    totalMovements: movements.length,
    totalSales,
    totalRestock,
    totalUnitsIn,
    totalUnitsOut,
    currentUnits: products.reduce((sum, product) => sum + product.stock, 0),
    lowStockCount: trackedProducts.filter(
      (product) => product.stock > 0 && product.stock <= 5,
    ).length,
    outOfStockCount: trackedProducts.filter((product) => product.stock <= 0).length,
  };
}

export async function getSalesByDay(
  filters: InventoryMetricsFilters = {},
): Promise<Array<{ date: string; units: number }>> {
  const movements = await InventoryMovement.findAll({
    where: {
      ...movementWhere(filters),
      type: "SALE",
    },
    attributes: ["quantity", "createdAt"],
    order: [["createdAt", "ASC"]],
  });
  const salesByDate = new Map<string, number>();

  for (const movement of movements) {
    const date = movement.createdAt.toISOString().slice(0, 10);
    salesByDate.set(
      date,
      (salesByDate.get(date) ?? 0) + Math.abs(movement.quantity),
    );
  }

  return Array.from(salesByDate.entries()).map(([date, units]) => ({
    date,
    units,
  }));
}

export async function getTopProducts(
  filters: InventoryMetricsFilters & { limit?: number } = {},
): Promise<Array<{ productId: string; name: string; unitsSold: number }>> {
  const movements = await InventoryMovement.findAll({
    where: {
      ...movementWhere(filters),
      type: "SALE",
    },
    include: [{ model: Product, as: "product", attributes: ["id", "name"] }],
    attributes: ["productId", "quantity"],
  });
  const products = new Map<string, { productId: string; name: string; unitsSold: number }>();

  for (const movement of movements) {
    const product = movement.get("product") as Product | undefined;
    const current = products.get(movement.productId) ?? {
      productId: movement.productId,
      name: product?.name ?? movement.productId,
      unitsSold: 0,
    };

    current.unitsSold += Math.abs(movement.quantity);
    products.set(movement.productId, current);
  }

  return Array.from(products.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, filters.limit ?? 5);
}

export async function backfillInitialInventoryMovements(): Promise<number> {
  const products = await Product.findAll({
    where: {
      stock: { [Op.gt]: 0 },
      storeId: { [Op.ne]: null },
    },
  });
  let createdCount = 0;

  for (const product of products) {
    const existingMovements = await InventoryMovement.count({
      where: { productId: product.id },
    });

    if (existingMovements > 0) continue;

    await sequelize.transaction(async (transaction) => {
      await InventoryMovement.create(
        {
          storeId: product.storeId!,
          productId: product.id,
          type: "CREATION",
          quantity: product.stock,
          stockAfter: product.stock,
          note: "Movimiento inicial generado desde stock existente.",
          createdBy: "system",
        },
        { transaction },
      );

      await product.update(
        {
          trackInventory: true,
          stockStatus: product.stock > 0 ? "in_stock" : "out_of_stock",
        },
        { transaction },
      );
    });

    createdCount += 1;
  }

  return createdCount;
}
