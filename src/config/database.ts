import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { initializeRelationships } from "@modules/users/models/relationships";
import * as Models from "@modules/users/models";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string, 10) || 1433,
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: false,
      instanceName: process.env.DB_INSTANCE,
      timezone: "Z",
    },
  },
  logging: false,
  timezone: "America/La_Paz",
});

// Inicializar modelos
console.log("Inicializando modelos...");
Object.values(Models).forEach((model: any) => {
  if (typeof model.initModel === "function") {
    model.initModel(sequelize); // Llama al método estático initModel de cada modelo
  }
});
console.log("Modelos inicializados.");

// Configurar relaciones
initializeRelationships();

export default sequelize;

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos exitosa.");
  } catch (error) {
    console.error("Error conectando a la base de datos:", error);
    throw error;
  }
};

export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log(
      `Base de datos sincronizada correctamente. Force: ${force ? "Sí" : "No"}`
    );
  } catch (error) {
    console.error("Error sincronizando la base de datos:", error);
    throw error;
  }
};
