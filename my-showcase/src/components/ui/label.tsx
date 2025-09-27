import type { LabelHTMLAttributes } from "react";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={["text-sm text-foreground", className].filter(Boolean).join(" ")} {...props} />;
}
