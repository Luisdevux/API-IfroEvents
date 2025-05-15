// src/routes/eventoRoutes.js

import express from "express";

import EventoController from '../controllers/EventoController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const eventoController = new EventoController();  // Instância da classe

router
    .get("/eventos/", asyncWrapper(eventoController.listar.bind(eventoController)))
    .get("/eventos/:id", asyncWrapper(eventoController.listar.bind(eventoController)))

export default router;