import { Lead } from "../models/Lead";
import { Product } from "../models/Product";
import { ProductVariant } from "../models/ProductVariant";
import { PurchaseIntent } from "../models/PurchaseIntent";
import { Store } from "../models/Store";
import { WhatsAppClick } from "../models/WhatsAppClick";

export async function listLeads(filters: { storeId?: string } = {}): Promise<Lead[]> {
  return Lead.findAll({
    where: filters.storeId ? { storeId: filters.storeId } : undefined,
    include: [
      { model: Store, as: "store" },
      {
        model: PurchaseIntent,
        as: "purchaseIntents",
        include: [
          { model: Product, as: "product" },
          { model: ProductVariant, as: "variant" },
          { model: WhatsAppClick, as: "whatsappClicks" },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
}
