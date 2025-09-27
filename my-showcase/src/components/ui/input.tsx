import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none",
        "focus:ring-2 focus:ring-ring",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
