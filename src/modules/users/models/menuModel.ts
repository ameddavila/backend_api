import { DataTypes, Model, Sequelize } from "sequelize";

export default class MenuModel extends Model {
  public id!: number;
  public name!: string;
  public path!: string;
  public icon?: string;
  public parentId?: number;
  public isActive!: boolean;
  public sortOrder!: number;

  static initModel(sequelize: Sequelize): void {
    MenuModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        path: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        icon: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        sortOrder: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: "Menu",
        tableName: "Menus",
        timestamps: true,
      }
    );
  }
}
