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

    async listar(req) {
        console.log('Estou no listar em UsuarioRepository');
        const id = req.params.id || null;

        if(id) {
            const data = await this.model.findById(id)
                .populate('usuarios');
            
            if(!data) {
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

        const data = await this.model.find();

        return data;
    }
}

export default EventoRepository;