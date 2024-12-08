import { DataTypes, Model, Sequelize } from "sequelize";

export default class PermissionModel extends Model {
  public id!: number;
  public module!: string;
  public action!: string;
  public roleId!: number;

  static initModel(sequelize: Sequelize): void {
    PermissionModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        module: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        action: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Permission",
        tableName: "Permissions",
        timestamps: true,
      }
    );
  }
}
