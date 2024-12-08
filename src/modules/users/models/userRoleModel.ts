import { DataTypes, Model, Sequelize } from "sequelize";

export default class UserRoleModel extends Model {
  public userId!: string;
  public roleId!: number;

  static initModel(sequelize: Sequelize): void {
    UserRoleModel.init(
      {
        userId: {
          type: DataTypes.UUID,
          primaryKey: true,
          references: {
            model: "Users", // Nombre de la tabla Users
            key: "id", // Clave primaria de la tabla Users
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        roleId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: {
            model: "Roles", // Nombre de la tabla Roles
            key: "id", // Clave primaria de la tabla Roles
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      {
        sequelize,
        modelName: "UserRole",
        tableName: "UserRoles",
        timestamps: false, // No se incluyen campos de tiempo
      }
    );
  }
}
