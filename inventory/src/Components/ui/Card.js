import React from "react";
import clsx from "clsx"; 

export const Card = ({ className, variant = "default", children }) => {
  const variantStyles = clsx({
    "bg-gray-100 text-gray-900": variant === "default", // Fondo gris claro con texto gris oscuro
    "bg-gray-200 text-gray-800": variant === "light", // Fondo gris aún más claro con texto gris
  });

  return (
    <div className={clsx("rounded-lg overflow-hidden shadow-lg", variantStyles, className)}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children }) => (
  <div className={clsx("p-4 bg-gray-300", className)}>{children}</div> // Encabezado gris medio
);

export const CardContent = ({ className, children }) => (
  <div className={clsx("p-4 bg-gray-100", className)}>{children}</div> // Fondo gris claro para el contenido
);

export const CardTitle = ({ className, children }) => (
  <h2 className={clsx("text-lg font-bold text-gray-800", className)}>{children}</h2> // Título en gris oscuro
);

export const CardDescription = ({ className, children }) => (
  <p className={clsx("text-sm text-gray-600", className)}>{children}</p> // Descripción en gris medio
);
