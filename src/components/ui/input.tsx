/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "withIcon";
  variantSize?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  className,
  type = "text",
  variant = "default",
  variantSize = "md",
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  };

  return (
    <div className="relative w-full">
      {leftIcon && (
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
          {leftIcon}
        </span>
      )}

      <input
        type={type}
        className={cn(
          " p-4 rounded-full file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0  border bg-transparent shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          sizeClasses[variantSize],
          leftIcon ? "pl-10" : "pl-3",
          rightIcon ? "pr-10" : "pr-3",
          className
        )}
        {...props}
      />

      {rightIcon && (
        <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">
          {rightIcon}
        </span>
      )}
    </div>
  );
}
