// src/services/EventoService.js

import EventoRepository from "../repositories/EventoRepository.js";
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from "../utils/helpers/index.js";

class EventoService {
    constructor() {
        this.repository = new EventoRepository();
    }

    async listar(req) {
        console.log('Estou no listar em UsuarioService');
        const eventos = await this.repository.listar(req);
        console.log('Estou retornando os dados em UsuarioService');
        return eventos;
    }
}

export default EventoService;