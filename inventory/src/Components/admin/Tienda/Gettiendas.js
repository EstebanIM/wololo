import React, { useState, useEffect } from "react";
import { db } from "../../../libs/firebase"; // Importar Firestore
import { collection, getDocs } from "firebase/firestore"; // Para interactuar con Firestore
import DashboardHeader from "../../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../../menu/DashboardSidebar"; // Importar el sidebar del dashboard
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card"; // Componente de tarjetas

export default function VerTiendas() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tiendas, setTiendas] = useState([]); // Estado para almacenar las tiendas
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Función para obtener las tiendas de Firestore
  const fetchTiendas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tiendas")); // Obtener las tiendas desde Firestore
      const tiendasData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Mapeo de los datos
      setTiendas(tiendasData); // Actualizar el estado con las tiendas obtenidas
      setLoading(false); // Detener el estado de carga
    } catch (err) {
      setError("Error al obtener las tiendas: " + err.message); // Manejar errores
      setLoading(false);
    }
  };

  // Efecto para cargar las tiendas cuando el componente se monta
  useEffect(() => {
    fetchTiendas();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Contenido Principal - Lista de Tiendas */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-7xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Tiendas Creadas</h1>

            {/* Mostrar mensaje de carga o error */}
            {loading && <div>Cargando tiendas...</div>}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Mostrar tiendas en tarjetas */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tiendas.map((tienda) => (
                <Card key={tienda.id} className="bg-gray-100 shadow-lg">
                  <CardHeader className="p-4">
                    <CardTitle className="text-xl font-bold">{tienda.nombreTienda}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p><strong>Dirección:</strong> {tienda.direccion}</p>
                    <p><strong>Ciudad:</strong> {tienda.ciudad}</p>
                    <p><strong>Región:</strong> {tienda.region}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Mensaje si no hay tiendas */}
            {!loading && tiendas.length === 0 && (
              <div className="text-gray-500">No hay tiendas creadas.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
