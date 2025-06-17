// src/repositories/EventoRepository.js

import UsuarioModel from '../models/Usuario.js';
import EventoModel from '../models/Evento.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import { populate } from 'dotenv';

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
        return await this.model.create(dadosEventos);
    }

    // POST /eventos/:id/compartilhar
    async compartilharPermissao(eventoId, permissao) {
        return this.model.findByIdAndUpdate(
            eventoId,
            { $push: { permissoes: permissao} },
            { new: true }
        );
    }

    // GET /eventos
    async listar() {
        const data = await this.model.find();
        return data;
    }

    // GET /eventos/:id
    async listarPorId(id) {
        const data = await this.model.findById(id);

        if (!data) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'resourceNotFound',
                field: 'Evento',
                details: [],
                customMessage: messages.error.resourceNotFound('Evento')
            });
        }

        return data;
    }

    // GET /eventos/eventosPermitidos
    async listarEventosPermitidos(usuarioId) {
        const dataAtual = new Date();
        return this.model.find({
            $or: [
                { 'organizador._id': usuarioId },
                {
                    permissoes: {
                        $elemMatch: {
                            usuario: usuarioId,
                            expiraEm: { $gt: dataAtual }
                        }
                    }
                }
            ]
        });
    }

    // PATCH /eventos/:id
    async alterar(id, parsedData) {
        const evento = await this.model.findByIdAndUpdate(id, parsedData, { new: true })
        
        if(!evento) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'resourceNotFound',
                field: 'Evento',
                details: [],
                customMessage: messages.error.resourceNotFound('Evento')
            });
        }
        return evento;
    }

    // PATCH /eventos/:id
    async alterarStatus(id, status) {
        const evento = await this.model.findByIdAndUpdate(id, { status }, { new: true })

        if(!evento) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'resourceNotFound',
                field: 'Evento',
                details: [],
                customMessage: messages.error.resourceNotFound('Evento')
            });
        }
        return evento;
    }

    // DELETE /eventos/:id
    async deletar(id) {
        const evento = await this.model.findByIdAndDelete(id);
        return evento;
    }
}

export default EventoRepository;