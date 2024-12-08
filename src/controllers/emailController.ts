import { Request, Response } from "express";
import { sendEmail } from "../services/emailService"; // Importa el servicio de envío de correos

export const sendTestEmail = async (req: Request, res: Response) => {
  const { email } = req.body; // Verifica que estás enviando el campo "email" en el body

  try {
    await sendEmail(
      email,
      "Correo de Prueba",
      "Este es un correo de prueba enviado desde Nodemailer.",
      "<p>Este es un <strong>correo de prueba</strong> enviado desde Nodemailer.</p>"
    );
    res.status(200).json({ message: "Correo enviado exitosamente." });
  } catch (error) {
    res.status(500).json({ error: "No se pudo enviar el correo." });
  }
};
