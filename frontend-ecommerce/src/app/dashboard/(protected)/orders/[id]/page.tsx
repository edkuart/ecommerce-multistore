import Link from "next/link";
import { formatCurrency } from "@/lib/api";
import { getDashboardOrder } from "@/lib/dashboardApi";

export default async function DashboardOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getDashboardOrder(params.id);

  if (!order) {
    return (
      <div className="rounded-md border border-ink/10 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-ink">
          Pedido no encontrado
        </h1>
        <Link
          href="/dashboard/orders"
          className="mt-4 inline-flex font-semibold text-moss hover:text-ink"
        >
          Volver a pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/orders"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-ink/60 hover:text-ink"
      >
        Volver a pedidos
      </Link>

      <div className="rounded-md border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-ink">
              {order.customerName}
            </h1>
            <p className="mt-1 text-sm text-ink/60">{order.customerPhone}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={`tel:${order.customerPhone}`}
                className="inline-flex min-h-11 items-center rounded-md border border-ink/10 px-3 text-sm font-semibold text-ink/65 transition hover:border-ink/25 hover:text-ink"
              >
                Llamar
              </a>
              <a
                href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent("Hola, te escribo por tu pedido.")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-md bg-whats px-3 text-sm font-semibold text-white transition hover:bg-whats-deep"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div className="text-left sm:text-right">
              <p className="text-sm text-ink/50">Total del pedido</p>
            <p className="text-2xl font-semibold text-moss">
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-ink/10 bg-white shadow-sm">
        <div className="border-b border-ink/10 px-5 py-4">
          <h2 className="font-semibold text-ink">Productos del pedido</h2>
        </div>
        <div className="divide-y divide-ink/10">
          {(order.items ?? []).map((item) => (
            <div
              key={item.id}
              className="grid gap-2 px-5 py-4 text-sm sm:grid-cols-[minmax(0,1fr)_120px_100px]"
            >
              <div>
                <p className="font-medium text-ink">
                  {item.product?.name ?? item.productId}
                </p>
                <p className="mt-1 text-ink/55">
                  {item.variant
                    ? `${item.variant.size} / ${item.variant.color}`
                    : "Sin variante"}
                </p>
              </div>
              <p className="text-ink/70">Cantidad: {item.quantity}</p>
              <p className="font-medium text-ink">
                {formatCurrency(item.price)}
              </p>
            </div>
          ))}
          {!(order.items ?? []).length && (
            <p className="px-5 py-8 text-center text-sm text-ink/50">
              No se encontraron productos en este pedido.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
