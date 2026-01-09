/**
 * @module UserRoutes
 * @description API endpoints for User management.
 * * This router integrates generic CRUD logic with the User Model.
 * * ### Features:
 * - **GET `/`**: Retrieves users with pagination and regex search.
 * - **GET `/:id`**: Fetches a single user (validates existence and soft-delete status).
 * - **POST `/`**: Creates a new user (automatically assigns authorId if authenticated).
 * - **PATCH `/:id`**: Partial update with mass-assignment protection for sensitive fields.
 * - **DELETE `/:id`**: Executes a logical deletion (soft-delete) with audit tracking.
 * * @requires module:../controllers/general.controllers
 * @requires module:../models/User.model
 */

import { Router } from "express";
import User from "../models/User.model.js"
import {
  getAll,
  getById,
  createDoc,
  updateDoc,
  softDelete,
} from "../controllers/general.controllers.js";
const router = Router();

/**
 * Rutas para la gestión de Usuarios
 * Usamos los controladores genéricos pasando el modelo 'User'
 */

// Obtener todos los usuarios (incluye búsqueda parcial y paginación)
router.get("/", getAll(User));

// Obtener un usuario específico por ID
router.get("/:id", getById(User));

// Crear un nuevo usuario (Básico)
router.post("/", createDoc(User));

// Actualizar un usuario (Protegido contra Mass Assignment)
router.patch("/:id", updateDoc(User));

// Borrado lógico (Soft Delete)
router.delete("/:id", softDelete(User));

export default router;
