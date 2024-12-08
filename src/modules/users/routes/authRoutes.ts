import { Router } from "express";
import { validateLogin } from "@middlewares/validateLoginMiddleware";
import { login, logout } from "../controllers/authController";
import { csrfMiddleware } from "@middlewares/csrfMiddleware";

const router = Router();

// Rutas de autenticación
router.post("/login", csrfMiddleware, validateLogin, login);
router.post("/logout", csrfMiddleware, logout);

export default router;
