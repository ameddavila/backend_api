import { Request, Response, NextFunction } from "express";

export const csrfMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (req.csrfToken) {
      const newToken = req.csrfToken(); // Genera un nuevo token si el middleware CSRF lo permite
      res.cookie("_csrf", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }
    next();
  } catch (error) {
    console.error("[csrfMiddleware] Error manejando CSRF:", error);
    res.status(500).json({ error: "Error manejando CSRF" });
  }
};
