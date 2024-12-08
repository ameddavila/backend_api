import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";

  // Incluir el stack trace solo en desarrollo
  const stack = process.env.NODE_ENV === "development" ? err.stack : undefined;

  res.status(status).json({
    error: message,
    ...(stack && { stack }),
  });
};
