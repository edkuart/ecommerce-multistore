import { Category } from "../models/Category";
import { appendSlugSuffix, createSlug } from "../shared/utils/slug";

export type CategoryInput = {
  name: string;
  slug?: string | null;
  description?: string | null;
  isActive?: boolean;
  sortOrder?: number;
};

async function buildUniqueCategorySlug(name: string, preferredSlug?: string | null): Promise<string> {
  const baseSlug = createSlug(preferredSlug || name) || "categoria";
  let slug = baseSlug;
  let suffix = 2;

  while (await Category.findOne({ where: { slug } })) {
    slug = appendSlugSuffix(baseSlug, String(suffix));
    suffix += 1;
  }

  return slug;
}

export async function listCategories(includeInactive = false): Promise<Category[]> {
  return Category.findAll({
    where: includeInactive ? undefined : { isActive: true },
    order: [
      ["sortOrder", "ASC"],
      ["name", "ASC"],
    ],
  });
}

export async function findCategoryBySlug(slug: string): Promise<Category | null> {
  return Category.findOne({ where: { slug } });
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const name = input.name.trim();

  return Category.create({
    name,
    slug: await buildUniqueCategorySlug(name, input.slug),
    description: input.description ?? null,
    isActive: input.isActive ?? true,
    sortOrder: input.sortOrder ?? 0,
  });
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>,
): Promise<Category | null> {
  const category = await Category.findByPk(id);

  if (!category) return null;

  const nextName = input.name?.trim();

  await category.update({
    ...(nextName !== undefined ? { name: nextName } : {}),
    ...(input.slug !== undefined
      ? { slug: await buildUniqueCategorySlug(nextName || category.name, input.slug) }
      : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
  });

  return category;
}
