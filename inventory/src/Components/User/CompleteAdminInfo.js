import React, { useEffect, useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/button';
import { useParams, useNavigate } from 'react-router-dom'; // Para obtener el adminId de la URL
import { db } from '../../libs/firebase'; // Importamos Firestore
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Para interactuar con Firestore
import { toast, ToastContainer } from 'react-toastify'; // Importamos react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toastify

const CompleteAdminInfo = () => {
  const { adminId } = useParams(); // Obtenemos el adminId desde la URL
  const navigate = useNavigate(); // Para redirigir al usuario después de completar la información
  const [adminData, setAdminData] = useState(null); // Almacenará los datos del admin
  const [rut, setRut] = useState(''); // Estado para el RUT
  const [numVerificador, setNumVerificador] = useState(''); // Estado para el número verificador del RUT
  const [primNom, setPrimNom] = useState(''); // Estado para el primer nombre
  const [primAp, setPrimAp] = useState(''); // Estado para el primer apellido
  const [clave, setClave] = useState(''); // Estado para la clave
  const [confirmarClave, setConfirmarClave] = useState(''); // Estado para la confirmación de clave
  const [nombreComercial, setNombreComercial] = useState(''); // Estado para el nombre comercial
  const [correoAdmin, setCorreoAdmin] = useState(''); // Estado para el correo electrónico
  const [claveSegura, setClaveSegura] = useState(0); // Estado para el nivel de seguridad de la clave
  const [loading, setLoading] = useState(false);

  // Obtener los datos del admin desde Firestore
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminRef = doc(db, 'admins', adminId); // Referencia al documento en Firestore
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          const admin = adminSnap.data();
          setAdminData(admin); // Guardamos los datos del admin en el estado
          setNombreComercial(admin.nombreMarca || ''); // Asignamos el nombre comercial si existe
          setCorreoAdmin(admin.correoAdmin || ''); // Asignamos el correo del admin
        } else {
          toast.error('No se encontraron datos para este administrador.');
        }
      } catch (err) {
        toast.error('Error al obtener los datos del administrador: ' + err.message);
      }
    };

    fetchAdminData();
  }, [adminId]);

  // Función para evaluar la seguridad de la clave
  const evaluarClave = (clave) => {
    let nivel = 0;

    if (clave.length >= 8) nivel += 1; // Clave tiene 8 o más caracteres
    if (/[a-z]/.test(clave)) nivel += 1; // Tiene letras minúsculas
    if (/[A-Z]/.test(clave)) nivel += 1; // Tiene letras mayúsculas
    if (/\d/.test(clave)) nivel += 1;    // Tiene dígitos
    if (/[!@#$%^&*]/.test(clave)) nivel += 1; // Tiene caracteres especiales

    setClaveSegura(nivel); // Establecer el nivel de seguridad de la clave
  };

  // Función para verificar si el correo es válido
  const esCorreoValido = (correo) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(correo);
  };

  // Función para manejar la actualización de los datos del admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación de los campos
    if (!rut || !numVerificador || !primNom || !primAp || !nombreComercial) {
      toast.error('Todos los campos son obligatorios.');
      setLoading(false);
      return;
    }

    // Validación del RUT (debe ser de 8 dígitos)
    if (!/^\d{8}$/.test(rut)) {
      toast.error('El RUT debe ser de exactamente 8 dígitos.');
      setLoading(false);
      return;
    }

    // Validación del número verificador (solo un dígito o "K/k")
    if (!/^[0-9kK]$/.test(numVerificador) || numVerificador.length !== 1) {
      toast.error('El número verificador debe ser un dígito entre 0-9 o "K".');
      setLoading(false);
      return;
    }

    // Verificación del correo electrónico
    if (!esCorreoValido(correoAdmin)) {
      toast.error('El formato del correo electrónico es inválido.');
      setLoading(false);
      return;
    }

    // Validación de la clave (mínimo nivel 3)
    if (claveSegura < 3 && clave.length > 0) {
      toast.error('La clave debe cumplir con al menos un nivel de seguridad 3/5.');
      setLoading(false);
      return;
    }

    if (clave !== confirmarClave) {
      toast.error('Las claves no coinciden.');
      setLoading(false);
      return;
    }

    try {
      // Actualizar los datos del admin en Firestore
      const adminRef = doc(db, 'admins', adminId);
      await updateDoc(adminRef, {
        rut,
        numVerificador,
        primNom,
        primAp,
        clave: clave.length > 0 ? clave : null, // Guardar clave como null si no se ingresa
        nombreComercial,
        fechaActualizacion: new Date(),
      });

      toast.success('Información actualizada exitosamente.');
      // Limpiar los campos después de la actualización
      setRut('');
      setNumVerificador('');
      setPrimNom('');
      setPrimAp('');
      setClave('');
      setConfirmarClave('');
      setNombreComercial('');

      // Redirigir a la página de éxito o al dashboard
      navigate('/dashboard'); // Redirige al dashboard o a una página de éxito
    } catch (err) {
      toast.error('Error al actualizar la información: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRutChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remover todo lo que no sea número
    setRut(value);
  };

  const handleNumVerificadorChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^0-9K]/g, ''); // Solo números y "K"
    setNumVerificador(value);
  };

  if (!adminData) {
    return <div className="text-center py-6">Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
      {/* Contenedor Toast */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

      <div className="w-full max-w-lg p-4 bg-white shadow-md rounded-lg">
        {/* Saludo personalizado */}
        <h1 className="text-2xl font-bold mb-6 text-center">
          Bienvenido, Administrador de {nombreComercial || 'talleres'}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Mostrar el correo ya registrado */}
          <div className="mb-4">
            <label htmlFor="correoAdmin" className="block text-sm font-medium text-gray-700">
              Correo Electrónico (No editable)
            </label>
            <Input
              id="correoAdmin"
              type="email"
              value={correoAdmin}
              disabled
              className="mt-1 w-full"
            />
          </div>

          {/* Primer Nombre */}
          <div className="mb-4">
            <label htmlFor="primNom" className="block text-sm font-medium text-gray-700">
              Primer Nombre
            </label>
            <Input
              id="primNom"
              type="text"
              placeholder="Primer Nombre"
              value={primNom}
              onChange={(e) => setPrimNom(e.target.value)}
              required
              className="mt-1 w-full"
            />
          </div>

          {/* Primer Apellido */}
          <div className="mb-4">
            <label htmlFor="primAp" className="block text-sm font-medium text-gray-700">
              Primer Apellido
            </label>
            <Input
              id="primAp"
              type="text"
              placeholder="Primer Apellido"
              value={primAp}
              onChange={(e) => setPrimAp(e.target.value)}
              required
              className="mt-1 w-full"
            />
          </div>

          {/* Campo para el RUT y número verificador */}
          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <label htmlFor="rut" className="block text-sm font-medium text-gray-700">
                RUT (8 dígitos)
              </label>
              <Input
                id="rut"
                type="text"
                placeholder="12345678"
                value={rut}
                onChange={handleRutChange}
                required
                maxLength={8}
                className="mt-1 w-full"
              />
            </div>
            <div className="w-16">
              <label htmlFor="numVerificador" className="block text-sm font-medium text-gray-700">
                Verificador
              </label>
              <Input
                id="numVerificador"
                type="text"
                placeholder="V"
                value={numVerificador}
                onChange={handleNumVerificadorChange}
                required
                className="mt-1 w-full"
                maxLength={1}
              />
            </div>
          </div>

          {/* Campo para la clave */}
          <div className="mb-4">
            <label htmlFor="clave" className="block text-sm font-medium text-gray-700">
              Clave (Opcional, debe ser de 8 caracteres mínimo)
            </label>
            <Input
              id="clave"
              type="password"
              placeholder="Ingrese su clave"
              value={clave}
              onChange={(e) => {
                setClave(e.target.value);
                evaluarClave(e.target.value); // Evalúa la fortaleza de la clave en tiempo real
              }}
              className="mt-1 w-full"
            />
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className={`h-full ${
                    claveSegura < 3
                      ? 'bg-red-500'
                      : claveSegura < 4
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${(claveSegura / 5) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Seguridad de la clave: {claveSegura}/5
              </p>
            </div>
          </div>

          {/* Campo para confirmar la clave */}
          <div className="mb-4">
            <label htmlFor="confirmarClave" className="block text-sm font-medium text-gray-700">
              Confirmar Clave
            </label>
            <Input
              id="confirmarClave"
              type="password"
              placeholder="Confirme su clave"
              value={confirmarClave}
              onChange={(e) => setConfirmarClave(e.target.value)}
              className="mt-1 w-full"
            />
          </div>

          {/* Botón de enviar */}
          <div className="mb-4">
            <Button type="submit" className="w-full bg-blue-500 text-white" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar Información'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteAdminInfo;
