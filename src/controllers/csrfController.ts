import { Request, Response } from "express";

export const generateOrVerifyCsrfToken = (
  req: Request,
  res: Response
): void => {
  try {
    let csrfToken = req.cookies._csrf;
    if (!csrfToken) {
      csrfToken = req.csrfToken!(); // Utiliza la propiedad csrfToken extendida
      res.cookie("_csrf", csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      console.log(`[csrfController] Token CSRF generado: ${csrfToken}`);
    } else {
      console.log(`[csrfController] Token CSRF ya existe: ${csrfToken}`);
    }
    res.status(200).json({ csrfToken });
  } catch (error) {
    console.error(
      `[csrfController] Error generando/verificando token CSRF:`,
      error
    );
    res.status(500).json({ error: "Error generando/verificando token CSRF" });
  }
};
