import { Badge } from "@/components/ui";

export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="danger">Agotado</Badge>;
  if (stock <= 10) return <Badge variant="warning">Pocas unidades</Badge>;
  return <Badge variant="active">Disponible</Badge>;
}
