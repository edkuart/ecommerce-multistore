import { StoreManager } from "@/components/dashboard/StoreManager";
import { getDashboardStores } from "@/lib/dashboardApi";

export default async function DashboardStoresPage() {
  const stores = await getDashboardStores({ includeInactive: true });

  return <StoreManager initialStores={stores} />;
}
