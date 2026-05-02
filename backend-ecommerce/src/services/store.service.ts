import { Op } from "sequelize";
import { Store } from "../models/Store";
import type { StoreType } from "../models/Store";
import { appendSlugSuffix, createSlug } from "../shared/utils/slug";

export type StoreInput = {
  name: string;
  slug?: string | null;
  type?: StoreType;
  description?: string | null;
  whatsappPhone?: string | null;
  logoUrl?: string | null;
  isActive?: boolean;
  sortOrder?: number;
};

async function buildUniqueStoreSlug(
  name: string,
  preferredSlug?: string | null,
  excludeStoreId?: string,
): Promise<string> {
  const baseSlug = createSlug(preferredSlug || name) || "store";
  let slug = baseSlug;
  let suffix = 2;

  while (
    await Store.findOne({
      where: {
        slug,
        ...(excludeStoreId ? { id: { [Op.ne]: excludeStoreId } } : {}),
      },
    })
  ) {
    slug = appendSlugSuffix(baseSlug, String(suffix));
    suffix += 1;
  }

  return slug;
}

export async function listStores(includeInactive = false): Promise<Store[]> {
  return Store.findAll({
    where: includeInactive ? undefined : { isActive: true },
    order: [
      ["sortOrder", "ASC"],
      ["name", "ASC"],
    ],
  });
}

export async function findStoreById(id: string): Promise<Store | null> {
  return Store.findByPk(id);
}

export async function createStore(input: StoreInput): Promise<Store> {
  const name = input.name.trim();

  return Store.create({
    name,
    slug: await buildUniqueStoreSlug(name, input.slug),
    type: input.type ?? "other",
    description: input.description ?? null,
    whatsappPhone: input.whatsappPhone ?? null,
    logoUrl: input.logoUrl ?? null,
    isActive: input.isActive ?? true,
    sortOrder: input.sortOrder ?? 0,
  });
}

export async function updateStore(
  id: string,
  input: Partial<StoreInput>,
): Promise<Store | null> {
  const store = await Store.findByPk(id);

  if (!store) return null;

  const nextName = input.name?.trim();

  await store.update({
    ...(nextName !== undefined ? { name: nextName } : {}),
    ...(input.slug !== undefined || nextName !== undefined
      ? {
          slug: await buildUniqueStoreSlug(
            nextName || store.name,
            input.slug,
            id,
          ),
        }
      : {}),
    ...(input.type !== undefined ? { type: input.type } : {}),
    ...(input.description !== undefined
      ? { description: input.description ?? null }
      : {}),
    ...(input.whatsappPhone !== undefined
      ? { whatsappPhone: input.whatsappPhone ?? null }
      : {}),
    ...(input.logoUrl !== undefined ? { logoUrl: input.logoUrl ?? null } : {}),
    ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
  });

  return store;
}

export async function ensureDefaultStores(): Promise<void> {
  const defaults: StoreInput[] = [
    {
      name: "Ropa niñas",
      slug: "ropa-ninas",
      type: "girls_clothing",
      description: "Selección de ropa para niñas.",
      sortOrder: 10,
    },
    {
      name: "Ropa general",
      slug: "ropa-general",
      type: "general_clothing",
      description: "Ropa para la familia y sucursal general.",
      sortOrder: 20,
    },
    {
      name: "Mayoreo familiar",
      slug: "mayoreo",
      type: "wholesale",
      description: "Productos y precios para compras por volumen.",
      sortOrder: 30,
    },
    {
      name: "Calzado",
      slug: "calzado",
      type: "shoes",
      description: "Calzado para venta directa.",
      sortOrder: 40,
    },
  ];

  for (const store of defaults) {
    const slug = store.slug || createSlug(store.name);
    const existing = await Store.findOne({ where: { slug } });
    if (!existing) {
      await createStore({ ...store, slug });
    }
  }
}
