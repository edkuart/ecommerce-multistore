import { DataTypes, Model, Optional } from "sequelize";
import { databaseSchema, sequelize } from "../config/db";

export interface WhatsAppClickAttributes {
  id: string;
  purchaseIntentId: string;
  productId: string;
  leadId: string;
  phoneTarget: string;
  userAgent?: string | null;
  ipHash?: string | null;
  clickedAt?: Date;
}

type WhatsAppClickCreationAttributes = Optional<
  WhatsAppClickAttributes,
  "id" | "userAgent" | "ipHash" | "clickedAt"
>;

export class WhatsAppClick
  extends Model<WhatsAppClickAttributes, WhatsAppClickCreationAttributes>
  implements WhatsAppClickAttributes
{
  public id!: string;
  public purchaseIntentId!: string;
  public productId!: string;
  public leadId!: string;
  public phoneTarget!: string;
  public userAgent?: string | null;
  public ipHash?: string | null;
  public clickedAt?: Date;
}

WhatsAppClick.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    purchaseIntentId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "purchase_intent_id",
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
    },
    leadId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "lead_id",
    },
    phoneTarget: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: "phone_target",
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "user_agent",
    },
    ipHash: {
      type: DataTypes.STRING(128),
      allowNull: true,
      field: "ip_hash",
    },
    clickedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "clicked_at",
    },
  },
  {
    sequelize,
    schema: databaseSchema,
    modelName: "WhatsAppClick",
    tableName: "whatsapp_clicks",
    timestamps: false,
    indexes: [
      { fields: ["purchase_intent_id"] },
      { fields: ["product_id"] },
      { fields: ["lead_id"] },
      { fields: ["clicked_at"] },
    ],
  },
);
