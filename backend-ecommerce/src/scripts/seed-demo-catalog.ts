import "../config/env";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { Store } from "../models/Store";
import { sequelize, syncModels } from "../models";
import { createCategory } from "../services/category.service";
import { createProduct } from "../services/product.service";
import { ensureDefaultStores } from "../services/store.service";

const FRONTEND_URL = process.env.PUBLIC_APP_URL || "http://localhost:3000";

type DemoProduct = {
  storeSlug: string;
  categorySlug: string;
  name: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  isFeatured?: boolean;
  image: string;
};

const categories = [
  { name: "Ropa niñas", slug: "ropa-ninas", sortOrder: 10 },
  { name: "Ropa general", slug: "ropa-general", sortOrder: 20 },
  { name: "Calzado", slug: "calzado", sortOrder: 30 },
  { name: "Mayoreo", slug: "mayoreo", sortOrder: 40 },
];

const products: DemoProduct[] = [
  {
    storeSlug: "ropa-ninas",
    categorySlug: "ropa-ninas",
    name: "Vestido floral para niña",
    sku: "DEMO-NINA-001",
    shortDescription: "Vestido fresco para uso diario y ocasiones especiales.",
    description: "Vestido floral con tela ligera, ideal para niñas.",
    price: 145,
    compareAtPrice: 175,
    stock: 18,
    isFeatured: true,
    image: `${FRONTEND_URL}/demo/ropa-ninas.svg`,
  },
  {
    storeSlug: "ropa-ninas",
    categorySlug: "ropa-ninas",
    name: "Conjunto casual niña",
    sku: "DEMO-NINA-002",
    shortDescription: "Conjunto comodo para salida o uso diario.",
    description: "Blusa y short en combinacion casual para niña.",
    price: 125,
    stock: 24,
    image: `${FRONTEND_URL}/demo/ropa-ninas.svg`,
  },
  {
    storeSlug: "ropa-general",
    categorySlug: "ropa-general",
    name: "Camisa casual unisex",
    sku: "DEMO-ROPA-001",
    shortDescription: "Camisa versatil para venta directa.",
    description: "Camisa casual de corte comodo y facil de combinar.",
    price: 110,
    compareAtPrice: 135,
    stock: 30,
    isFeatured: true,
    image: `${FRONTEND_URL}/demo/ropa-general.svg`,
  },
  {
    storeSlug: "ropa-general",
    categorySlug: "ropa-general",
    name: "Playera basica premium",
    sku: "DEMO-ROPA-002",
    shortDescription: "Basico rentable para catalogo familiar.",
    description: "Playera basica con tela suave y buen margen comercial.",
    price: 75,
    stock: 45,
    image: `${FRONTEND_URL}/demo/ropa-general.svg`,
  },
  {
    storeSlug: "calzado",
    categorySlug: "calzado",
    name: "Tenis casual blanco",
    sku: "DEMO-CALZADO-001",
    shortDescription: "Calzado comodo para venta rapida.",
    description: "Tenis casual blanco, ideal para uso diario.",
    price: 240,
    compareAtPrice: 280,
    stock: 12,
    isFeatured: true,
    image: `${FRONTEND_URL}/demo/calzado.svg`,
  },
  {
    storeSlug: "calzado",
    categorySlug: "calzado",
    name: "Sandalia urbana",
    sku: "DEMO-CALZADO-002",
    shortDescription: "Modelo ligero con buena rotacion.",
    description: "Sandalia urbana para clima calido y uso casual.",
    price: 165,
    stock: 20,
    image: `${FRONTEND_URL}/demo/calzado.svg`,
  },
  {
    storeSlug: "mayoreo",
    categorySlug: "mayoreo",
    name: "Pack camisetas mayoreo",
    sku: "DEMO-MAYOREO-001",
    shortDescription: "Paquete ideal para compra por volumen.",
    description: "Pack de camisetas pensado para reventa y compras grandes.",
    price: 499,
    compareAtPrice: 560,
    stock: 40,
    isFeatured: true,
    image: `${FRONTEND_URL}/demo/mayoreo.svg`,
  },
  {
    storeSlug: "mayoreo",
    categorySlug: "mayoreo",
    name: "Lote surtido familiar",
    sku: "DEMO-MAYOREO-002",
    shortDescription: "Surtido para iniciar venta de temporada.",
    description: "Lote surtido de prendas para compra mayorista.",
    price: 899,
    stock: 15,
    image: `${FRONTEND_URL}/demo/mayoreo.svg`,
  },
];

async function ensureCategories(): Promise<void> {
  for (const category of categories) {
    const existing = await Category.findOne({ where: { slug: category.slug } });
    if (!existing) {
      await createCategory({
        name: category.name,
        slug: category.slug,
        sortOrder: category.sortOrder,
      });
    }
  }
}

async function seedProducts(): Promise<void> {
  for (const product of products) {
    const existing = await Product.findOne({ where: { sku: product.sku } });
    if (existing) continue;

    const store = await Store.findOne({ where: { slug: product.storeSlug } });
    const category = await Category.findOne({
      where: { slug: product.categorySlug },
    });

    if (!store || !category) {
      throw new Error(`Missing store/category for ${product.sku}`);
    }

    await createProduct({
      storeId: store.id,
      categoryId: category.id,
      category: category.name,
      name: product.name,
      sku: product.sku,
      shortDescription: product.shortDescription,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? null,
      stock: product.stock,
      images: [product.image],
      isFeatured: product.isFeatured ?? false,
    });
  }
}

async function main(): Promise<void> {
  await syncModels();
  await ensureDefaultStores();
  await ensureCategories();
  await seedProducts();
  await sequelize.close();
  console.log("Demo catalog seeded.");
}

main().catch(async (error) => {
  console.error("Could not seed demo catalog", error);
  await sequelize.close();
  process.exit(1);
});
