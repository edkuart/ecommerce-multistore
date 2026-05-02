import { Transaction } from "sequelize";
import { sequelize } from "../config/db";
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { Product } from "../models/Product";
import { ProductVariant } from "../models/ProductVariant";

export type CreateOrderItemInput = {
  productId: string;
  variantId?: string | null;
  quantity: number;
};

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  items: CreateOrderItemInput[];
};

async function applyStockAndResolvePrice(
  item: CreateOrderItemInput,
  transaction: Transaction,
): Promise<number> {
  const quantity = item.quantity;

  if (item.variantId) {
    const variant = await ProductVariant.findOne({
      where: { id: item.variantId, productId: item.productId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!variant) throw new Error("VARIANT_NOT_FOUND");
    if (variant.stock < quantity) throw new Error("INSUFFICIENT_STOCK");

    variant.stock -= quantity;
    await variant.save({ transaction });

    if (variant.price !== null && variant.price !== undefined) {
      return variant.price;
    }
  }

  const product = await Product.findByPk(item.productId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!product) throw new Error("PRODUCT_NOT_FOUND");

  if (!item.variantId) {
    if (product.stock < quantity) throw new Error("INSUFFICIENT_STOCK");
    product.stock -= quantity;
    await product.save({ transaction });
  }

  return product.price;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  return sequelize.transaction(async (transaction) => {
    const normalizedItems = input.items
      .map((item) => ({
        productId: item.productId,
        variantId: item.variantId ?? null,
        quantity: Number(item.quantity),
      }))
      .filter((item) => item.productId && item.quantity > 0);

    if (!normalizedItems.length) {
      throw new Error("ORDER_ITEMS_REQUIRED");
    }

    const pricedItems = [];
    let total = 0;

    for (const item of normalizedItems) {
      const price = await applyStockAndResolvePrice(item, transaction);
      total += price * item.quantity;
      pricedItems.push({ ...item, price });
    }

    const order = await Order.create(
      {
        customerName: input.customerName.trim(),
        customerPhone: input.customerPhone.trim(),
        total,
        status: "pending",
      },
      { transaction },
    );

    await OrderItem.bulkCreate(
      pricedItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      })),
      { transaction },
    );

    return findOrderById(order.id, transaction) as Promise<Order>;
  });
}

export async function listOrders(): Promise<Order[]> {
  return Order.findAll({
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          { model: Product, as: "product" },
          { model: ProductVariant, as: "variant" },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
}

export async function findOrderById(
  id: string,
  transaction?: Transaction,
): Promise<Order | null> {
  return Order.findByPk(id, {
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          { model: Product, as: "product" },
          { model: ProductVariant, as: "variant" },
        ],
      },
    ],
    transaction,
  });
}
