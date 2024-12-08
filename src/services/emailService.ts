import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Aquí debería estar smtp.gmail.com o el servidor de tu proveedor
      port: parseInt(process.env.EMAIL_PORT || "587"), // Puerto 587 para STARTTLS
      secure: false, // true para puerto 465, false para otros
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente.");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo.");
  }
};
