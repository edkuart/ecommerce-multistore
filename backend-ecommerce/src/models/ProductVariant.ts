import { DataTypes, Model, Optional } from "sequelize";
import { databaseSchema, sequelize } from "../config/db";

export interface ProductVariantAttributes {
  id: string;
  productId: string;
  size: string;
  color: string;
  stock: number;
  price?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type ProductVariantCreationAttributes = Optional<
  ProductVariantAttributes,
  "id" | "price" | "stock"
>;

export class ProductVariant
  extends Model<ProductVariantAttributes, ProductVariantCreationAttributes>
  implements ProductVariantAttributes
{
  public id!: string;
  public productId!: string;
  public size!: string;
  public color!: string;
  public stock!: number;
  public price?: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductVariant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
    },
    size: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: { min: 0 },
      get() {
        const value = this.getDataValue("price");
        return value === null || value === undefined ? null : Number(value);
      },
    },
  },
  {
    sequelize,
    schema: databaseSchema,
    modelName: "ProductVariant",
    tableName: "product_variants",
    timestamps: true,
  },
);
