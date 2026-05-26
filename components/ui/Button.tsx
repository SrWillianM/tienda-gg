import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white shadow-soft hover:bg-accentHover hover:-translate-y-0.5",
  secondary:
    "bg-header text-white shadow-soft hover:bg-black hover:-translate-y-0.5",
  ghost:
    "bg-transparent text-foreground hover:bg-surface hover:text-foreground",
  outline:
    "border border-border bg-white text-foreground hover:border-accent hover:text-accent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export const buttonClassName = (
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName(variant, size, className)}
      {...props}
    />
  );
}
