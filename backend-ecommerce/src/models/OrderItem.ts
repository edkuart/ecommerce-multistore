import { DataTypes, Model, Optional } from "sequelize";
import { databaseSchema, sequelize } from "../config/db";

export interface OrderItemAttributes {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type OrderItemCreationAttributes = Optional<OrderItemAttributes, "id" | "variantId">;

export class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes
{
  public id!: string;
  public orderId!: string;
  public productId!: string;
  public variantId?: string | null;
  public quantity!: number;
  public price!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "order_id",
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
      validate: { min: 1 },
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
  },
  {
    sequelize,
    schema: databaseSchema,
    modelName: "OrderItem",
    tableName: "order_items",
    timestamps: true,
  },
);
