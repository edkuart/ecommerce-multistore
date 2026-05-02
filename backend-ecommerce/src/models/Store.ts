import { DataTypes, Model, Optional } from "sequelize";
import { databaseSchema, sequelize } from "../config/db";

export type StoreType =
  | "girls_clothing"
  | "general_clothing"
  | "wholesale"
  | "shoes"
  | "other";

export interface StoreAttributes {
  id: string;
  name: string;
  slug: string;
  type: StoreType;
  description?: string | null;
  whatsappPhone?: string | null;
  logoUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type StoreCreationAttributes = Optional<
  StoreAttributes,
  | "id"
  | "type"
  | "description"
  | "whatsappPhone"
  | "logoUrl"
  | "isActive"
  | "sortOrder"
>;

export class Store
  extends Model<StoreAttributes, StoreCreationAttributes>
  implements StoreAttributes
{
  public id!: string;
  public name!: string;
  public slug!: string;
  public type!: StoreType;
  public description?: string | null;
  public whatsappPhone?: string | null;
  public logoUrl?: string | null;
  public isActive!: boolean;
  public sortOrder!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Store.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(140),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM(
        "girls_clothing",
        "general_clothing",
        "wholesale",
        "shoes",
        "other",
      ),
      allowNull: false,
      defaultValue: "other",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    whatsappPhone: {
      type: DataTypes.STRING(40),
      allowNull: true,
      field: "whatsapp_phone",
    },
    logoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "logo_url",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "sort_order",
    },
  },
  {
    sequelize,
    schema: databaseSchema,
    modelName: "Store",
    tableName: "stores",
    timestamps: true,
    indexes: [
      { fields: ["slug"], unique: true },
      { fields: ["is_active", "sort_order"] },
    ],
  },
);
