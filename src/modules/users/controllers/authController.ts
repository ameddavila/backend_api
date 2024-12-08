import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "@modules/users/models"; // Verifica que el modelo esté correctamente definido
import {
  generateAccessToken,
  generateRefreshToken,
  parseDuration,
} from "@utils/tokenUtils"; // Asegúrate de que estas funciones estén implementadas
import dotenv from "dotenv";

dotenv.config();

/**
 * Inicia sesión con el usuario proporcionado.
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("[authController Login] Iniciando proceso de login...");

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

    // Genera un token CSRF
    const csrfToken = req.csrfToken?.(); // Asegúrate de que el middleware CSRF se esté aplicando correctamente.

    // Configura las cookies de autenticación y CSRF
    console.log("[authController Login] Configurando cookies...");
    setCookie(res, "access_token", accessToken, {
      maxAge: parseDuration(process.env.JWT_ACCESS_EXPIRATION || "15m"),
    });
    setCookie(res, "refresh_token", refreshToken, {
      maxAge: parseDuration(process.env.JWT_REFRESH_EXPIRATION || "7d"),
    });
    if (csrfToken) {
      setCookie(res, "_csrf", csrfToken, {});
    }

    console.log("[authController Login] Login exitoso.");
    res.status(200).json({ message: "Login exitoso.", csrfToken });
  } catch (error) {
    console.error("[authController Login] Error durante el login:", error);
    next(error);
  }
};

/**
 * Cierra sesión del usuario.
 */
export const logout = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    console.log("[authController Logout] Cerrando sesión...");
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.clearCookie("_csrf");
    res.status(200).json({ message: "Logout exitoso." });
  } catch (error) {
    console.error("[authController Logout] Error durante el logout:", error);
    next(error);
  }
};

/**
 * Función auxiliar para configurar cookies.
 */
const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: Record<string, unknown>
) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    ...options,
  });
};
