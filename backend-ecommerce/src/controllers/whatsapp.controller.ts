import type { Request, Response } from "express";
import * as whatsappService from "../services/whatsapp.service";

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

function requestIp(req: Request): string | null {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0]?.trim() || null;
  return req.socket.remoteAddress ?? null;
}

export async function createWhatsAppIntent(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const productId = parseString(req.body.productId);
    const customerName = parseString(req.body.customerName);
    const customerPhone = parseString(req.body.customerPhone);

    if (!productId || !customerName || !customerPhone) {
      res.status(400).json({
        message: "productId, customerName and customerPhone are required",
      });
      return;
    }

    const result = await whatsappService.createWhatsAppIntent({
      productId,
      variantId: parseString(req.body.variantId) ?? null,
      quantity: parseNumber(req.body.quantity) ?? 1,
      customerName,
      customerPhone,
      customerEmail: parseString(req.body.customerEmail) ?? null,
      message: parseString(req.body.message) ?? null,
      source: parseString(req.body.source) ?? "product_page",
      productUrl: parseString(req.body.productUrl) ?? null,
      utmSource: parseString(req.body.utmSource) ?? null,
      utmMedium: parseString(req.body.utmMedium) ?? null,
      utmCampaign: parseString(req.body.utmCampaign) ?? null,
      referrer: parseString(req.body.referrer) ?? null,
      userAgent: req.headers["user-agent"] ?? null,
      ip: requestIp(req),
    });

    res.status(201).json({
      leadId: result.lead.id,
      purchaseIntentId: result.purchaseIntent.id,
      whatsappUrl: result.whatsappUrl,
      whatsappMessage: result.whatsappMessage,
    });
  } catch (error) {
    const message = (error as Error).message;

    if (
      [
        "PRODUCT_NOT_FOUND",
        "VARIANT_NOT_FOUND",
        "WHATSAPP_BUSINESS_PHONE_REQUIRED",
      ].includes(message)
    ) {
      res.status(400).json({ message });
      return;
    }

    res.status(500).json({ message: "Could not create WhatsApp intent" });
  }
}
