import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronUp, ChevronDown, Users, CarFront, File, Store, Bug, X, List, UserPlus } from "lucide-react";
import { Link } from 'react-router-dom';

export default function DashboardSidebar({ sidebarOpen, toggleSidebar }) {
  const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);
  const [isInventoryMenuOpen, setIsInventoryMenuOpen] = useState(false);
  const [isQrMenuOpen, setIsQrMenuOpen] = useState(false);
  const [isRackMenuOpen, setIsRackMenuOpen] = useState(false);
  const [isTallerMenuOpen, setIsTallerMenuOpen] = useState(false); // Nuevo estado para el menú de Taller
  const [isBugsMenuOpen, setIsBugsMenuOpen] = useState(false);
  const [isDuenosMenuOpen, setIsDuenosMenuOpen] = useState(false);

  const toggleUsersMenu = () => setIsUsersMenuOpen(!isUsersMenuOpen);
  const toggleInventoryMenu = () => setIsInventoryMenuOpen(!isInventoryMenuOpen);
  const toggleQrMenu = () => setIsQrMenuOpen(!isQrMenuOpen);
  const toggleRackMenu = () => setIsRackMenuOpen(!isRackMenuOpen);
  const toggleTallerMenu = () => setIsTallerMenuOpen(!isTallerMenuOpen); // Alternar el menú de Taller
  const toggleBugsMenu = () => setIsBugsMenuOpen(!isBugsMenuOpen);
  const toggleDuenosMenu = () => setIsDuenosMenuOpen(!isDuenosMenuOpen);

  return (
    <aside
      className={`bg-white w-64 md:w-64 md:flex-shrink-0 md:flex md:flex-col p-4 transition-all duration-300 ease-in-out
      fixed left-0 top-0 bottom-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-6 w-6 mr-2" />
          <span className="text-xl font-bold">CarMotorFix</span>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <nav className="space-y-2 overflow-y-auto">
        {/* Sección de Inventario (Autos) */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleInventoryMenu}
          >
            <CarFront className="mr-2 h-4 w-4" /> Autos
            {isInventoryMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isInventoryMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Link to="/mis-autos" className="w-full block">
                <Button
                  variant="ghost"
                  className="w-full justify-center bg-gray-100 hover:bg-gray-200 focus:bg-gray-300 active:bg-gray-300 text-center"
                >
                  Mis Autos
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Sección para el Taller */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleTallerMenu} // Toggle para la sección Taller
          >
            <Store className="mr-2 h-4 w-4" /> Taller
            {isTallerMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isTallerMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Link to="/ver-taller" className="w-full block">
                <Button variant="ghost" className="w-full justify-start">Ver Talleres</Button>
              </Link>
            </div>
          )}
        </div>

        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleUsersMenu}
          >
            <Users className="mr-2 h-4 w-4" /> Mecanico
            {isUsersMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isUsersMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Button variant="ghost" className="w-full justify-start">Crear Mecanico</Button>
              <Button variant="ghost" className="w-full justify-start">Ver Mecanico</Button>
              <Button variant="ghost" className="w-full justify-start">Modificar Mecanico</Button>
            </div>
          )}
        </div>

        {/* Sección para Ordenes */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleQrMenu}
          >
            <File className="mr-2 h-4 w-4" /> Orden de Compra
            {isQrMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isQrMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Button variant="ghost" className="w-full justify-start">Crear Ot</Button>
              <Button variant="ghost" className="w-full justify-start">Eliminar Ot</Button>
              <Button variant="ghost" className="w-full justify-start">Ver OT</Button>
            </div>
          )}
        </div>

        {/* Sección para Servicios */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleRackMenu}
          >
            <List className="mr-2 h-4 w-4" /> Servicio
            {isRackMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isRackMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Button variant="ghost" className="w-full justify-start">Crear Servicio</Button>
              <Button variant="ghost" className="w-full justify-start">Modificar Servicio</Button>
              <Button variant="ghost" className="w-full justify-start">Ver Servicio</Button>
            </div>
          )}
        </div>

        {/* Sección para Bugs */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleBugsMenu}
          >
            <Bug className="mr-2 h-4 w-4" /> Bugs
            {isBugsMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isBugsMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Button variant="ghost" className="w-full justify-start">Crear Comentario</Button>
              <Button variant="ghost" className="w-full justify-start">Ver Bugs</Button>
            </div>
          )}
        </div>

        {/* Sección para Administradores */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center"
            onClick={toggleDuenosMenu}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Admin
            {isDuenosMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
          </Button>
          {isDuenosMenuOpen && (
            <div className="pl-6 mt-2 space-y-1">
              <Link to="/crear-dueño" className="w-full block">
                <Button variant="ghost" className="w-full justify-start">Crear admin</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start">Ver admin</Button>
              <Button variant="ghost" className="w-full justify-start">Modificar admin</Button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
