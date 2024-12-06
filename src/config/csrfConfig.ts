import csurf from "csurf";

export const csrfProtection = csurf({
  cookie: {
    key: "_csrf",
    httpOnly: true, // Evita acceso desde JavaScript
    secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
    sameSite: "lax", // Protege contra ataques CSRF entre sitios
  },
});
