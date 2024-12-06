import { Router } from "express";
import {
  requestPasswordReset,
  resetPassword,
} from "../controllers/passwordController";

const router = Router();

router.post("/request-reset", requestPasswordReset); // Solicitar recuperación de contraseña
router.post("/reset", resetPassword); // Restablecer contraseña

export default router;
