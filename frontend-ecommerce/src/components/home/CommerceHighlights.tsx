import { MessageCircle, PackageCheck, Tags } from "lucide-react";

const items = [
  {
    icon: Tags,
    title: "Precios por volumen",
    text: "Cotización personalizada según cantidades.",
  },
  {
    icon: PackageCheck,
    title: "Disponibilidad confirmada",
    text: "Validamos stock antes de cerrar el pedido.",
  },
  {
    icon: MessageCircle,
    title: "Atención por WhatsApp",
    text: "El pedido inicia con datos claros del producto.",
  },
];

export function CommerceHighlights() {
  return (
    <div className="mb-8 grid gap-3 sm:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-md border border-ink/10 bg-white px-4 py-4 shadow-sm"
          >
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-linen text-moss">
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <p className="font-semibold text-ink">{item.title}</p>
            <p className="mt-1 text-sm leading-5 text-ink/55">{item.text}</p>
          </div>
        );
      })}
    </div>
  );
}
