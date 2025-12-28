import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "small" | "lead";
  className?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  className,
  children,
  as,
  ...props
}) => {
  const variants = {
    h1: "text-5xl md:text-6xl font-bold tracking-tight text-gray-900",
    h2: "text-4xl md:text-5xl font-bold tracking-tight text-gray-900",
    h3: "text-3xl md:text-4xl font-semibold tracking-tight text-gray-900",
    h4: "text-2xl md:text-3xl font-semibold text-gray-900",
    lead: "text-xl md:text-2xl font-normal text-gray-600",
    body: "text-base md:text-lg text-gray-600",
    small: "text-sm text-gray-500",
  };

  const defaultComponents = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    lead: "p",
    body: "p",
    small: "p",
  };

  const Component = (as || defaultComponents[variant]) as keyof JSX.IntrinsicElements;

  return (
    <Component className={cn(variants[variant], className)} {...props}>
      {children}
    </Component>
  );
};










