import { DataTypes, Model, Sequelize } from "sequelize";

export default class UserModel extends Model {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public phone?: string;
  public isActive!: boolean;
  public profileImage?: string;
  public passwordResetToken?: string;
  public passwordResetExpires?: Date;

  static initModel(sequelize: Sequelize): void {
    UserModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        firstName: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING(20),
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        profileImage: {
          type: DataTypes.STRING(255),
        },
        passwordResetToken: {
          type: DataTypes.STRING(255),
        },
        passwordResetExpires: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "Users",
        timestamps: true, // Incluye createdAt y updatedAt
      }
    );
  }
}
