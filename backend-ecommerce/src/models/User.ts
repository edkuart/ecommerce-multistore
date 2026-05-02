import { DataTypes, Model, Optional } from "sequelize";
import { databaseSchema, sequelize } from "../config/db";

export type UserRole = "admin" | "seller";

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, "id" | "role">;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(180),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      set(value: string) {
        this.setDataValue("email", value.toLowerCase().trim());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: "User",
    tableName: "users",
    timestamps: true,
  },
);
