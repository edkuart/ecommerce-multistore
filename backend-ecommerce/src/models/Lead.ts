import { DataTypes, Model, Optional } from "sequelize";
import { databaseSchema, sequelize } from "../config/db";

export interface LeadAttributes {
  id: string;
  storeId?: string | null;
  productId?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  source: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  referrer?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type LeadCreationAttributes = Optional<
  LeadAttributes,
  | "id"
  | "storeId"
  | "productId"
  | "email"
  | "message"
  | "source"
  | "utmSource"
  | "utmMedium"
  | "utmCampaign"
  | "referrer"
>;

export class Lead
  extends Model<LeadAttributes, LeadCreationAttributes>
  implements LeadAttributes
{
  public id!: string;
  public storeId?: string | null;
  public productId?: string | null;
  public name!: string;
  public phone!: string;
  public email?: string | null;
  public message?: string | null;
  public source!: string;
  public utmSource?: string | null;
  public utmMedium?: string | null;
  public utmCampaign?: string | null;
  public referrer?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Lead.init(
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
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "product_id",
    },
    name: {
      type: DataTypes.STRING(140),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(180),
      allowNull: true,
      validate: { isEmail: true },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING(80),
      allowNull: false,
      defaultValue: "product_page",
    },
    utmSource: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: "utm_source",
    },
    utmMedium: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: "utm_medium",
    },
    utmCampaign: {
      type: DataTypes.STRING(160),
      allowNull: true,
      field: "utm_campaign",
    },
    referrer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    schema: databaseSchema,
    modelName: "Lead",
    tableName: "leads",
    timestamps: true,
    indexes: [
      { fields: ["store_id"] },
      { fields: ["product_id"] },
      { fields: ["phone"] },
      { fields: ["createdAt"] },
    ],
  },
);
