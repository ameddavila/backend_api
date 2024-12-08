import { DataTypes, Model, Sequelize } from "sequelize";

export default class RolePermissionModel extends Model {
  public roleId!: number;
  public permissionId!: number;

  static initModel(sequelize: Sequelize): void {
    RolePermissionModel.init(
      {
        roleId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: {
            model: "Roles", // Nombre de la tabla de Roles
            key: "id", // Clave primaria de Roles
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        permissionId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: {
            model: "Permissions", // Nombre de la tabla de Permisos
            key: "id", // Clave primaria de Permisos
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      {
        sequelize,
        modelName: "RolePermission",
        tableName: "RolePermissions",
        timestamps: false, // No se necesitan createdAt y updatedAt para tablas de relación
      }
    );
  }
}
