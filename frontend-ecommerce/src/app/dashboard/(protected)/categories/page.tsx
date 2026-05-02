import { CategoryManager } from "@/components/dashboard/CategoryManager";
import { getDashboardCategories } from "@/lib/dashboardApi";

export default async function DashboardCategoriesPage() {
  const categories = await getDashboardCategories({ includeInactive: true });

  return <CategoryManager initialCategories={categories} />;
}
