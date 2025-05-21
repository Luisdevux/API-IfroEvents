// src/services/UploadService.js

import mongoose from "mongoose";
import UploadRepository from "../repositories/UploadRepository.js";
import objectIdSchema from "../utils/validators/schemas/zod/ObjectIdSchema.js";
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import sharp from "sharp";
import fs from "fs";
import path from "path";

class UploadService {
    constructor() {
        this.repository = new UploadRepository();
    }

    // POST /eventos/:id/midia/:tipo
    async adicionarMidia(eventoId, tipo, file) {
        objectIdSchema.parse(eventoId);
        
        const filePath = path.resolve(`uploads/${tipo}/${file.filename}`);

        const metadata = await sharp(filePath).metadata();

        const alturaEsperada = tipo === 'carrossel' ? 768 : 720;
        const larguraEsperada = tipo === 'carrossel' ? 1024 : 1280;

        if(metadata.height !== alturaEsperada || metadata.width !== larguraEsperada) {
            fs.unlinkSync(filePath);
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST,
                errorType: 'validationError',
                field: 'dimensoes',
                customMessage: `Não foi possível determinar as dimensões da imagem enviada.`
            })
        }

        const midia = {
            _id: new mongoose.Types.ObjectId(),
            url: `/uploads/${tipo}/${file.filename}`,
            tamanhoMb: +(file.size / (1024 * 1024)).toFixed(2),
            altura: metadata.height,
            largura: metadata.width,
        };

        return await this.repository.adicionarMidia(eventoId, tipo, midia);
    }

    // GET /eventos/:id/midias
    async listarTodasMidias(eventoId) {
        objectIdSchema.parse(eventoId);

        const evento = await this.repository.listarTodasMidias(eventoId);

        return {
            capa: evento.midiaCapa,
            carrossel: evento.midiaCarrossel,
            video: evento.midiaVideo
        };
    }

    // GET /eventos/:id/midia/capa
    async listarMidiaCapa(eventoId) {
        objectIdSchema.parse(eventoId);

        const evento = await this.repository.listarMidiaCapa(eventoId);

        return { capa: evento.midiaCapa };
    }

    // GET /eventos/:id/midia/video
    async listarMidiaVideo(eventoId) {
        objectIdSchema.parse(eventoId);

        const evento = await this.repository.listarMidiaVideo(eventoId);

        return { video: evento.midiaVideo };
    }
    
    // GET /eventos/:id/midia/carrossel
    async listarMidiaCarrossel(eventoId) {
        objectIdSchema.parse(eventoId);

        const evento = await this.repository.listarMidiaCarrossel(eventoId);

        return { carrossel: evento.midiaCarrossel };
    }

    //DELETE /eventos/:id/midia/:tipo/:id
    async deletarMidia(eventoId, tipo, midiaId) {
        objectIdSchema.parse(eventoId);
        objectIdSchema.parse(midiaId)

        const evento = await this.repository.deletarMidia(eventoId, tipo, midiaId);

        return evento;
    }

}

export default UploadService;