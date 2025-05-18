import express from "express";
import AuthController from "../controllers/AuthController.js";
import { asyncWrapper } from "../utils/helpers/index.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

const authController = new AuthController();

router
  .post("/auth/register", asyncWrapper(authController.register.bind(authController)))
  .post("/auth/login", asyncWrapper(authController.login.bind(authController)))
  .get("/auth/users", AuthMiddleware, asyncWrapper(authController.getUsers.bind(authController)))
  .get("/auth/users/:id", AuthMiddleware, asyncWrapper(authController.getUserById.bind(authController)))
  .patch("/auth/users/:id", AuthMiddleware, asyncWrapper(authController.updateUser.bind(authController)))
  .delete("/auth/users/:id", AuthMiddleware, asyncWrapper(authController.deleteUser.bind(authController)));

export default router;