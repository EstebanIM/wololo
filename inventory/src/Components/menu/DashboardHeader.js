import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Bell, Menu, User, Settings, LogOut } from "lucide-react";
import { useAuth } from '../../Context/Authcontext'; // Hook de autenticación para cerrar sesión
import { db } from '../../libs/firebase'; // Suponiendo que tienes configurado Firestore
import { doc, getDoc } from "firebase/firestore"; // Métodos para interactuar con Firestore

export default function DashboardHeader({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(null); // Estado para almacenar el nombre del usuario
  const { currentUser, logout } = useAuth(); // Obtén el usuario actual y la función de logout desde el contexto de Auth

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = async () => {
    try {
      await logout(); // Llamada para cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Efecto para obtener el nombre del usuario desde Firestore
  useEffect(() => {
    const fetchUserName = async () => {
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid); // Accede al documento del usuario autenticado en 'users'
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserName(userSnap.data().nombre); // Asigna el nombre al estado
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserName();
  }, [currentUser]); // Ejecutar el efecto cuando currentUser cambie

  return (
    <header className="bg-white shadow-md z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggleSidebar}>
            <Menu className="h-6 w-6 text-gray-600 hover:text-gray-800 transition duration-150" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">CarMotorFix</h1>
        </div>
        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="icon" className="flex items-center relative">
            <Bell className="h-6 w-6 text-gray-600 hover:text-gray-800 transition duration-150" />
            {/* Indicador de notificaciones */}
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 bg-red-500 rounded-full" />
          </Button>

          {/* Dropdown de usuario */}
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={toggleDropdown} className="flex items-center space-x-2">
              <User className="h-6 w-6 text-gray-600 hover:text-gray-800 transition duration-150" />
              <span className="text-gray-800 text-sm font-medium">{userName ? userName : "Usuario"}</span>
            </Button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-20 ring-1 ring-black ring-opacity-5 transition-transform duration-300 ease-out">
                {/* Muestra el nombre del usuario */}
                <div className="px-4 py-2 text-sm font-medium text-gray-700">
                  {userName ? `Hola, ${userName}` : "Cargando..."}
                </div>
                <div className="border-t border-gray-200"></div>
                <div
                  className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition duration-150"
                  onClick={() => console.log('Configuración seleccionada')}
                >
                  <Settings className="mr-2 h-4 w-4 text-gray-500" /> Configuración
                </div>
                <div
                  className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition duration-150"
                  onClick={handleLogout} // Función para cerrar sesión
                >
                  <LogOut className="mr-2 h-4 w-4 text-gray-500" /> Cerrar Sesión
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
