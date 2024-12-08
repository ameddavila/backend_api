import { Router, Request, Response, NextFunction } from "express";
import userModuleRoutes from "../modules/users/routes"; // Índice del módulo users
import authRoutes from "@modules/users/routes/authRoutes";
import { generateOrVerifyCsrfToken } from "../controllers/csrfController"; // Importar controlador

const router = Router();

// Ruta para generar/verificar el token público CSRF
router.get("/csrf-token", generateOrVerifyCsrfToken);

// Middleware global para registrar solicitudes
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    `[Routes Index] Solicitud recibida en: ${req.method} ${req.path}`
  );
  next();
});

// Rutas específicas de autenticación
router.use("/users/auth", authRoutes);

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
