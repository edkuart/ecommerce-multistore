import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
