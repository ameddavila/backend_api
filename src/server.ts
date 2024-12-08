import "module-alias/register";
import path from "path";
import https from "https";
import http from "http";
import fs from "fs";

import dotenv from "dotenv";
import app from "./app"; // Asegúrate de que este camino es correcto
import { testConnection, syncDatabase } from "./config/database";

dotenv.config();

const HTTPS_PORT = Number(process.env.HTTPS_PORT) || 443;
const HTTP_PORT = Number(process.env.HTTP_PORT) || 80;

// === Configuración de certificados para HTTPS ===
let httpsOptions;
try {
  httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, "certificates/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "certificates/cert.pem")),
  };
} catch (error) {
  console.error("Error al cargar los certificados SSL:", error);
  process.exit(1);
}

// === Servidor HTTP para redirigir a HTTPS ===
http
  .createServer((req, res) => {
    const host = req.headers.host?.split(":")[0]; // Obtener host sin puerto
    res.writeHead(301, { Location: `https://${host}:${HTTPS_PORT}${req.url}` });
    res.end();
  })
  .listen(HTTP_PORT, () => {
    console.log(`Redirigiendo HTTP a HTTPS en el puerto ${HTTP_PORT}`);
  });

// === Prueba de conexión a la base de datos y arranque del servidor HTTPS ===
(async () => {
  try {
    console.log("Probando conexión a la base de datos...");
    await testConnection();
    console.log("Conexión a la base de datos exitosa.");
    // Forzar la sincronización de la base de datos
    console.log("Sincronizando base de datos...");
    await syncDatabase(false); // El argumento `true` fuerza la sincronización
    console.log("Base de datos sincronizada correctamente.");

    https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
      console.log(`Servidor corriendo en https://localhost:${HTTPS_PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1); // Terminar el proceso si hay problemas
  }
})();
