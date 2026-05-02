import { DataTypes, Model, Optional } from "sequelize";
import { databaseSchema, sequelize } from "../config/db";

export type ProductStockStatus = "in_stock" | "out_of_stock" | "preorder";

export interface ProductAttributes {
  id: string;
  storeId?: string | null;
  categoryId?: string | null;
  name: string;
  slug?: string | null;
  sku?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  stock: number;
  trackInventory: boolean;
  stockStatus: ProductStockStatus;
  images: string[];
  category?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type ProductCreationAttributes = Optional<
  ProductAttributes,
  | "id"
  | "storeId"
  | "categoryId"
  | "slug"
  | "sku"
  | "description"
  | "shortDescription"
  | "compareAtPrice"
  | "currency"
  | "stock"
  | "trackInventory"
  | "stockStatus"
  | "images"
  | "category"
  | "isActive"
  | "isFeatured"
>;

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;
  public storeId?: string | null;
  public categoryId?: string | null;
  public name!: string;
  public slug?: string | null;
  public sku?: string | null;
  public description?: string | null;
  public shortDescription?: string | null;
  public price!: number;
  public compareAtPrice?: number | null;
  public currency!: string;
  public stock!: number;
  public trackInventory!: boolean;
  public stockStatus!: ProductStockStatus;
  public images!: string[];
  public category?: string | null;
  public isActive!: boolean;
  public isFeatured!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
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
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "category_id",
    },
    name: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(220),
      allowNull: true,
      unique: true,
    },
    sku: {
      type: DataTypes.STRING(80),
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    shortDescription: {
      type: DataTypes.STRING(280),
      allowNull: true,
      field: "short_description",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
      get() {
        const value = this.getDataValue("price");
        return Number(value);
      },
    },
    compareAtPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: "compare_at_price",
      validate: { min: 0 },
      get() {
        const value = this.getDataValue("compareAtPrice");
        return value === null || value === undefined ? null : Number(value);
      },
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "GTQ",
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    trackInventory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "track_inventory",
    },
    stockStatus: {
      type: DataTypes.ENUM("in_stock", "out_of_stock", "preorder"),
      allowNull: false,
      defaultValue: "in_stock",
      field: "stock_status",
    },
    images: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    category: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_featured",
    },
  },
  {
    sequelize,
    schema: databaseSchema,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
    indexes: [
      { fields: ["slug"], unique: true },
      { fields: ["sku"], unique: true },
      { fields: ["store_id"] },
      { fields: ["category_id"] },
      { fields: ["track_inventory", "stock"] },
      { fields: ["is_active", "is_featured"] },
    ],
  },
);
