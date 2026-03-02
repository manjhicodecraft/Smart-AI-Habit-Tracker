import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface GamifiedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

const GamifiedButton = forwardRef<HTMLButtonElement, GamifiedButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
      icon: "p-3",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "btn-gamified",
          `btn-${variant}`,
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
GamifiedButton.displayName = "GamifiedButton";

export { GamifiedButton };
