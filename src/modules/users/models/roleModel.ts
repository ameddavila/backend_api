import { DataTypes, Model, Sequelize } from "sequelize";

/**
 * Modelo para la tabla Roles
 */
export default class RoleModel extends Model {
  public id!: number; // Identificador único del rol
  public name!: string; // Nombre del rol
  public description?: string | null; // Descripción del rol (opcional)

  /**
   * Método estático para inicializar el modelo
   */
  static initModel(sequelize: Sequelize): void {
    RoleModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.STRING(255),
          allowNull: true, // Se indica que es opcional
        },
      },
      {
        sequelize,
        modelName: "Role", // Nombre del modelo
        tableName: "Roles", // Nombre de la tabla en la base de datos
        timestamps: true, // Incluye createdAt y updatedAt
      }
    );
  }
}
