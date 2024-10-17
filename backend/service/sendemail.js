const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function enviarCorreoAdmin(req, res) {
  // Verifica si el cuerpo de la solicitud contiene los valores esperados
  const { correoAdmin, nombreMarca, adminId } = req.body;

  if (!correoAdmin || !nombreMarca || !adminId) {
    return res.status(400).json({ message: 'Faltan datos en la solicitud' });
  }

  const link = `${process.env.FRONTEND_URL}/complete-admin-info/${adminId}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: correoAdmin,
    subject: 'Completa la información de tu cuenta de administrador',
    html: `
      <h2>Hola, has sido registrado como administrador de ${nombreMarca}</h2>
      <p>Por favor, completa el resto de tu información en el siguiente enlace:</p>
      <a href="${link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">
        Completar Información
      </a>
      <p>Si no has solicitado esta cuenta, ignora este mensaje.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: %s', info.messageId);
    res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error enviando correo:', error);
    res.status(500).json({ message: 'Error enviando correo', error: error.message });
  }
}

module.exports = enviarCorreoAdmin;
