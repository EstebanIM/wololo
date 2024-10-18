import { useState } from "react";
import { Button } from "../ui/button"; // Importa tu componente de botón
import { Input } from "../ui/Input"; // Importa tu componente de input
import { Label } from "../ui/Label"; // Importa el componente Label
import { auth, db } from '../../libs/firebase'; // Firebase auth y Firestore
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"; // Para registrar usuario y enviar verificación
import { doc, setDoc } from "firebase/firestore"; // Para guardar datos en Firestore
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { useNavigate, Link } from 'react-router-dom'; // Para redirigir a otra página
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"; // Importa Card para el diseño

export default function Register() {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        rut: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Para redirigir

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { nombre, apellido, rut, email, password, confirmPassword } = formData;

        // Validaciones básicas
        if (!nombre || !apellido || !rut || !email || !password || !confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos',
            });
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden',
            });
            return;
        }

        setLoading(true);

        try {
            // Registro de usuario en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar datos adicionales en Firestore
            await setDoc(doc(db, "users", user.uid), {
                nombre,
                apellido,
                rut,
                email
            });

            // Enviar correo de verificación
            await sendEmailVerification(user);

            setLoading(false);

            // Mostrar alerta de éxito con SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'Por favor, verifica tu correo electrónico.',
            });

            // Redirigir al usuario a la página de confirmación
            navigate("/confirm-register");

        } catch (error) {
            setLoading(false);

            // Mostrar alerta de error con SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: error.message,
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md bg-black text-black shadow-xl rounded-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Registro de Usuario</CardTitle>
                    <CardDescription>
                        Crea tu cuenta en CarMotorFix
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="nombre" className="text-black">Nombre</Label>
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Nombre"
                                    type="text"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="apellido" className="text-black">Apellido</Label>
                                <Input
                                    id="apellido"
                                    name="apellido"
                                    placeholder="Apellido"
                                    type="text"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="rut" className="text-black">RUT</Label>
                                <Input
                                    id="rut"
                                    name="rut"
                                    placeholder="RUT"
                                    type="text"
                                    value={formData.rut}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-black">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="Correo Electrónico"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-black">Contraseña</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword" className="text-black">Confirmar Contraseña</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirmar Contraseña"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <Button className="w-full bg-yellow-500 hover:bg-yellow-600" type="submit" disabled={loading}>
                                {loading ? "Registrando..." : "Registrarse"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-4 text-center text-sm text-gray-300">
                        <span>¿Ya tienes una cuenta? </span>
                        <Link to="/login" className="text-yellow-500 hover:underline">
                            Inicia Sesión
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
