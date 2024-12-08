import { Request, Response } from "express";
import crypto from "crypto"; // Para generar el token único
import { UserModel } from "../models";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { sendEmail } from "@services/emailService"; // Servicio para enviar correos

// Función para generar un token de 10 caracteres
const generateToken = (length: number = 10): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

// ================================
// Solicitar Restablecimiento de Contraseña
// ================================
export const requestPasswordReset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    // Verificar si el usuario existe
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado." });
      return;
    }

    // Generar el token y su hash
    const resetToken = generateToken(10); // Generar un token de 10 caracteres
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Actualizar el usuario con el token y la fecha de expiración
    await user.update({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: new Date(Date.now() + 3600000), // 1 hora
    });

    // Enviar el correo de recuperación
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail(
      email,
      "Restablecimiento de Contraseña",
      `Hola, hemos recibido una solicitud para restablecer tu contraseña. Puedes hacerlo desde el siguiente enlace: ${resetUrl}`,
      `<p>Hola,</p>
      <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el enlace de abajo para restablecerla:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Si no solicitaste este cambio, ignora este mensaje.</p>`
    );

    res.status(200).json({ message: "Correo de recuperación enviado." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error al generar el token de recuperación." });
  }
};

// ================================
// Restablecer Contraseña
// ================================
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    // Verificar el token
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await UserModel.findOne({
      where: {
        passwordResetToken: resetTokenHash,
        passwordResetExpires: { [Op.gt]: new Date() }, // Token no expirado
      },
    });

    if (!user) {
      res.status(400).json({ error: "Token inválido o expirado." });
      return;
    }

    // Actualizar la contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    res.status(200).json({ message: "Contraseña restablecida correctamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al restablecer la contraseña." });
  }
};
