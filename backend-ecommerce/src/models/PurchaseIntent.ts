import { DataTypes, Model, Optional } from "sequelize";
import { databaseSchema, sequelize } from "../config/db";

export type PurchaseIntentStatus =
  | "created"
  | "whatsapp_opened"
  | "contacted"
  | "converted"
  | "lost";

export interface PurchaseIntentAttributes {
  id: string;
  storeId?: string | null;
  leadId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  status: PurchaseIntentStatus;
  channel: string;
  whatsappMessage: string;
  whatsappUrl: string;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type PurchaseIntentCreationAttributes = Optional<
  PurchaseIntentAttributes,
  "id" | "variantId" | "quantity" | "status" | "channel" | "notes"
  | "storeId"
>;

export class PurchaseIntent
  extends Model<PurchaseIntentAttributes, PurchaseIntentCreationAttributes>
  implements PurchaseIntentAttributes
{
  public id!: string;
  public storeId?: string | null;
  public leadId!: string;
  public productId!: string;
  public variantId?: string | null;
  public quantity!: number;
  public status!: PurchaseIntentStatus;
  public channel!: string;
  public whatsappMessage!: string;
  public whatsappUrl!: string;
  public notes?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PurchaseIntent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "store_id",
    },
    leadId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "lead_id",
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
    },
    variantId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "variant_id",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
    },
    status: {
      type: DataTypes.ENUM(
        "created",
        "whatsapp_opened",
        "contacted",
        "converted",
        "lost",
      ),
      allowNull: false,
      defaultValue: "created",
    },
    channel: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "whatsapp",
    },
    whatsappMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "whatsapp_message",
    },
    whatsappUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "whatsapp_url",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    schema: databaseSchema,
    modelName: "PurchaseIntent",
    tableName: "purchase_intents",
    timestamps: true,
    indexes: [
      { fields: ["store_id"] },
      { fields: ["lead_id"] },
      { fields: ["product_id"] },
      { fields: ["status"] },
      { fields: ["createdAt"] },
    ],
  },
);
