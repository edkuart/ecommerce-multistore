import { DataTypes, Model, Optional } from "sequelize";
import { databaseSchema, sequelize } from "../config/db";

export interface CategoryAttributes {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type CategoryCreationAttributes = Optional<
  CategoryAttributes,
  "id" | "description" | "isActive" | "sortOrder"
>;

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: string;
  public name!: string;
  public slug!: string;
  public description?: string | null;
  public isActive!: boolean;
  public sortOrder!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(140),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: "Category",
    tableName: "categories",
    timestamps: true,
    indexes: [
      { fields: ["slug"], unique: true },
      { fields: ["is_active", "sort_order"] },
    ],
  },
);
