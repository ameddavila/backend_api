import { Router } from "express";
import userRoutes from "@modules/users/routes/userRoutes"; // CRUD de usuarios
import passwordRoutes from "@modules/users/routes/passwordRoutes"; // Recuperación de contraseña
import authRoutes from "@modules/users/routes/authRoutes"; // Login y logout

const router = Router();

// Log global para todas las rutas del módulo users
router.use((req, res, next) => {
  console.log(
    `[Users Module] Solicitud recibida en: ${req.method} ${req.path}`
  );
  next();
});
router.use(
  "/auth",
  (req, res, next) => {
    console.log(`[Users Module - Auth] Acceso a: ${req.path}`);
    next();
  },
  authRoutes
);

router.use(
  "/password",
  (req, res, next) => {
    console.log(`[Users Module - Password] Acceso a: ${req.path}`);
    next();
  },
  passwordRoutes
);

router.use(
  "/users",
  (req, res, next) => {
    console.log(`[Users Module - Users] Acceso a: ${req.path}`);
    next();
  },
  userRoutes
);

export default router;
