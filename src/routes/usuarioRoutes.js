// src/routes/usuarioRoutes.js

import express from "express";

import UsuarioController from "../controllers/UsuarioController.js";
import { asyncWrapper } from "../utils/helpers/index.js";

const router = express.Router();

const usuarioController = new UsuarioController();  // Instância da classe

router
  .post("/usuarios/", asyncWrapper(usuarioController.cadastrar.bind(usuarioController)))
  .get("/usuarios/", asyncWrapper(usuarioController.listar.bind(usuarioController)))
  .get("/usuarios/:id", asyncWrapper(usuarioController.listar.bind(usuarioController)))
  .patch("/usuarios/:id", asyncWrapper(usuarioController.alterar.bind(usuarioController)))
  .delete("/usuarios/:id", asyncWrapper(usuarioController.deletar.bind(usuarioController)))

export default router;