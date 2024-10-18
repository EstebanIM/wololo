import React from "react";
import clsx from "clsx"; 

export const Card = ({ className, variant = "default", children }) => {
  const variantStyles = clsx({
    "bg-[#1F2937] text-white": variant === "default", // Gris oscuro
    "bg-white text-gray-900": variant === "light", 
  });

  return (
    <div className={clsx("rounded-lg overflow-hidden shadow-lg", variantStyles, className)}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children }) => (
  <div className={clsx("p-4 bg-[#111827]", className)}>{children}</div> // Gris más oscuro para el encabezado
);

export const CardContent = ({ className, children }) => (
  <div className={clsx("p-4", className)}>{children}</div> // Manteniendo el contenido en gris oscuro
);

export const CardTitle = ({ className, children }) => (
  <h2 className={clsx("text-lg font-bold", className)}>{children}</h2>
);

export const CardDescription = ({ className, children }) => (
  <p className={clsx("text-sm text-gray-400", className)}>{children}</p>
);
