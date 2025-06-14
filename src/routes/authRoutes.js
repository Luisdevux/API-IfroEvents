import express from "express";
import AuthController from '../controllers/AuthController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const authController = new AuthController();

router  
  .post("/login", asyncWrapper(authController.login.bind(authController)))
  .post("/logout", asyncWrapper(authController.logout.bind(authController)))
  .post("/refresh", asyncWrapper(authController.refresh.bind(authController)))
  .post("/recover", asyncWrapper(authController.recuperaSenha.bind(authController)))
  .patch("/password/reset/token", asyncWrapper(authController.atualizarSenhaToken.bind(authController)))

export default router;