import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/login/Login'; // Ruta al componente Login
import ResetPasswordForm from './Components/login/resetPassword'; // Importa el componente de ResetPassword
import Dashboard from './Components/all/dashboard'; // Importa el componente de Dashboard
import CrearTaller from './Components/admin/Tienda/CrearTaller';
import GetTaller from './Components/admin/Tienda/GetTaller';
import { AuthProvider } from './Context/Authcontext'; // Proveedor de contexto de autenticación
import ProtectedRoute from './Context/ProtectedRoute'; // Componente para proteger rutas
import RedirectIfLoggedIn from './Context/RedirectIfLoggedIn'; // Componente para redirigir usuarios autenticados
import CrearDueño from './Components/duenio/Crear_duenio';
import CompleteAdminInfo from './Components/User/CompleteAdminInfo';
import MisAutos from './Components/cliente/mis-autos'; // Ruta corregida
import Register from './Components/register/register'; // Ruta al componente Register
import ConfirmRegister from './Components/register/confirmRegister'; // Ruta para ConfirmRegister

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública: si el usuario está autenticado, redirige al dashboard */}
          <Route
            path="/"
            element={
              <RedirectIfLoggedIn>
                <Login /> {/* Muestra el Login solo si no está autenticado */}
              </RedirectIfLoggedIn>
            }
          />

          {/* Ruta pública: si el usuario está autenticado, redirige al dashboard */}
          <Route
            path="/reset-password"
            element={
              <RedirectIfLoggedIn>
                <ResetPasswordForm /> {/* Muestra Reset Password solo si no está autenticado */}
              </RedirectIfLoggedIn>
            }
          />

          {/* Ruta pública: Página de Registro */}
          <Route
            path="/register"
            element={
              <RedirectIfLoggedIn>
                <Register /> {/* Muestra el formulario de Registro solo si no está autenticado */}
              </RedirectIfLoggedIn>
            }
          />

          {/* Ruta pública: Página de login */}
          <Route
            path="/login"
            element={
              <RedirectIfLoggedIn>
                <Login /> {/* Muestra el formulario de Registro solo si no está autenticado */}
              </RedirectIfLoggedIn>
            }
          />

          {/* Ruta pública: Confirmación de Registro */}
          <Route
            path="/confirm-register"
            element={<ConfirmRegister />}
          />

          {/* Ruta protegida: Dashboard */}
          <Route
            path="/mis-autos"
            element={
              <ProtectedRoute>
                <MisAutos /> {/* Renderiza la página Mis Autos si el usuario está autenticado */}
              </ProtectedRoute>
            }
          />

          {/* Ruta protegida: Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard /> {/* Renderiza el Dashboard solo si el usuario está autenticado */}
              </ProtectedRoute>
            }
          />

          {/* Ruta protegida: Crear Tienda */}
          <Route
            path="/ver-taller"
            element={
              <ProtectedRoute>
                <GetTaller /> {/* Renderiza Crear Tienda solo si el usuario está autenticado */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/crear-taller"
            element={
              <ProtectedRoute>
                <CrearTaller /> {/* Renderiza Crear Tienda solo si el usuario está autenticado */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/crear-dueño"
            element={
              <ProtectedRoute>
                <CrearDueño /> {/* Renderiza Crear Tienda solo si el usuario está autenticado */}
              </ProtectedRoute>
            }
          />

          <Route
            path="/complete-admin-info/:adminId"
            element={<CompleteAdminInfo />}
          />



        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;
