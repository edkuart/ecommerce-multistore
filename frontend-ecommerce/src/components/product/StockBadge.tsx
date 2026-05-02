type StockBadgeProps = {
  stock: number;
};

export function StockBadge({ stock }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
        Agotado
      </span>
    );
  }

  if (stock <= 10) {
    return (
      <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
        Pocas unidades
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
      Disponible
    </span>
  );
}
