import { DataTypes, Model, Optional } from "sequelize";
import { databaseSchema, sequelize } from "../config/db";

export type OrderStatus = "pending" | "confirmed" | "cancelled";

export interface OrderAttributes {
  id: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

type OrderCreationAttributes = Optional<OrderAttributes, "id" | "total" | "status">;

export class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: string;
  public customerName!: string;
  public customerPhone!: string;
  public total!: number;
  public status!: OrderStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerName: {
      type: DataTypes.STRING(140),
      allowNull: false,
      field: "customer_name",
    },
    customerPhone: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: "customer_phone",
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
      get() {
        const value = this.getDataValue("total");
        return Number(value);
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    schema: databaseSchema,
    modelName: "Order",
    tableName: "orders",
    timestamps: true,
  },
);
