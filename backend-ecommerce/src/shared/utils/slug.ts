export function createSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function appendSlugSuffix(slug: string, suffix: string): string {
  return `${slug}-${suffix}`.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
