import React, { useState, useEffect } from "react";
import { db } from "../../../libs/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import DashboardHeader from "../../menu/DashboardHeader";
import DashboardSidebar from "../../menu/DashboardSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card";
import { Button } from "../../ui/button"; // Importar tu componente Button
import comunasRegiones from "../../../data/comunas-regiones.json";
import Swal from "sweetalert2"; // Para alertas

export default function VerTalleres() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [talleres, setTalleres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTaller, setNewTaller] = useState({
    nombreTienda: "",
    direccion: "",
    region: "",
    comuna: "",
  });
  const [editingTaller, setEditingTaller] = useState(null); // Para manejar el estado de edición

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchTalleres = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tiendas"));
      const talleresData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTalleres(talleresData);
      setLoading(false);
    } catch (err) {
      setError("Error al obtener los talleres: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalleres();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTaller((prev) => ({ ...prev, [name]: value }));
  };

  const filteredComunas =
    comunasRegiones.regiones.find((r) => r.region === newTaller.region)
      ?.comunas || [];

  const handleAddOrEditTaller = async (e) => {
    e.preventDefault(); // Evita cualquier comportamiento predeterminado como redirecciones

    if (
      !newTaller.nombreTienda ||
      !newTaller.direccion ||
      !newTaller.region ||
      !newTaller.comuna
    ) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    try {
      if (editingTaller) {
        // Editar taller existente
        await updateDoc(doc(db, "tiendas", editingTaller.id), newTaller);
        Swal.fire("Actualizado", "Taller modificado correctamente", "success");
      } else {
        // Agregar nuevo taller
        await addDoc(collection(db, "tiendas"), newTaller);
        Swal.fire("Agregado", "Taller agregado correctamente", "success");
      }

      // Reinicia el formulario y el estado después de guardar
      setShowModal(false);
      setNewTaller({ nombreTienda: "", direccion: "", region: "", comuna: "" });
      setEditingTaller(null);

      // Refresca la lista de talleres
      fetchTalleres();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el taller", "error");
    }
  };

  const handleEditTaller = (taller) => {
    setNewTaller(taller);
    setEditingTaller(taller);
    setShowModal(true);
  };

  const handleDeleteTaller = async (tallerId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "tiendas", tallerId));
        Swal.fire("Eliminado", "Taller eliminado correctamente", "success");
        fetchTalleres();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el taller", "error");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-7xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Talleres Creados</h1>

            {loading && <div>Cargando talleres...</div>}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {talleres.map((taller) => (
                <Card key={taller.id} className="bg-gray-100 shadow-lg">
                  <CardHeader className="p-4">
                    <CardTitle className="text-xl font-bold">
                      {taller.nombreTienda}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p>
                      <strong>Dirección:</strong> {taller.direccion}
                    </p>
                    <p>
                      <strong>Ciudad:</strong> {taller.comuna}
                    </p>
                    <p>
                      <strong>Región:</strong> {taller.region}
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleEditTaller(taller)}
                      >
                        Modificar
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        className="bg-[#F59E0B] hover:bg-[#D97706] text-white"
                        onClick={() => handleDeleteTaller(taller.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!loading && talleres.length === 0 && (
              <div className="text-gray-500">No hay talleres creados.</div>
            )}

            {/* Botón para abrir el modal de agregar/modificar taller */}
            <div className="mt-6">
              <Button
                variant="default"
                size="md"
                onClick={() => {
                  setNewTaller({
                    nombreTienda: "",
                    direccion: "",
                    region: "",
                    comuna: "",
                  });
                  setShowModal(true);
                }}
              >
                Agregar Taller
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para agregar/modificar taller */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative md:w-1/2 lg:w-1/3">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingTaller ? "Modificar Taller" : "Agregar Nuevo Taller"}
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Nombre del Taller</label>
                <input
                  type="text"
                  name="nombreTienda"
                  value={newTaller.nombreTienda}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={newTaller.direccion}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Región</label>
                <select
                  name="region"
                  value={newTaller.region}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Selecciona una región</option>
                  {comunasRegiones.regiones.map((region) => (
                    <option key={region.region} value={region.region}>
                      {region.region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Comuna</label>
                <select
                  name="comuna"
                  value={newTaller.comuna}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Selecciona una comuna</option>
                  {filteredComunas.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 mt-4 flex justify-end">
                <Button
                  variant="default"
                  size="md"
                  onClick={handleAddOrEditTaller}
                >
                  {editingTaller ? "Guardar Cambios" : "Agregar Taller"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
