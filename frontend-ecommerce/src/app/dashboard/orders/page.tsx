import Link from "next/link";
import { formatCurrency } from "@/lib/api";
import { getDashboardOrders } from "@/lib/dashboardApi";

export default async function DashboardOrdersPage() {
  const orders = await getDashboardOrders();
  const pendingCount = orders.filter((order) => order.status === "pending").length;

  return (
    <div className="rounded-md border border-ink/10 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-ink/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Pedidos</h1>
          <p className="mt-1 text-sm text-ink/55">
            {orders.length} pedidos recibidos · {pendingCount} pendientes
          </p>
        </div>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {orders.map((order) => (
          <article
            key={order.id}
            className={`rounded-md border border-ink/10 p-3 shadow-sm ${
              order.status === "pending" ? "bg-amber-50/60" : "bg-paper"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-ink">
                  {order.customerName}
                </h2>
                <p className="mt-0.5 text-xs text-ink/50">
                  {order.customerPhone}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  order.status === "pending"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-linen text-ink/70"
                }`}
              >
                {order.status === "pending"
                  ? "Pendiente"
                  : order.status === "confirmed"
                    ? "Confirmado"
                    : "Cancelado"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-ink/35">
                  Total
                </p>
                <p className="mt-0.5 text-lg font-semibold text-moss">
                  {formatCurrency(order.total)}
                </p>
              </div>
              <Link
                href={`/dashboard/orders/${order.id}`}
                className="inline-flex min-h-11 items-center rounded-md bg-moss px-4 text-sm font-semibold text-white"
              >
                Ver pedido
              </Link>
            </div>
          </article>
        ))}
        {!orders.length && (
          <p className="px-5 py-10 text-center text-ink/50">
            Aún no hay pedidos.
          </p>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-linen/70 text-xs uppercase tracking-[0.14em] text-ink/50">
              <tr>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Teléfono</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Estado del pedido</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {orders.map((order) => (
              <tr
                key={order.id}
                className={order.status === "pending" ? "bg-amber-50/50" : ""}
              >
                <td className="px-5 py-4 font-medium text-ink">
                  {order.customerName}
                </td>
                <td className="px-5 py-4 text-ink/70">{order.customerPhone}</td>
                <td className="px-5 py-4 text-ink/70">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-linen text-ink/70"
                    }`}
                  >
                    {order.status === "pending"
                      ? "Pendiente"
                      : order.status === "confirmed"
                        ? "Confirmado"
                        : "Cancelado"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="font-semibold text-moss hover:text-ink"
                  >
                    Ver pedido
                  </Link>
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr>
                <td className="px-5 py-10 text-center text-ink/50" colSpan={5}>
                  Aún no hay pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
