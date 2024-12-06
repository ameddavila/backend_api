import { Router } from "express";
import { sendTestEmail } from "../controllers/emailController"; // Asegúrate de que esta importación sea correcta

const router = Router();

router.post("/send-test", sendTestEmail); // Define la ruta POST para /send-test

export default router;
