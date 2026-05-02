import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

const variantStyles: Record<ButtonVariant, string> = {
  primary:   "border border-moss bg-moss text-white hover:bg-ink hover:border-ink",
  secondary: "border border-ink/10 bg-white text-ink/65 hover:border-ink/25 hover:text-ink",
  danger:    "border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300",
  ghost:     "border border-moss/20 bg-white text-moss hover:border-moss hover:bg-moss/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-xs gap-1.5",
  md: "min-h-11 px-4 text-sm gap-2",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "secondary", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      className={`inline-flex items-center justify-center rounded-md font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className ?? ""}`}
    >
      {children}
    </button>
  ),
);

Button.displayName = "Button";
