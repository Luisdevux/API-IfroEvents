// src/repositories/UploadRepository.js

import path from "path";
import fs from "fs";
import EventoModel from "../models/Evento.js";
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class UploadRepository { 
    constructor({
        eventoModel = EventoModel,
    } = {}) {
        this.model = eventoModel;
    }

    // Método para garantir que evento existe
    async _ensureEventExists(eventoId) {
        const evento = await this.model.findById(eventoId);

        if(!evento) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'notFound',
                field: 'Evento',
                customMessage: messages.error.resourceNotFound('Evento')
            });
        }

        return evento;
    }

    // POST /eventos/:id/midia/:tipo
    async adicionarMidia(eventoId, tipo, midia) {
        const tipos = {
            capa: 'midiaCapa',
            carrossel: 'midiaCarrossel',
            video: 'midiaVideo',
        };

        const tipoCampo = tipos[tipo];

        if(!tipoCampo) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'invalidField',
                field: 'tipo',
                customMessage: `Tipo de mídia '${tipo}' não é permitido.`
            });
        }

        const evento = await this._ensureEventExists(eventoId);

        evento[tipoCampo].push(midia);
        await evento.save();

        return midia;
    }

    // GET /eventos/:id/midias
    async listarTodasMidias(eventoId) {
        const evento = await this._ensureEventExists(eventoId);
        return evento;
    }

    // GET /eventos/:id/midia/capa
    async listarMidiaCapa(eventoId) {
        const evento = await this._ensureEventExists(eventoId);
        return { midiaCapa: evento.midiaCapa };
    }    
    
    // GET /eventos/:id/midia/video
    async listarMidiaVideo(eventoId) {
        const evento = await this._ensureEventExists(eventoId);
        return { midiaVideo: evento.midiaVideo };
    }

    // GET /eventos/:id/midia/carrossel
    async listarMidiaCarrossel(eventoId) {
        const evento = await this._ensureEventExists(eventoId);
        return { midiaCarrossel: evento.midiaCarrossel };
    }

    //DELETE /eventos/:id/midia/:tipo/:id
    async deletarMidia(eventoId, tipo, midiaId) {
        const tipos = {
            capa: 'midiaCapa',
            carrossel: 'midiaCarrossel',
            video: 'midiaVideo',
        };

        const tipoCampo = tipos[tipo];

        if(!tipoCampo) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'invalidField',  
                field: 'tipo',
                customMessage: `Tipo de mídia '${tipo}' não é permitido.` 
            });
        }

        const evento = await this._ensureEventExists(eventoId);

        const midias = evento[tipoCampo];
        const midiaIndex = midias.findIndex(m => m._id.toString() === midiaId);

        if(midiaIndex === -1) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'notFound',
                field: 'Mídia',
                customMessage: messages.error.resourceNotFound('Mídia')
            });
        }

        const midiaRemovida = midias[midiaIndex];

        midias.splice(midiaIndex, 1);
        await evento.save();

        return midiaRemovida;
    }
}

export default UploadRepository;