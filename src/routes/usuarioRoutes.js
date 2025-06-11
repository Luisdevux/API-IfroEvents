// src/routes/usuarioRoutes.js

import express from "express";

import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import authPermission from "../middlewares/AuthPermission.js";
import UsuarioController from "../controllers/UsuarioController.js";
import { asyncWrapper } from "../utils/helpers/index.js";

const router = express.Router();

const usuarioController = new UsuarioController();  // Instância da classe

router
  .post("/usuarios/", asyncWrapper(usuarioController.cadastrar.bind(usuarioController)))
  .get("/usuarios/", AuthMiddleware, authPermission, asyncWrapper(usuarioController.listar.bind(usuarioController)))
  .get("/usuarios/:id", AuthMiddleware, authPermission, asyncWrapper(usuarioController.listar.bind(usuarioController)))
  .patch("/usuarios/:id", AuthMiddleware, authPermission, asyncWrapper(usuarioController.alterar.bind(usuarioController)))
  .delete("/usuarios/:id", AuthMiddleware, authPermission, asyncWrapper(usuarioController.deletar.bind(usuarioController)))

export default router;