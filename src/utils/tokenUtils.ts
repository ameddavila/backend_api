import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

/**
 * Convierte una duración en texto (ej. "15m", "7d") a milisegundos.
 * @param duration - Duración en formato texto ("15m", "7d").
 * @returns Duración en milisegundos.
 */
export const parseDuration = (duration: string): number => {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Duración inválida: ${duration}`);

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000; // Segundos a milisegundos
    case "m":
      return value * 60 * 1000; // Minutos a milisegundos
    case "h":
      return value * 60 * 60 * 1000; // Horas a milisegundos
    case "d":
      return value * 24 * 60 * 60 * 1000; // Días a milisegundos
    default:
      throw new Error(`Unidad de duración no soportada: ${unit}`);
  }
};

/**
 * Genera un Access Token.
 * @param userId - ID del usuario.
 * @returns Access Token (JWT).
 */
export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m",
  });
};

/**
 * Genera un Refresh Token.
 * @param userId - ID del usuario.
 * @returns Refresh Token (JWT).
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION || "7d",
  });
};

/**
 * Genera un CSRF Token basado en el ID del usuario.
 * @param userId - ID del usuario.
 * @returns CSRF Token.
 */
export const generateCsrfToken = (userId: string): string => {
  const csrfData = `${userId}-${crypto.randomBytes(16).toString("hex")}`;
  return crypto.createHash("sha256").update(csrfData).digest("hex");
};
