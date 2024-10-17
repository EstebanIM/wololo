const express = require('express');
const cors = require('cors');
const enviarCorreoAdmin = require('./service/sendemail'); // Importa tu función de enviar correo
const app = express();

// Configurar CORS para permitir solicitudes desde tu frontend (localhost:3000)
app.use(cors({
  origin: 'http://localhost:3001', // Permitir el origen del frontend
  methods: 'GET,POST,PUT,DELETE',  // Métodos permitidos
  credentials: true                // Si deseas enviar cookies o credenciales
}));

// Resto de tu configuración del servidor
app.use(express.json());

// Tus rutas
app.post('/send-email', enviarCorreoAdmin); // Usa la función enviarCorreoAdmin para esta ruta

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
