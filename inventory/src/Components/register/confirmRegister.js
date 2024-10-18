import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../libs/firebase'; // Importa Firebase auth
import { onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';

export default function ConfirmRegister() {
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica si el usuario ha confirmado el correo
        const checkEmailVerified = async (intervalId) => {
            const user = auth.currentUser;
            if (user) {
                await user.reload(); // Recarga los datos del usuario para obtener el estado más reciente
                if (user.emailVerified) {
                    clearInterval(intervalId); // Detiene el intervalo inmediatamente después de verificar

                    // Si el correo ha sido verificado, redirige al dashboard
                    Swal.fire({
                        icon: 'success',
                        title: 'Correo verificado',
                        text: 'Tu correo ha sido verificado correctamente. Redirigiendo al Dashboard...',
                        timer: 3000,
                        showConfirmButton: false,
                    });

                    // Redirige al Dashboard después de 3 segundos
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 3000);
                }
            }
        };

        // Configura la escucha del estado del usuario
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Configura un intervalo para verificar el estado de la verificación del correo
                const intervalId = setInterval(() => checkEmailVerified(intervalId), 3000); // Verifica cada 3 segundos

                // Limpia el intervalo cuando el componente se desmonta
                return () => clearInterval(intervalId);
            }
        });

        return () => unsubscribe(); // Limpia la escucha del estado del usuario cuando el componente se desmonta
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-black p-8 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-yellow-500 mb-4">Verifica tu Correo Electrónico</h1>
                <p className="text-white mb-4">
                    Te hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.
                </p>
                <p className="text-gray-400">
                    Una vez que hayas verificado tu correo, serás redirigido automáticamente al Dashboard.
                </p>
            </div>
        </div>
    );
}
