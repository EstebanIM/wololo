import React, { useState, useEffect } from "react";
import { db } from "../../../libs/firebase"; // Importar Firestore
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore"; // Para interactuar con Firestore
import DashboardHeader from "../../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../../menu/DashboardSidebar"; // Importar el sidebar del dashboard
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card"; // Componente de tarjetas
import { Button } from "../../ui/button"; // Componente de botón
import { Form } from "../../ui/Form"; // Formulario para crear y modificar

export default function VerTalleres() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [talleres, setTalleres] = useState([]); // Estado para almacenar los talleres
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [showFormModal, setShowFormModal] = useState(false); // Modal para el formulario
  const [currentTaller, setCurrentTaller] = useState({ nombreTienda: "", direccion: "", ciudad: "", region: "" }); // Estado para el taller actual
  const [editingTaller, setEditingTaller] = useState(false); // Estado para saber si estamos editando

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Función para obtener los talleres de Firestore
  const fetchTalleres = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tiendas")); // Obtener los talleres desde Firestore
      const talleresData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Mapeo de los datos
      setTalleres(talleresData); // Actualizar el estado con los talleres obtenidos
      setLoading(false); // Detener el estado de carga
    } catch (err) {
      setError("Error al obtener los talleres: " + err.message); // Manejar errores
      setLoading(false);
    }
  };

  // Efecto para cargar los talleres cuando el componente se monta
  useEffect(() => {
    fetchTalleres();
  }, []);

  // Función para abrir el formulario
  const handleShowForm = (taller = null) => {
    if (taller) {
      setCurrentTaller(taller); // Rellenar el formulario con los datos del taller a modificar
      setEditingTaller(true);
    } else {
      setCurrentTaller({ nombreTienda: "", direccion: "", ciudad: "", region: "" }); // Limpiar el formulario para agregar uno nuevo
      setEditingTaller(false);
    }
    setShowFormModal(true); // Mostrar el modal
  };

  // Función para manejar la creación o modificación de un taller
  const handleSaveTaller = async (e) => {
    e.preventDefault();
    try {
      if (editingTaller) {
        // Modificar el taller existente
        const tallerRef = doc(db, "tiendas", currentTaller.id);
        await updateDoc(tallerRef, currentTaller);
      } else {
        // Agregar un nuevo taller
        await addDoc(collection(db, "tiendas"), currentTaller);
      }
      fetchTalleres(); // Recargar los talleres
      setShowFormModal(false); // Cerrar el modal
    } catch (error) {
      console.error("Error al guardar el taller: ", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Contenido Principal - Lista de Talleres */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-7xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Talleres Creados</h1>

            {/* Botón para agregar taller */}
            <Button variant="default" onClick={() => handleShowForm(null)}>
              Agregar Taller
            </Button>

            {/* Mostrar mensaje de carga o error */}
            {loading && <div>Cargando talleres...</div>}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Mostrar talleres en tarjetas */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {talleres.map((taller) => (
                <Card key={taller.id} className="bg-gray-100 shadow-lg">
                  <CardHeader className="p-4">
                    <CardTitle className="text-xl font-bold">{taller.nombreTienda}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p><strong>Dirección:</strong> {taller.direccion}</p>
                    <p><strong>Ciudad:</strong> {taller.ciudad}</p>
                    <p><strong>Región:</strong> {taller.region}</p>
                    <Button variant="default" onClick={() => handleShowForm(taller)}>
                      Modificar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Mensaje si no hay talleres */}
            {!loading && talleres.length === 0 && (
              <div className="text-gray-500">No hay talleres creados.</div>
            )}
          </div>
        </main>
      </div>

      {/* Modal del formulario */}
      {showFormModal && (
        <Form show={showFormModal} onClose={() => setShowFormModal(false)}>
          <h2 className="text-xl font-bold mb-4">{editingTaller ? "Modificar Taller" : "Agregar Nuevo Taller"}</h2>
          <form onSubmit={handleSaveTaller}>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre del Taller</label>
              <input
                type="text"
                value={currentTaller.nombreTienda}
                onChange={(e) => setCurrentTaller({ ...currentTaller, nombreTienda: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Dirección</label>
              <input
                type="text"
                value={currentTaller.direccion}
                onChange={(e) => setCurrentTaller({ ...currentTaller, direccion: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Ciudad</label>
              <input
                type="text"
                value={currentTaller.ciudad}
                onChange={(e) => setCurrentTaller({ ...currentTaller, ciudad: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Región</label>
              <input
                type="text"
                value={currentTaller.region}
                onChange={(e) => setCurrentTaller({ ...currentTaller, region: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-between">
              <Button type="submit" className="bg-blue-500 text-white">
                {editingTaller ? "Guardar Cambios" : "Agregar Taller"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
