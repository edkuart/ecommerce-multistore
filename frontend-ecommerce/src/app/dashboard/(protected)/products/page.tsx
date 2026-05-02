import { StoreFilter } from "@/components/dashboard/StoreFilter";
import { ProductManager } from "@/components/dashboard/ProductManager";
import {
  getDashboardCategories,
  getDashboardProducts,
  getDashboardStores,
} from "@/lib/dashboardApi";

type DashboardProductsPageProps = {
  searchParams?: {
    storeId?: string;
  };
};

export default async function DashboardProductsPage({
  searchParams,
}: DashboardProductsPageProps) {
  const selectedStoreId = searchParams?.storeId;
  const [products, categories, stores] = await Promise.all([
    getDashboardProducts({ storeId: selectedStoreId }),
    getDashboardCategories({ includeInactive: true }),
    getDashboardStores({ includeInactive: true }),
  ]);

  return (
    <>
      <StoreFilter
        stores={stores}
        activeStoreId={selectedStoreId}
        basePath="/dashboard/products"
      />
      <ProductManager
        initialProducts={products}
        categories={categories}
        stores={stores}
        selectedStoreId={selectedStoreId}
      />
    </>
  );
}
