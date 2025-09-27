import type { HTMLAttributes } from "react";

type Variant = "default" | "secondary" | "outline";

export function Badge({ className, children, ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  const { variant = "default" } = props as { variant?: Variant };
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  const variants: Record<Variant, string> = {
    default: "bg-accent text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border",
  };
  return (
    <span className={[base, variants[variant], className].filter(Boolean).join(" ")} {...props}>
      {children}
    </span>
  );
}
