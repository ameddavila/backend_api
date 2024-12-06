import { Router, Request, Response, NextFunction } from "express";
import { csrfProtection } from "@config/csrfConfig";
import userModuleRoutes from "../modules/users/routes"; // Importa el índice del módulo users
import { generatePublicCsrfToken } from "../controllers/csrfController";

const router = Router();

// Endpoint para generar el token público CSRF
router.get("/csrf-token", (req: Request, res: Response) => {
  console.log(`[Route /csrf-token] Generando o verificando token CSRF.`);
  try {
    if (!req.cookies._csrf) {
      const csrfToken = req.csrfToken();
      res.cookie("_csrf", csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      console.log(`[Route /csrf-token] Token CSRF generado: ${csrfToken}`);
    } else {
      console.log(
        `[Route /csrf-token] Token CSRF ya existe: ${req.cookies._csrf}`
      );
    }
    res.status(200).json({ csrfToken: req.cookies._csrf || "Token asignado" });
  } catch (error) {
    console.error(
      `[Route /csrf-token] Error generando/verificando token CSRF:`,
      error
    );
    res.status(500).json({ error: "Error generando/verificando token CSRF" });
  }
});

// Middleware global para registrar solicitudes
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    `[Routes Index] Solicitud recibida en: ${req.method} ${req.path}`
  );
  next();
});

// Rutas del módulo de usuarios
router.use(
  "/users",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(
      `[Routes Index] Pasando al módulo users: ${req.method} ${req.path}`
    );
    next();
  },
  userModuleRoutes
);

// Ruta de prueba
router.get("/test", (req: Request, res: Response) => {
  console.log(`[Test Route] GET /test`);
  res.status(200).json({ message: "Ruta de prueba funcionando" });
});

export default router;
