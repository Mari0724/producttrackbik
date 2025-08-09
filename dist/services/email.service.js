"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendTeamWelcomeEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendTeamWelcomeEmail = async (to, tempPassword, companyName) => {
    const mailOptions = {
        from: `"ProductTrack" <${process.env.EMAIL_USER}>`,
        to,
        subject: '¡Te han creado una cuenta en ProductTrack!',
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
        <h2 style="color: #800020;">¡Bienvenido a ProductTrack!</h2>
        <p>Tu empresa <strong>${companyName}</strong> ha creado una cuenta para ti.</p>
        <p>Estos son tus datos de acceso:</p>
        <ul>
          <li><strong>Correo:</strong> ${to}</li>
          <li><strong>Contraseña temporal:</strong> ${tempPassword}</li>
        </ul>
        <p>Por favor inicia sesión para completar tu perfil y comenzar a usar nuestros servicios.</p>
        <br />
        <a href="https://producttrack.com/login" style="background-color: #800020; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Iniciar sesión</a>
        <p style="font-size: 12px; color: gray; margin-top: 10px;">
            *Este enlace estará disponible cuando se despliegue la aplicación.
        </p>
        </div>
    `,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendTeamWelcomeEmail = sendTeamWelcomeEmail;
const sendPasswordResetEmail = async (to, token) => {
    const mailOptions = {
        from: `"ProductTrack" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Restablecimiento de contraseña - ProductTrack',
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
        <h2 style="color: #800020;">Solicitud de restablecimiento de contraseña</h2>
        <p>Hemos recibido una solicitud para restablecer tu contraseña en ProductTrack.</p>
        <p>Este es tu código para restablecerla:</p>
        <div style="font-size: 24px; font-weight: bold; color: #800020; margin: 20px 0;">${token}</div>
        <p>Este código estará activo por <strong>15 minutos</strong>. Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <br />
        <p style="font-size: 12px; color: gray;">No respondas a este correo. Este mensaje fue generado automáticamente.</p>
      </div>
    `,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
