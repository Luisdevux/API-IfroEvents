// src/services/UploadService.js

import mongoose from "mongoose";
import UploadRepository from "../repositories/UploadRepository.js";
import EventoService from "./EventoService.js";
import objectIdSchema from "../utils/validators/schemas/zod/ObjectIdSchema.js";
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import sharp from "sharp";
import fs from "fs";
import path from "path";

// Constantes para dimensões de mídia
const midiasDimensoes = {
    carrossel: { altura: 720, largura: 1280 },
    capa: { altura: 720, largura: 1280 },
    video: { altura: 720, largura: 1280 }
};

class UploadService {
    constructor() {
        this.repository = new UploadRepository();
        this.eventoService = new EventoService();
    }

    // POST /eventos/:id/midia/:tipo
    async adicionarMidia(eventoId, tipo, file, usuarioId) {
        objectIdSchema.parse(eventoId);
    
        const evento = await this.eventoService.ensureEventExists(eventoId);
        await this.eventoService.ensureUserIsOwner(evento, usuarioId, false);
        
        const filePath = path.resolve(`uploads/${tipo}/${file.filename}`);
        
        // Obtem metadados da imagem que está sendo enviada
        const metadata = await sharp(filePath).metadata();

        const { altura: alturaEsperada, largura: larguraEsperada } = midiasDimensoes[tipo];

        if(metadata.height !== alturaEsperada || metadata.width !== larguraEsperada) {
            // Limpa os arquivo carregados antes de lançar erro
            this.limparArquivo(filePath);
            
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'dimensoes',
                customMessage: `Dimensões inválidas. Esperado: ${alturaEsperada}x${larguraEsperada}px, recebido: ${metadata.width}x${metadata.height}px.`
            });
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
    async deletarMidia(eventoId, tipo, midiaId, usuarioId) {
        objectIdSchema.parse(eventoId);
        objectIdSchema.parse(midiaId);

        const evento = await this.eventoService.ensureEventExists(eventoId);
        await this.eventoService.ensureUserIsOwner(evento, usuarioId, false);

        const midiaRemovida = await this.repository.deletarMidia(eventoId, tipo, midiaId);
        
        // Limpar arquivo físico após remoção bem-sucedida do banco
        this.limparArquivoFisico(midiaRemovida.url);

        return midiaRemovida;
    }

    /**
     * Processa arquivos para cadastro de evento (sem salvar no banco)
     */
    async processarArquivosParaCadastro(files) {
        const midiasProcessadas = {
            midiaVideo: [],
            midiaCapa: [],
            midiaCarrossel: []
        };

        // Processar cada tipo de mídia
        for (const [tipo, arquivos] of Object.entries(files)) {
            if (!midiasProcessadas.hasOwnProperty(tipo)) continue;

            for (const arquivo of arquivos) {
                const filePath = arquivo.path;
                let midia;
                
                if (tipo === 'midiaVideo') {
                    const { altura, largura } = midiasDimensoes.video;
                    midia = {
                        url: `/uploads/video/${arquivo.filename}`,
                        tamanhoMb: +(arquivo.size / (1024 * 1024)).toFixed(2),
                        altura,
                        largura
                    };
                } else {
                    // Obtem metadados da imagem
                    const metadata = await sharp(filePath).metadata();

                    const tipoParaValidacao = tipo.replace('midia', '').toLowerCase();
                    const { altura: alturaEsperada, largura: larguraEsperada } = midiasDimensoes[tipoParaValidacao];

                    if (metadata.height !== alturaEsperada || metadata.width !== larguraEsperada) {
                        // Limpar todos os arquivos em caso de erro
                        this.limparArquivosProcessados(files);
                        
                        throw new CustomError({
                            statusCode: HttpStatusCodes.BAD_REQUEST.code,
                            errorType: 'validationError',
                            field: 'dimensoes',
                            customMessage: `Dimensões inválidas para ${tipo}. Esperado: ${larguraEsperada}x${alturaEsperada}px, recebido: ${metadata.width}x${metadata.height}px.`
                        });
                    }

                    midia = {
                        url: `/uploads/${tipoParaValidacao}/${arquivo.filename}`,
                        tamanhoMb: +(arquivo.size / (1024 * 1024)).toFixed(2),
                        altura: metadata.height,
                        largura: metadata.width
                    };
                }
                
                midiasProcessadas[tipo].push(midia);
            }
        }

        return midiasProcessadas;
    }

    /**
     * Utilitário para limpar arquivo em caso de erro
     */
    limparArquivo(filePath) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    /**
     * Limpar arquivo físico baseado na URL da mídia
     */
    limparArquivoFisico(url) {
        const fileName = path.basename(url);
        const filePath = path.resolve('uploads', path.dirname(url).replace('/uploads/', ''), fileName);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    /**
     * Limpa todos os arquivos de um upload múltiplo em caso de erro
     */
    limparArquivosProcessados(files) {
        for (const [tipo, arquivos] of Object.entries(files)) {
            for (const arquivo of arquivos) {
                this.limparArquivo(arquivo.path);
            }
        }
    }

}

export default UploadService;