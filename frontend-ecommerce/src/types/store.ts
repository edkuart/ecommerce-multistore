export type StoreType =
  | "girls_clothing"
  | "general_clothing"
  | "wholesale"
  | "shoes"
  | "other";

export type Store = {
  id: string;
  name: string;
  slug: string;
  type: StoreType;
  description?: string | null;
  whatsappPhone?: string | null;
  logoUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};
