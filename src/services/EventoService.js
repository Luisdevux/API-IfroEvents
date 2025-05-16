// src/services/EventoService.js

import EventoRepository from "../repositories/EventoRepository.js";
import objectIdSchema from "../utils/validators/schemas/zod/ObjectIdSchema.js";
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from "../utils/helpers/index.js";

class EventoService {
    constructor() {
        this.repository = new EventoRepository();
    }

    // POST /eventos
    async cadastrar(dadosEventos) {
        const data = await this.repository.cadastrar(dadosEventos);
        return data;
    }

    // GET /eventos && GET /eventos/:id
    async listar(req) {
        console.log('Estou no listar em UsuarioService...');

        if(typeof req === 'string') {
            objectIdSchema.parse(req);
            return await this.repository.listarPorId(req);
        }

        return await this.repository.listar();
    }

    async deletar(req) {
        
    }
}

export default EventoService;