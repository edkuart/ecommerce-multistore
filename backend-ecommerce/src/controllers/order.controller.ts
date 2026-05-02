import type { Request, Response } from "express";
import * as orderService from "../services/order.service";

function parseString(value: unknown): string | undefined {
  if (Array.isArray(value)) return parseString(value[0]);
  return typeof value === "string" ? value : undefined;
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const customerName = parseString(req.body.customerName);
    const customerPhone = parseString(req.body.customerPhone);

    if (!customerName || !customerPhone || !Array.isArray(req.body.items)) {
      res.status(400).json({ message: "customerName, customerPhone and items are required" });
      return;
    }

    const order = await orderService.createOrder({
      customerName,
      customerPhone,
      items: req.body.items,
    });

    res.status(201).json(order);
  } catch (error) {
    const message = (error as Error).message;

    if (
      [
        "ORDER_ITEMS_REQUIRED",
        "PRODUCT_NOT_FOUND",
        "VARIANT_NOT_FOUND",
        "INSUFFICIENT_STOCK",
      ].includes(message)
    ) {
      res.status(400).json({ message });
      return;
    }

    res.status(500).json({ message: "Order creation failed" });
  }
}

export async function getOrders(_req: Request, res: Response): Promise<void> {
  const orders = await orderService.listOrders();
  res.status(200).json(orders);
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  const id = parseString(req.params.id);

  if (!id) {
    res.status(400).json({ message: "Order id is required" });
    return;
  }

  const order = await orderService.findOrderById(id);

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  res.status(200).json(order);
}
