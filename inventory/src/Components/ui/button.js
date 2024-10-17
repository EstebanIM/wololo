import React from "react";
import clsx from "clsx"; 

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantStyles = clsx({
      "bg-transparent hover:bg-blue-150": variant === "ghost",
      "bg-[#1E3A8A] hover:bg-[#1C357A] text-white": variant === "default",  // Azul oscuro
      "bg-red-500 hover:bg-red-600 text-white": variant === "danger", 
    });
    const sizeStyles = clsx({
      "px-4 py-2 text-sm": size === "md",
      "px-2 py-1 text-xs": size === "sm",
      "px-6 py-3 text-lg": size === "lg", 
    });

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variantStyles, sizeStyles, className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
