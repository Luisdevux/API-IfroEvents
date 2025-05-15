// src/repositories/EventoRepository.js

import UsuarioModel from '../models/Usuario.js';
import EventoModel from '../models/Evento.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class EventoRepository {
    constructor({
        eventoModel = EventoModel,
        usuarioModel = UsuarioModel
    } = {}) {
        this.model = eventoModel;
        this.usuarioModel = usuarioModel;
    }

    // POST /eventos
    async cadastrar(dadosEventos) {
        const evento = new this.model(dadosEventos);
        return await evento.save();
    }

    // GET /eventos
    async listar(req) {
        console.log('Estou no listar em UsuarioRepository...');
        const data = await this.model.find();
        return data;
    }

    // GET /eventos/:id
    async listarPorId(id) {
        console.log('Estou no listar por ID em UsuarioRepository...', id);
        const data = await this.model.findById(id);

        if (!data) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Evento',
                details: [],
                customMessage: messages.error.resourceNotFound('Evento')
            });
        }

        return data;
    }
}

export default EventoRepository;