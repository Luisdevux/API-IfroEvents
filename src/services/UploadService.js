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

    async salvarMidia(eventoId, tipo, file) {
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

}

export default UploadService;