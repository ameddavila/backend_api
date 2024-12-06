import { DataTypes, Model, Sequelize } from "sequelize";

export default class RoleMenuModel extends Model {
  public roleId!: number;
  public menuId!: number;

  static initModel(sequelize: Sequelize): void {
    RoleMenuModel.init(
      {
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "Roles", // Nombre de la tabla de Roles
            key: "id", // Clave primaria de Roles
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        menuId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "Menus", // Nombre de la tabla de Menús
            key: "id", // Clave primaria de Menús
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      {
        sequelize,
        modelName: "RoleMenu",
        tableName: "RoleMenus",
        timestamps: false, // No se necesitan campos de tiempo para una tabla de relación
      }
    );
  }
}
