import { Request, Response } from "express";

export const generatePublicCsrfToken = (req: Request, res: Response): void => {
  try {
    const csrfToken = req.csrfToken(); // Genera el token público
    res.cookie("_csrf", csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    console.log("[CSRF] Token público generado:", csrfToken);
    res.status(200).json({ csrfToken });
  } catch (error) {
    console.error("[CSRF] Error generando token público:", error);
    res.status(500).json({ error: "Error generando token público" });
  }
};
