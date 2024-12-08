import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { csrfProtection } from "@config/csrfConfig";
import router from "./routes";
import { csrfMiddleware } from "./middlewares/csrfMiddleware";
import { errorHandler } from "./middlewares/errorMiddleware";

const app = express();

// Configuración de seguridad con Helmet
app.use(helmet());

// Configuración de CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "X-CSRF-Token"],
  })
);

// Middleware para cookies y JSON
app.use(cookieParser());
app.use(express.json());

// Middleware para protección CSRF
app.use(csrfProtection); // Este middleware debe estar antes de csrfMiddleware
app.use(csrfMiddleware); // Manejo de rutas públicas y protegidas

// Configuración de rutas globales
app.use("/api", router);

// Manejo de errores global
app.use(errorHandler);

export default app;
