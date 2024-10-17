import React, { useState } from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/button";
import { db } from "../../../libs/firebase"; // Importamos Firestore
import { collection, addDoc } from "firebase/firestore"; // Para interactuar con Firestore
import DashboardHeader from "../../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../../menu/DashboardSidebar"; // Importar el sidebar del dashboard
import chileRegions from '../../../data/comunas-regiones'; // Importar el archivo JSON de regiones

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nombreTienda, setNombreTienda] = useState("");
  const [direccion, setDireccion] = useState("");
  const [numeroDireccion, setNumeroDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Función para manejar el cambio de región y actualizar las ciudades (comunas)
  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setRegion(selectedRegion);
    setCiudad(""); // Limpiar la ciudad seleccionada al cambiar la región
  };

  // Obtener las comunas de la región seleccionada
  const comunas = region ? chileRegions.regiones.find((r) => r.region === region)?.comunas || [] : [];

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validación simple para evitar campos vacíos
    if (!nombreTienda || !direccion || !numeroDireccion || !ciudad || !region) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      // Agregar los datos de la tienda a Firestore
      await addDoc(collection(db, "tiendas"), {
        nombreTienda,
        direccion: `${direccion} ${numeroDireccion}`,
        ciudad,
        region,
        fechaCreacion: new Date(),
      });

      setSuccess(true);
      setNombreTienda("");
      setDireccion("");
      setNumeroDireccion("");
      setCiudad("");
      setRegion("");
    } catch (err) {
      setError("Error al crear la tienda: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Contenido Principal - Formulario para Crear Tienda */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Crear Taller</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">Taller creada exitosamente</div>}
            
            <form onSubmit={handleSubmit}>
              {/* Nombre de la tienda */}
              <div className="mb-4">
                <label htmlFor="nombreTienda" className="block text-sm font-medium text-gray-700">
                  Nombre del Taller
                </label>
                <Input
                  id="nombreTienda"
                  type="text"
                  placeholder="Nombre de la tienda"
                  value={nombreTienda}
                  onChange={(e) => setNombreTienda(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Región */}
              <div className="mb-4">
                <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                  Región
                </label>
                <select
                  id="region"
                  value={region}
                  onChange={handleRegionChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Seleccione una región</option>
                  {chileRegions.regiones.map((r) => (
                    <option key={r.region} value={r.region}>
                      {r.region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ciudad (Comuna) */}
              <div className="mb-4">
                <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">
                  Ciudad
                </label>
                <select
                  id="ciudad"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                  disabled={!region} // Desactivar si no se ha seleccionado una región
                >
                  <option value="">Seleccione una ciudad</option>
                  {comunas.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dirección */}
              <div className="mb-4">
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <Input
                  id="direccion"
                  type="text"
                  placeholder="Dirección"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Número de Dirección */}
              <div className="mb-4">
                <label htmlFor="numeroDireccion" className="block text-sm font-medium text-gray-700">
                  Número de Dirección
                </label>
                <Input
                  id="numeroDireccion"
                  type="text"
                  placeholder="Número"
                  value={numeroDireccion}
                  onChange={(e) => setNumeroDireccion(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Botón de crear */}
              <div className="mb-4">
                <Button type="submit" className="w-full bg-blue-500 text-white" disabled={loading}>
                  {loading ? "Creando tienda..." : "Crear Tienda"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
