import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { UserModel } from "../models";

// ================================
// Crear un Usuario
// ================================
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password, firstName, lastName, phone, isActive } =
    req.body;

  try {
    // Validar que el username y email sean únicos
    const existingUser = await UserModel.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      res.status(400).json({ error: "El username o email ya está en uso." });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      isActive,
    });

    res
      .status(201)
      .json({ message: "Usuario creado exitosamente", user: newUser });
  } catch (err) {
    next(err);
  }
};

// ================================
// Obtener Todos los Usuarios
// ================================
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await UserModel.findAll({
      attributes: { exclude: ["password"] }, // Excluir contraseñas
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// ================================
// Obtener un Usuario por ID
// ================================
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await UserModel.findByPk(id, {
      attributes: { exclude: ["password"] }, // Excluir contraseñas
    });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// ================================
// Actualizar un Usuario
// ================================
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { username, email, firstName, lastName, phone, isActive } = req.body;

  try {
    const user = await UserModel.findByPk(id);

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado." });
      return;
    }

    // Validar que el nuevo username y email sean únicos si han cambiado
    const existingUser = await UserModel.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
        id: { [Op.ne]: id }, // Excluir el usuario actual
      },
    });

    if (existingUser) {
      res.status(400).json({ error: "El username o email ya está en uso." });
      return;
    }

    // Actualizar usuario
    await user.update({
      username,
      email,
      firstName,
      lastName,
      phone,
      isActive,
    });

    res
      .status(200)
      .json({ message: "Usuario actualizado correctamente", user });
  } catch (err) {
    next(err);
  }
};

// ================================
// Eliminar un Usuario
// ================================
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await UserModel.findByPk(id);

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado." });
      return;
    }

    await user.destroy();
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    next(err);
  }
};
