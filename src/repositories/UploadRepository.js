// src/repositories/UploadRepository.js

import EventoModel from "../models/Evento.js";
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class UploadRepository { 
    constructor({
        eventoModel = EventoModel,
    } = {}) {
        this.model = eventoModel;
    }

    async adicionarMidia(eventoId, tipo, midia) {
        const tipoCampo = {
            capa: 'midiaCapa',
            carrossel: 'midiaCarrossel',
            video: 'midiaVideo',
        }[tipo];

        if(!tipoCampo) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST,
                errorType: 'invalidField',
                field: 'tipo',
                customMessage: `Tipo de mídia '${tipo}' não é permitido.`
            });
        }

        const evento = await this.model.findById(eventoId);

        if(!evento) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND,
                errorType: 'notFound',
                field: 'Evento',
                customMessage: messages.error.resourceNotFound('Evento')
            });
        }

        evento[tipoCampo].push(midia);
        await evento.save();

        return midia;
    }
    
}

export default UploadRepository;