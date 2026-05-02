type BadgeVariant =
  | "active"   // emerald — disponible, activo, convertido
  | "warning"  // amber — pocas unidades, ajuste
  | "danger"   // red — agotado, daño
  | "neutral"  // gris — inactivo, perdido
  | "moss"     // proyecto moss — restock, destacado-filtro
  | "clay"     // proyecto clay — destacado, venta
  | "sky"      // azul — creado/iniciado
  | "violet";  // violeta — contactado

type BadgeSize = "sm" | "md";

const variantStyles: Record<BadgeVariant, string> = {
  active:  "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  danger:  "bg-red-50 text-red-600 ring-1 ring-red-200",
  neutral: "bg-ink/5 text-ink/50",
  moss:    "bg-moss/10 text-moss",
  clay:    "bg-clay/10 text-clay",
  sky:     "bg-sky-50 text-sky-700",
  violet:  "bg-violet-50 text-violet-700",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs",
};

type BadgeProps = {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
};

export function Badge({
  variant = "neutral",
  size = "md",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full font-semibold ${variantStyles[variant]} ${sizeStyles[size]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
