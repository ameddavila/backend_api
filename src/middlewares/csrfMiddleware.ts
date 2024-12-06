import { Request, Response, NextFunction } from "express";

export const csrfMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(
    `[csrfMiddleware] Procesando solicitud: ${req.method} ${req.path}`
  );
  console.log(`[csrfMiddleware] Cookies recibidas:`, req.cookies);

  if (req.path === "/api/csrf-token") {
    console.log("[csrfMiddleware] Generando token público para /csrf-token");

    const existingCsrfToken = req.cookies._csrf;

    if (existingCsrfToken) {
      console.log(
        "[csrfMiddleware] Usando token público existente:",
        existingCsrfToken
      );

      // Envía el token existente al cliente
      res.status(200).json({ csrfToken: existingCsrfToken });
    } else {
      try {
        const csrfToken = req.csrfToken();

        // Genera un nuevo token y lo guarda en las cookies
        res.cookie("_csrf", csrfToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        console.log("[csrfMiddleware] Token público generado:", csrfToken);

        // Envía el nuevo token al cliente
        res.status(200).json({ csrfToken });
      } catch (error) {
        console.error("[csrfMiddleware] Error generando token público:", error);
        res.status(500).json({ error: "Error generando token público" });
      }
    }
  } else {
    // Continúa con el próximo middleware o controlador
    next();
  }
};
