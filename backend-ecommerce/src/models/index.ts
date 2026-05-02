import { databaseSchema, sequelize } from "../config/db";
import { Category } from "./Category";
import { Store } from "./Store";
import { StoreUser } from "./StoreUser";
import { User } from "./User";
import { Product } from "./Product";
import { ProductVariant } from "./ProductVariant";
import { InventoryMovement } from "./InventoryMovement";
import { Order } from "./Order";
import { OrderItem } from "./OrderItem";
import { Lead } from "./Lead";
import { PurchaseIntent } from "./PurchaseIntent";
import { WhatsAppClick } from "./WhatsAppClick";

Product.hasMany(ProductVariant, {
  foreignKey: "productId",
  as: "variants",
  onDelete: "CASCADE",
});
ProductVariant.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});
Store.hasMany(InventoryMovement, {
  foreignKey: "storeId",
  as: "inventoryMovements",
});
InventoryMovement.belongsTo(Store, {
  foreignKey: "storeId",
  as: "store",
});
Product.hasMany(InventoryMovement, {
  foreignKey: "productId",
  as: "inventoryMovements",
});
InventoryMovement.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});
ProductVariant.hasMany(InventoryMovement, {
  foreignKey: "variantId",
  as: "inventoryMovements",
});
InventoryMovement.belongsTo(ProductVariant, {
  foreignKey: "variantId",
  as: "variant",
});
Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
});
Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "categoryDetails",
});
Store.hasMany(Product, {
  foreignKey: "storeId",
  as: "products",
});
Product.belongsTo(Store, {
  foreignKey: "storeId",
  as: "store",
});
Store.belongsToMany(User, {
  through: StoreUser,
  foreignKey: "storeId",
  otherKey: "userId",
  as: "users",
});
User.belongsToMany(Store, {
  through: StoreUser,
  foreignKey: "userId",
  otherKey: "storeId",
  as: "stores",
});
Store.hasMany(StoreUser, {
  foreignKey: "storeId",
  as: "storeUsers",
});
StoreUser.belongsTo(Store, {
  foreignKey: "storeId",
  as: "store",
});
User.hasMany(StoreUser, {
  foreignKey: "userId",
  as: "storeUsers",
});
StoreUser.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
  onDelete: "CASCADE",
});
OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});
OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});
OrderItem.belongsTo(ProductVariant, {
  foreignKey: "variantId",
  as: "variant",
});
Lead.hasMany(PurchaseIntent, {
  foreignKey: "leadId",
  as: "purchaseIntents",
});
Store.hasMany(Lead, {
  foreignKey: "storeId",
  as: "leads",
});
Lead.belongsTo(Store, {
  foreignKey: "storeId",
  as: "store",
});
Product.hasMany(Lead, {
  foreignKey: "productId",
  as: "leads",
});
Lead.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});
PurchaseIntent.belongsTo(Lead, {
  foreignKey: "leadId",
  as: "lead",
});
Product.hasMany(PurchaseIntent, {
  foreignKey: "productId",
  as: "purchaseIntents",
});
PurchaseIntent.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});
Store.hasMany(PurchaseIntent, {
  foreignKey: "storeId",
  as: "purchaseIntents",
});
PurchaseIntent.belongsTo(Store, {
  foreignKey: "storeId",
  as: "store",
});
ProductVariant.hasMany(PurchaseIntent, {
  foreignKey: "variantId",
  as: "purchaseIntents",
});
PurchaseIntent.belongsTo(ProductVariant, {
  foreignKey: "variantId",
  as: "variant",
});
PurchaseIntent.hasMany(WhatsAppClick, {
  foreignKey: "purchaseIntentId",
  as: "whatsappClicks",
});
WhatsAppClick.belongsTo(PurchaseIntent, {
  foreignKey: "purchaseIntentId",
  as: "purchaseIntent",
});
WhatsAppClick.belongsTo(Lead, {
  foreignKey: "leadId",
  as: "lead",
});
WhatsAppClick.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

export {
  sequelize,
  User,
  Store,
  StoreUser,
  Category,
  Product,
  ProductVariant,
  InventoryMovement,
  Order,
  OrderItem,
  Lead,
  PurchaseIntent,
  WhatsAppClick,
};

export async function syncModels(): Promise<void> {
  await sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${databaseSchema}"`);
  await sequelize.sync({ alter: process.env.NODE_ENV !== "production" });
}
