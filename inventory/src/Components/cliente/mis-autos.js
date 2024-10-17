import React, { useState, useEffect } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { Form } from "../ui/Form";
import { db } from "../../libs/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import DashboardHeader from "../menu/DashboardHeader";
import DashboardSidebar from "../menu/DashboardSidebar";
import Swal from 'sweetalert2';

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Autos
    const [autos, setAutos] = useState([]);
    const [auto, setAuto] = useState({ marca: "", modelo: "", year: "", patente: "", tipoMotor: "", color: "", taller: "", mecanico: "" });
    const [currentAutoId, setCurrentAutoId] = useState(null);
    const [showAutoModal, setShowAutoModal] = useState(false);
    const [editingAuto, setEditingAuto] = useState(false);

    // Cotizaciones
    const [cotizaciones, setCotizaciones] = useState([]);
    const [cotizacion, setCotizacion] = useState({ fecha: "", taller: "", tipoMantencion: "", detalle: "" });
    const [currentCotizacionId, setCurrentCotizacionId] = useState(null);
    const [showCotizacionModal, setShowCotizacionModal] = useState(false);
    const [editingCotizacion, setEditingCotizacion] = useState(false);

    useEffect(() => {
        const fetchAutos = async () => {
            const autosSnapshot = await getDocs(collection(db, "autos"));
            const autosList = autosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAutos(autosList);
        };

        const fetchCotizaciones = async () => {
            const cotizacionesSnapshot = await getDocs(collection(db, "cotizaciones"));
            const cotizacionesList = cotizacionesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCotizaciones(cotizacionesList);
        };

        fetchAutos();
        fetchCotizaciones();
    }, []);

    // Autos: Guardar (Agregar o Editar)
    const handleAddOrEditAuto = async (e) => {
        e.preventDefault();
        try {
            if (editingAuto) {
                const autoRef = doc(db, "autos", currentAutoId);
                await updateDoc(autoRef, auto);
                setAutos(autos.map((a) => (a.id === currentAutoId ? { ...auto, id: currentAutoId } : a)));
                Swal.fire('Actualizado', 'El auto ha sido actualizado correctamente', 'success');
            } else {
                const newAutoRef = await addDoc(collection(db, "autos"), auto);
                setAutos([...autos, { id: newAutoRef.id, ...auto }]);
                Swal.fire('Agregado', 'El auto ha sido agregado correctamente', 'success');
            }
        } catch (error) {
            Swal.fire('Error', 'Error al guardar el auto', 'error');
        }
        setShowAutoModal(false);
        setAuto({ marca: "", modelo: "", year: "", patente: "", tipoMotor: "", color: "", taller: "", mecanico: "" });
        setEditingAuto(false);
        setCurrentAutoId(null);
    };

    // Autos: Abrir modal para ver y editar auto
    const handleViewAuto = (autoToView) => {
        setAuto(autoToView);
        setCurrentAutoId(autoToView.id);
        setEditingAuto(true);
        setShowAutoModal(true);
    };

    // Autos: Eliminar
    const handleDeleteAuto = async (autoId) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esta acción",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminarlo'
            });

            if (result.isConfirmed) {
                await deleteDoc(doc(db, "autos", autoId));
                setAutos(autos.filter((a) => a.id !== autoId));
                Swal.fire('Eliminado', 'El auto ha sido eliminado correctamente', 'success');
            }
        } catch (error) {
            Swal.fire('Error', 'Error al eliminar el auto', 'error');
        }
    };

    // Cotizaciones: Guardar (Agregar o Editar)
    const handleAddOrEditCotizacion = async (e) => {
        e.preventDefault();
        try {
            if (editingCotizacion) {
                const cotizacionRef = doc(db, "cotizaciones", currentCotizacionId);
                await updateDoc(cotizacionRef, cotizacion);
                setCotizaciones(cotizaciones.map((c) => (c.id === currentCotizacionId ? { ...cotizacion, id: currentCotizacionId } : c)));
                Swal.fire('Actualizado', 'La cotización ha sido actualizada correctamente', 'success');
            } else {
                const newCotizacionRef = await addDoc(collection(db, "cotizaciones"), cotizacion);
                setCotizaciones([...cotizaciones, { id: newCotizacionRef.id, ...cotizacion }]);
                Swal.fire('Agregado', 'La cotización ha sido agregada correctamente', 'success');
            }
        } catch (error) {
            Swal.fire('Error', 'Error al guardar la cotización', 'error');
        }
        setShowCotizacionModal(false);
        setCotizacion({ fecha: "", taller: "", tipoMantencion: "", detalle: "" });
        setEditingCotizacion(false);
        setCurrentCotizacionId(null);
    };

    // Cotizaciones: Abrir modal para ver y editar cotización
    const handleViewCotizacion = (cotizacionToView) => {
        setCotizacion(cotizacionToView);
        setCurrentCotizacionId(cotizacionToView.id);
        setEditingCotizacion(true);
        setShowCotizacionModal(true);
    };

    // Cotizaciones: Eliminar
    const handleDeleteCotizacion = async (cotizacionId) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esta acción",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminarla'
            });

            if (result.isConfirmed) {
                await deleteDoc(doc(db, "cotizaciones", cotizacionId));
                setCotizaciones(cotizaciones.filter((c) => c.id !== cotizacionId));
                Swal.fire('Eliminado', 'La cotización ha sido eliminada', 'success');
            }
        } catch (error) {
            Swal.fire('Error', 'Error al eliminar la cotización', 'error');
        }
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
            <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                    <div className="flex flex-col md:flex-row md:space-x-8">
                        {/* Sección de Autos */}
                        <div className="w-full md:w-1/2 p-4 bg-white shadow-md rounded-lg flex flex-col justify-between mb-6 md:mb-0">
                            <div>
                                <h1 className="text-2xl font-bold mb-6">Mis Vehiculos</h1>

                                {/* Listado de autos */}
                                <ul className="mb-6">
                                    {autos.map((auto) => (
                                        <li key={auto.id} className="flex justify-between items-center mb-4">
                                            <span>{auto.marca} {auto.modelo} ({auto.year})</span>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => handleViewAuto(auto)}
                                                >
                                                    Ver
                                                </Button>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="bg-[#F59E0B] hover:bg-[#D97706] text-white"
                                                    onClick={() => handleDeleteAuto(auto.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Botón para agregar auto */}
                            <Button
                                variant="default"
                                size="md"
                                onClick={() => {
                                    setShowAutoModal(true);
                                    setEditingAuto(false);
                                    setAuto({ marca: "", modelo: "", year: "", patente: "", tipoMotor: "", color: "", taller: "", mecanico: "" });
                                }}
                                className="mb-6 w-full"
                            >
                                Agregar Vehículo
                            </Button>

                            {/* Modal para ver o editar auto */}
                            <Form show={showAutoModal} onClose={() => setShowAutoModal(false)}>
                                <h2 className="text-xl font-bold mb-4">{editingAuto ? "Editar Auto" : "Agregar Nuevo Auto"}</h2>
                                <form onSubmit={handleAddOrEditAuto}>
                                    <Input
                                        name="marca"
                                        value={auto.marca}
                                        onChange={(e) => setAuto({ ...auto, marca: e.target.value })}
                                        placeholder="Marca"
                                        className="mb-4"
                                    />
                                    <Input
                                        name="modelo"
                                        value={auto.modelo}
                                        onChange={(e) => setAuto({ ...auto, modelo: e.target.value })}
                                        placeholder="Modelo"
                                        className="mb-4"
                                    />
                                    <Input
                                        name="year"
                                        value={auto.year}
                                        onChange={(e) => setAuto({ ...auto, year: e.target.value })}
                                        placeholder="Año"
                                        className="mb-4"
                                    />
                                    <Input
                                        name="patente"
                                        value={auto.patente}
                                        onChange={(e) => setAuto({ ...auto, patente: e.target.value })}
                                        placeholder="Patente"
                                        className="mb-4"
                                    />
                                    <Input
                                        name="tipoMotor"
                                        value={auto.tipoMotor}
                                        onChange={(e) => setAuto({ ...auto, tipoMotor: e.target.value })}
                                        placeholder="Tipo de Motor"
                                        className="mb-4"
                                    />
                                    <Input
                                        name="color"
                                        value={auto.color}
                                        onChange={(e) => setAuto({ ...auto, color: e.target.value })}
                                        placeholder="Color"
                                        className="mb-4"
                                    />
                                    <div className="flex justify-between">
                                        <Button type="submit" className="bg-blue-500 text-white">
                                            {editingAuto ? "Guardar Cambios" : "Agregar Auto"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>

                        {/* Sección de Cotizaciones */}
                        <div className="w-full md:w-1/2 p-4 bg-white shadow-md rounded-lg flex flex-col justify-between">
                            <div>
                                <h1 className="text-2xl font-bold mb-6">Cotizaciones</h1>

                                {/* Listado de cotizaciones */}
                                <ul className="mb-6">
                                    {cotizaciones.map((cotizacion) => (
                                        <li key={cotizacion.id} className="flex justify-between items-center mb-4">
                                            <span>{cotizacion.fecha} - {cotizacion.taller} ({cotizacion.tipoMantencion})</span>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => handleViewCotizacion(cotizacion)}
                                                >
                                                    Ver
                                                </Button>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="bg-[#F59E0B] hover:bg-[#D97706] text-white"
                                                    onClick={() => handleDeleteCotizacion(cotizacion.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Botón para agregar cotización */}
                            <Button
                                variant="default"
                                size="md"
                                onClick={() => {
                                    setShowCotizacionModal(true);
                                    setEditingCotizacion(false);
                                    setCotizacion({ fecha: "", taller: "", tipoMantencion: "", detalle: "" });
                                }}
                                className="mb-6 w-full"
                            >
                                Solicitar Cotización
                            </Button>

                            {/* Modal para ver o editar cotización */}
                            <Form show={showCotizacionModal} onClose={() => setShowCotizacionModal(false)}>
                                <h2 className="text-xl font-bold mb-4">{editingCotizacion ? "Editar Cotización" : "Agregar Cotización"}</h2>
                                <form onSubmit={handleAddOrEditCotizacion}>
                                    <Input
                                        name="fecha"
                                        value={cotizacion.fecha}
                                        onChange={(e) => setCotizacion({ ...cotizacion, fecha: e.target.value })}
                                        placeholder="Fecha"
                                        className="mb-4"
                                        type="date"
                                    />
                                    <Input
                                        name="taller"
                                        value={cotizacion.taller}
                                        onChange={(e) => setCotizacion({ ...cotizacion, taller: e.target.value })}
                                        placeholder="Taller"
                                        className="mb-4"
                                    />
                                    <select
                                        name="tipoMantencion"
                                        value={cotizacion.tipoMantencion}
                                        onChange={(e) => setCotizacion({ ...cotizacion, tipoMantencion: e.target.value })}
                                        className="mb-4 w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Seleccionar tipo de mantenimiento</option>
                                        <option value="Mantenimiento General">Mantenimiento General</option>
                                        <option value="Cambio de Aceite">Cambio de Aceite</option>
                                        <option value="Revisión de Frenos">Revisión de Frenos</option>
                                        <option value="Alineación">Alineación</option>
                                    </select>
                                    <Input
                                        name="detalle"
                                        value={cotizacion.detalle}
                                        onChange={(e) => setCotizacion({ ...cotizacion, detalle: e.target.value })}
                                        placeholder="Detalle de la mantención"
                                        className="mb-4"
                                    />
                                    <div className="flex justify-between">
                                        <Button type="submit" className="bg-blue-500 text-white">{editingCotizacion ? "Guardar Cambios" : "Agregar Cotización"}</Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

