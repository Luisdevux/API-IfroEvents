// src/repositories/UploadRepository.js

import EventoModel from "../models/Evento.js";
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class UploadRepository { 
    constructor({
        eventoModel = EventoModel,
    } = {}) {
        this.model = eventoModel;
    }

    // POST /eventos/:id/midia/:tipo
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

    // GET /eventos/:id/midias
    async listarTodasMidias(eventoId) {
        const evento = await this.model.findById(eventoId).select('midiaCapa midiaCarrossel midiaVideo');

        if(!evento) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND,
                errorType: 'notFound',
                field: 'Evento',
                customMessage: messages.error.resourceNotFound('Evento')
            });
        }

        return evento;
    }

    // GET /eventos/:id/midia/capa
    async listarMidiaCapa(eventoId) {
        const evento = await this.model.findById(eventoId).select('midiaCapa');

        if(!evento) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND,
                errorType: 'notFound',
                field: 'Evento',
                customMessage: messages.error.resourceNotFound('Evento')
            });
        }

        return evento;
    }

    // GET /eventos/:id/midia/video
    async listarMidiaVideo(eventoId) {
        const evento = await this.model.findById(eventoId).select('midiaVideo');

        if(!evento) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND,
                errorType: 'notFound',
                field: 'Evento',
                customMessage: messages.error.resourceNotFound('Evento')
            });
        }
        
        return evento;
    }

    // GET /eventos/:id/midia/carrossel
    async listarMidiaCarrossel(eventoId) {
        const evento = await this.model.findById(eventoId).select('midiaCarrossel');

        if(!evento) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND,
                errorType: 'notFound',
                field: 'Evento',
                customMessage: messages.error.resourceNotFound('Evento')
            });
        }
        
        return evento;
    }

    //DELETE /eventos/:id/midia/:tipo/:id
    async deletarMidia(eventoId, tipo, midiaId) {
        const tipoCampo = {
            capa: 'midiaCapa',
            video: 'midiaVideo',
            carrossel: 'midiaCarrossel'
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

        const midias = evento[tipoCampo];
        const midiaIndex = midias.findIndex(m => m._id.toString() === midiaId);

        if(midiaIndex === -1) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND,
                errorType: 'notFound',
                field: 'Mídia',
                customMessage: messages.error.resourceNotFound('Mídia')
            });
        }

        const midiaRemovida = midias[midiaIndex];

        if(midiaRemovida.url && fs.existsSync(`.${midiaRemovida.url}`)) {
            fs.unlinkSync(`.${midiaRemovida.url}`);
        }

        midias.splice(midiaIndex, 1);
        await evento.save();

        return midiaRemovida;
    }
}

export default UploadRepository;