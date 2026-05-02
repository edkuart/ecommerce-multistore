type CardPadding = "sm" | "md" | "lg";

const paddingStyles: Record<CardPadding, string> = {
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

type CardProps = {
  children: React.ReactNode;
  padding?: CardPadding;
  className?: string;
};

export function Card({ children, padding = "md", className }: CardProps) {
  return (
    <div
      className={`rounded-md border border-ink/10 bg-white shadow-sm ${paddingStyles[padding]} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
