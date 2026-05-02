import { DataTypes, Model, Optional } from "sequelize";
import { databaseSchema, sequelize } from "../config/db";
import type { UserRole } from "./User";

export interface StoreUserAttributes {
  id: string;
  storeId: string;
  userId: number;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

type StoreUserCreationAttributes = Optional<
  StoreUserAttributes,
  "id" | "role"
>;

export class StoreUser
  extends Model<StoreUserAttributes, StoreUserCreationAttributes>
  implements StoreUserAttributes
{
  public id!: string;
  public storeId!: string;
  public userId!: number;
  public role!: UserRole;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

StoreUser.init(
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    role: {
      type: DataTypes.ENUM("admin", "seller"),
      allowNull: false,
      defaultValue: "seller",
    },
  },
  {
    sequelize,
    schema: databaseSchema,
    modelName: "StoreUser",
    tableName: "store_users",
    timestamps: true,
    indexes: [
      { fields: ["store_id"] },
      { fields: ["user_id"] },
      { fields: ["store_id", "user_id"], unique: true },
    ],
  },
);
