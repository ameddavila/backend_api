import { Request, Response, NextFunction } from "express";
import csrf from "csurf";

export const csrfProtection = csrf({ cookie: true });

export const generateOrVerifyCsrfToken = (
  req: Request,
  res: Response
): void => {
  try {
    let csrfToken = req.cookies._csrf;
    if (!csrfToken && req.csrfToken) {
      csrfToken = req.csrfToken(); // Genera un nuevo token si no existe
      res.cookie("_csrf", csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      console.log(`[csrfConfig] Token CSRF generado: ${csrfToken}`);
    } else {
      console.log(`[csrfConfig] Token CSRF ya existe: ${csrfToken}`);
    }
    res.status(200).json({ csrfToken });
  } catch (error) {
    console.error(
      `[csrfConfig] Error generando/verificando token CSRF:`,
      error
    );
    res.status(500).json({ error: "Error generando/verificando token CSRF" });
  }
};
