import React, { type ReactNode } from "react";
import { Link } from "react-router-dom";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  to?: string;
  fullWidth?: boolean;
  children?: ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(({
  variant = "primary",
  size = "lg",
  icon,
  iconPosition = "left",
  to,
  fullWidth = false,
  children,
  className = "",
  disabled,
  type = "button",
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-150 active:scale-98 select-none shrink-0 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5 rounded-xl min-h-[34px]",
    md: "px-4 py-2 text-xs sm:text-sm gap-2 rounded-2xl min-h-[40px]",
    lg: "px-5 py-2.5 text-xs sm:text-sm gap-2 rounded-2xl min-h-[44px]",
  };

  const variantStyles = {
    primary: "bg-[#0f1e36] text-white border border-[#44abff]/30 hover:bg-[#0f1e36]/90 shadow-sm shadow-[#0f1e36]/10",
    secondary: "bg-[#44abff]/10 text-[#0f1e36] border border-[#44abff]/30 hover:bg-[#44abff]/20",
    outline: "bg-white text-[#0f1e36] border border-gray-200/80 hover:bg-gray-50 hover:border-[#44abff]/40 shadow-xs",
    ghost: "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 hover:text-[#0f1e36]",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? "w-full" : ""} ${className}`;

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </>
  );

  if (to && !disabled) {
    return (
      <Link
        to={to}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={combinedClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";
