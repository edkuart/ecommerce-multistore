import { LeadManager } from "@/components/dashboard/LeadManager";
import { StoreFilter } from "@/components/dashboard/StoreFilter";
import { getDashboardLeads, getDashboardStores } from "@/lib/dashboardApi";

type DashboardLeadsPageProps = {
  searchParams?: {
    storeId?: string;
  };
};

export default async function DashboardLeadsPage({
  searchParams,
}: DashboardLeadsPageProps) {
  const selectedStoreId = searchParams?.storeId;
  const [leads, stores] = await Promise.all([
    getDashboardLeads({ storeId: selectedStoreId }),
    getDashboardStores({ includeInactive: true }),
  ]);

  return (
    <>
      <StoreFilter
        stores={stores}
        activeStoreId={selectedStoreId}
        basePath="/dashboard/leads"
      />
      <LeadManager leads={leads} />
    </>
  );
}
