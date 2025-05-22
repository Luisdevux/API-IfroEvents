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
        if(typeof req === 'string') {
            objectIdSchema.parse(req);
            return await this.repository.listarPorId(req);
        }

        return await this.repository.listar();
    }

    // PATCH /eventos/:id
    async alterar(id, parsedData) {
        await this.ensureEventExists(id);

        const data = await this.repository.alterar(id, parsedData);
        return data;
    }

    // DELETE /eventos/:id
    async deletar(id) {
        await this.ensureEventExists(id);
        
        const data = await this.repository.deletar(id);
        return data;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // MÉTODOS AUXILIARES
    ////////////////////////////////////////////////////////////////////////////////

    /**
     * Garante que o evento existe.
     */
    async ensureEventExists(id) {
        objectIdSchema.parse(id);
        const eventoExistente = await this.repository.listarPorId(id);
        if(!eventoExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Evento',
                details: [],
                customMessage: messages.error.resourceNotFound('Evento'),
            });
        }
        return eventoExistente;
    }
}

export default EventoService;