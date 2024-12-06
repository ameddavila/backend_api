import { Request, Response } from "express";

/**
 * Genera y configura un token público en la cookie `_csrf`.
 */
export const generateCsrfToken = (req: Request, res: Response): void => {
  const csrfToken = req.csrfToken(); // Genera el token público
  console.log("[csrfUtils] Token público generado:", csrfToken);

  // Configuración de cookie `_csrf`
  res.cookie("_csrf", csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
    sameSite: "lax",
  });
  console.log("[csrfUtils] Cookie '_csrf' configurada correctamente.");
};
