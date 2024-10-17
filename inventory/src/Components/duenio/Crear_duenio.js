import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { db } from "../../libs/firebase"; // Importamos Firestore
import { collection, addDoc } from "firebase/firestore"; // Para interactuar con Firestore
import DashboardHeader from "../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../menu/DashboardSidebar"; // Importar el sidebar del dashboard

export default function CrearUsuario() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rol, setRol] = useState(""); // Estado para almacenar el rol (superadmin/admin)
  const [correoSuperadmin, setCorreoSuperadmin] = useState(""); // Estado para el correo del superadmin
  const [nombreMarca, setNombreMarca] = useState(""); // Estado para el nombre de la marca si es admin
  const [correoAdmin, setCorreoAdmin] = useState(""); // Estado para el correo del admin
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
    setLoading(true); // Inicia la carga
    setError(null); // Resetea el error
    setSuccess(false); // Resetea el mensaje de éxito

    // Validación simple para evitar campos vacíos
    if (rol === "admin" && (!correoAdmin || !nombreMarca)) {
      setError("Todos los campos son obligatorios para un admin.");
      setLoading(false);
      return;
    }

    if (rol === "superadmin" && !correoSuperadmin) {
      setError("El correo es obligatorio para un superadmin.");
      setLoading(false);
      return;
    }

    try {
      if (rol === "superadmin") {
        // Agregar los datos del superadmin a Firestore en la colección "superadmins"
        await addDoc(collection(db, "superadmins"), {
          correoSuperadmin, // Guardar solo el correo del superadmin
          rol: "superadmin",
          fechaCreacion: new Date(),
        });
        console.log('Superadmin creado correctamente');
      } else if (rol === "admin") {
        // Agregar los datos del admin a Firestore en la colección "admins"
        const adminRef = await addDoc(collection(db, "admins"), {
          correoAdmin, // Guardar el correo del admin
          nombreMarca, // Guardar el nombre comercial de la marca
          rol: "admin",
          fechaCreacion: new Date(),
        });

        console.log('Documento admin creado con id:', adminRef.id);

        // Verifica que `adminRef.id` es válido
        if (!adminRef.id) {
          console.error('Error: adminId no está disponible');
          setError("No se pudo obtener el ID del admin creado.");
          return;
        }

        // Llama al backend con el adminId correcto
        const response = await fetch("http://localhost:5001/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correoAdmin,
            nombreMarca,
            adminId: adminRef.id,  // Asegúrate de que estás enviando `adminId`
          }),
        });

        // Verifica la respuesta del servidor
        if (!response.ok) {
          const message = `Error en la solicitud: ${response.statusText}`;
          console.error(message);
          throw new Error(message);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
      }

      // Si el usuario se creó con éxito
      setSuccess(true);
      setCorreoSuperadmin("");
      setCorreoAdmin("");
      setNombreMarca("");
      setRol("");
    } catch (err) {
      // Si ocurre un error
      console.error('Error al procesar la solicitud:', err);
      setError("Error al procesar la solicitud: " + err.message);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Contenido Principal - Formulario para Crear Usuario */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Crear Usuario</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">Usuario creado exitosamente</div>}
            
            <form onSubmit={handleSubmit}>
              {/* Seleccionar el rol */}
              <div className="mb-4">
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  id="rol"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione un rol</option>
                  <option value="superadmin">Superadmin</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Mostrar campos específicos si es superadmin */}
              {rol === "superadmin" && (
                <>
                  <div className="mb-4">
                    <label htmlFor="correoSuperadmin" className="block text-sm font-medium text-gray-700">
                      Correo Electrónico del Superadmin
                    </label>
                    <Input
                      id="correoSuperadmin"
                      type="email"
                      placeholder="Correo electrónico"
                      value={correoSuperadmin}
                      onChange={(e) => setCorreoSuperadmin(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              {/* Mostrar campos específicos si es admin */}
              {rol === "admin" && (
                <>
                  <div className="mb-4">
                    <label htmlFor="nombreMarca" className="block text-sm font-medium text-gray-700">
                      Nombre Comercial
                    </label>
                    <Input
                      id="nombreMarca"
                      type="text"
                      placeholder="Nombre de comercial"
                      value={nombreMarca}
                      onChange={(e) => setNombreMarca(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="correoAdmin" className="block text-sm font-medium text-gray-700">
                      Correo Electrónico del Admin
                    </label>
                    <Input
                      id="correoAdmin"
                      type="email"
                      placeholder="Correo electrónico"
                      value={correoAdmin}
                      onChange={(e) => setCorreoAdmin(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              {/* Botón de crear */}
              <div className="mb-4">
                <Button type="submit" className="w-full bg-blue-500 text-white" disabled={loading}>
                  {loading ? "Procesando..." : "Enviar"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
