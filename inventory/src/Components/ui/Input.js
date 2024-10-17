import React from "react";
import clsx from "clsx";

export const Input = React.forwardRef(({ className, error, ...props }, ref) => {
  const baseStyles =
    "block w-full rounded-md border text-black focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 px-3 py-2"; // Añadido padding horizontal (px) y vertical (py)
  const errorStyles = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300";

  return (
    <input
      ref={ref}
      className={clsx(baseStyles, errorStyles, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";
