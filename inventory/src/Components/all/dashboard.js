import { useState } from "react";
import DashboardHeader from "../menu/DashboardHeader"; // Importar el header del dashboard
import DashboardSidebar from "../menu/DashboardSidebar"; // Importar el sidebar del dashboard
import { Wrench, MessageSquare, ClipboardList } from "lucide-react"; // Importar iconos relacionados a la mecánica y comunicación

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Contenido del Dashboard */}
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            {/* Logo */}
            <img src="/logo.png" alt="CarMotorFix Logo" className="w-48 h-48 mx-auto mb-6" />

            {/* Título o eslogan */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenido a CarMotorFix</h1>
            <p className="text-lg text-gray-600 mb-6">
              Gestiona tus órdenes de trabajo y mejora la comunicación entre tu taller y los clientes.
            </p>

            {/* Iconos relacionados con la gestión y comunicación */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <ClipboardList className="h-12 w-12 text-gray-700" />
                <span className="mt-2 text-gray-600">Órdenes de Trabajo</span>
              </div>
              <div className="flex flex-col items-center">
                <MessageSquare className="h-12 w-12 text-gray-700" />
                <span className="mt-2 text-gray-600">Comunicación con Clientes</span>
              </div>
              <div className="flex flex-col items-center">
                <Wrench className="h-12 w-12 text-gray-700" />
                <span className="mt-2 text-gray-600">Herramientas de Mantenimiento</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
