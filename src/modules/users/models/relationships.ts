import {
  RoleModel,
  PermissionModel,
  RolePermissionModel,
  UserModel,
  UserRoleModel,
  MenuModel,
  RoleMenuModel,
} from "./index";

export const initializeRelationships = (): void => {
  console.log("Inicializando relaciones entre modelos...");

  // ================================
  // Relación entre Roles y Usuarios
  // ================================
  RoleModel.hasMany(UserModel, {
    foreignKey: "roleId",
    as: "users", // Este alias causa conflicto si se reutiliza
  });
  UserModel.belongsTo(RoleModel, {
    foreignKey: "roleId",
    as: "role",
  });

  // ================================
  // Relación entre Usuarios y Roles (N:N)
  // ================================
  UserRoleModel.belongsTo(UserModel, {
    foreignKey: "userId",
    as: "user",
  });
  UserRoleModel.belongsTo(RoleModel, {
    foreignKey: "roleId",
    as: "role",
  });
  UserModel.hasMany(UserRoleModel, {
    foreignKey: "userId",
    as: "userRoles",
  });
  RoleModel.hasMany(UserRoleModel, {
    foreignKey: "roleId",
    as: "roleUsers", // Cambié el alias aquí para evitar conflictos
  });

  // ================================
  // Relación entre Roles y Menús (N:N)
  // ================================
  RoleMenuModel.belongsTo(RoleModel, {
    foreignKey: "roleId",
    as: "role",
  });
  RoleMenuModel.belongsTo(MenuModel, {
    foreignKey: "menuId",
    as: "menu",
  });
  RoleModel.hasMany(RoleMenuModel, {
    foreignKey: "roleId",
    as: "roleMenus",
  });
  MenuModel.hasMany(RoleMenuModel, {
    foreignKey: "menuId",
    as: "menuRoles",
  });

  // ================================
  // Relación entre Roles y Permisos (N:N)
  // ================================
  RolePermissionModel.belongsTo(RoleModel, {
    foreignKey: "roleId",
    as: "role",
  });
  RolePermissionModel.belongsTo(PermissionModel, {
    foreignKey: "permissionId",
    as: "permission",
  });
  RoleModel.hasMany(RolePermissionModel, {
    foreignKey: "roleId",
    as: "rolePermissions",
  });
  PermissionModel.hasMany(RolePermissionModel, {
    foreignKey: "permissionId",
    as: "permissionRoles",
  });

  console.log("Relaciones entre modelos inicializadas.");
};
