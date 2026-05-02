import { DataTypes, Model, Optional } from "sequelize";
import { databaseSchema, sequelize } from "../config/db";

export type InventoryMovementType =
  | "CREATION"
  | "RESTOCK"
  | "SALE"
  | "ADJUSTMENT"
  | "RETURN"
  | "DAMAGE";

export interface InventoryMovementAttributes {
  id: string;
  storeId: string;
  productId: string;
  variantId?: string | null;
  type: InventoryMovementType;
  quantity: number;
  stockAfter: number;
  note?: string | null;
  referenceId?: string | null;
  createdBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type InventoryMovementCreationAttributes = Optional<
  InventoryMovementAttributes,
  "id" | "variantId" | "note" | "referenceId" | "createdBy"
>;

export class InventoryMovement
  extends Model<
    InventoryMovementAttributes,
    InventoryMovementCreationAttributes
  >
  implements InventoryMovementAttributes
{
  public id!: string;
  public storeId!: string;
  public productId!: string;
  public variantId?: string | null;
  public type!: InventoryMovementType;
  public quantity!: number;
  public stockAfter!: number;
  public note?: string | null;
  public referenceId?: string | null;
  public createdBy?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

InventoryMovement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "store_id",
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
    type: {
      type: DataTypes.ENUM(
        "CREATION",
        "RESTOCK",
        "SALE",
        "ADJUSTMENT",
        "RETURN",
        "DAMAGE",
      ),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notZero(value: number) {
          if (value === 0) {
            throw new Error("quantity cannot be zero");
          }
        },
      },
    },
    stockAfter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "stock_after",
      validate: { min: 0 },
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    referenceId: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: "reference_id",
    },
    createdBy: {
      type: DataTypes.STRING(180),
      allowNull: true,
      field: "created_by",
    },
  },
  {
    sequelize,
    schema: databaseSchema,
    modelName: "InventoryMovement",
    tableName: "inventory_movements",
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ["product_id", "createdAt"] },
      { fields: ["store_id", "createdAt"] },
      { fields: ["type"] },
      { fields: ["createdAt"] },
      { fields: ["variant_id", "createdAt"] },
    ],
  },
);
