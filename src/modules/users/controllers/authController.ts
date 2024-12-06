import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "@modules/users/models"; // Asegúrate de que el archivo exista y el modelo esté exportado correctamente
import {
  generateAccessToken,
  generateRefreshToken,
  generateCsrfToken, // Verifica que esta función exista en el archivo de rutas
  parseDuration, // Verifica que esta función exista en el archivo de rutas
} from "@utils/tokenUtils"; // Cambié "../routes" a "../utils/tokenUtils" para mayor claridad
import dotenv from "dotenv";

dotenv.config();

/**
 * Login del usuario.
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("[authController Login] Iniciando proceso de login...");
    console.log("[authController Login] Cuerpo de la solicitud:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      console.error("[authController Login] Falta username o password.");
      res.status(400).json({
        error: "El nombre de usuario y la contraseña son obligatorios.",
      });
      return;
    }

    // Busca al usuario en la base de datos
    const user = await UserModel.findOne({ where: { username } });
    if (!user) {
      console.error("[authController Login] Usuario no encontrado.");
      res.status(404).json({ error: "Usuario no encontrado." });
      return;
    }

    // Verifica la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("[authController Login] Contraseña incorrecta.");
      res.status(401).json({ error: "Contraseña incorrecta." });
      return;
    }

    // Genera tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Generar nuevo token CSRF protegido
    const csrfToken = req.csrfToken(); // Asegúrate de que el middleware csrfProtection se haya ejecutado.

    // Configura las cookies
    console.log("[authController Login] Configurando cookies...");
    setCookie(res, "access_token", accessToken, {
      maxAge: parseDuration(process.env.JWT_ACCESS_EXPIRATION || "15m"),
    });
    setCookie(res, "refresh_token", refreshToken, {
      maxAge: parseDuration(process.env.JWT_REFRESH_EXPIRATION || "7d"),
    });
    setCookie(res, "_csrf", csrfToken, {});

    console.log("[authController Login] Login exitoso.");
    res.status(200).json({ message: "Login exitoso.", csrfToken });
  } catch (error) {
    console.error("[authController Login] Error durante el login:", error);
    next(error);
  }
};

// Función auxiliar para configurar cookies
const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: any
) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    ...options,
  });
};

/**
 * Logout del usuario.
 */
export const logout = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Limpia las cookies
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.clearCookie("_csrf");
    res.status(200).json({ message: "Logout exitoso." });
  } catch (error) {
    next(error);
  }
};
