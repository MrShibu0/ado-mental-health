import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30",
  secondary: "bg-teal text-white hover:bg-teal/90 shadow-lg shadow-teal/30",
  outline: "border-2 border-primary text-primary hover:bg-primary/5",
  ghost: "text-gray-600 hover:text-primary hover:bg-primary/5",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-3.5 text-lg font-semibold",
};

export const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
