import type { HTMLAttributes, PropsWithChildren } from "react";

export function Card({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={["rounded-lg border border-border bg-card text-card-foreground", className].filter(Boolean).join(" ")}{...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={["p-4", className].filter(Boolean).join(" ")}{...props}>
      {children}
    </div>
  );
}
