// src/routes/eventoRoutes.js

import express from "express";
import upload from "../config/multerConfig.js";

import EventoController from '../controllers/EventoController.js';
import UploadController from "../controllers/UploadController.js";
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const eventoController = new EventoController();  // Instância da classe
const uploadController = new UploadController();  // Instância da classe

router
    .post("/eventos/", asyncWrapper(eventoController.cadastrar.bind(eventoController)))
    .get("/eventos/", asyncWrapper(eventoController.listar.bind(eventoController)))
    .get("/eventos/:id", asyncWrapper(eventoController.listar.bind(eventoController)))
    .patch("/eventos/:id", asyncWrapper(eventoController.alterar.bind(eventoController)))
    .delete("/eventos/:id", asyncWrapper(eventoController.deletar.bind(eventoController)))

    // Rotas Adicionais (Mídias)
    .post("/eventos/:id/midia/:tipo", upload.single('file'), asyncWrapper(uploadController.adicionarMidia.bind(uploadController)))
    .get("/eventos/:id/midias", asyncWrapper(uploadController.listarTodasMidias.bind(uploadController)))
    .get("/eventos/:id/midia/capa", asyncWrapper(uploadController.listarMidiaCapa.bind(uploadController)))
    .get("/eventos/:id/midia/video", asyncWrapper(uploadController.listarMidiaVideo.bind(uploadController)))
    .get("/eventos/:id/midia/carrossel", asyncWrapper(uploadController.listarMidiaCarrossel.bind(uploadController)))
    .delete("/eventos/:id/midia/:tipo/:id", asyncWrapper(uploadController.deletarMidia.bind(uploadController)))

export default router;