import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Esquema de validación para el login
const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "El nombre de usuario es obligatorio.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "La contraseña es obligatoria.",
  }),
});

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Responde con los mensajes de error en caso de validación fallida
    res.status(400).json({
      errors: error.details.map((err) => err.message),
    });
    return;
  }

  next(); // Continúa al siguiente middleware o controlador si no hay errores
};
