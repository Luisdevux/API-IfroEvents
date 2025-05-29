// src/tests/unit/controllers/EventoController.test.js

// ==================================================================
// Mocks que precisam ser definidos ANTES de quaisquer outros imports
// ==================================================================

jest.mock('sharp', () => {
    // Função que simula o encadeamento do resize e toBuffer
    const resizeToBufferMock = jest.fn(() => Promise.resolve(Buffer.from('resized image')));
    const resizeMock = jest.fn(() => ({
      toBuffer: resizeToBufferMock,
    }));
  
    // Função principal do sharp
    const sharpMock = jest.fn(() => ({
      resize: resizeMock,
    }));
  
    // Adiciona as propriedades necessárias para a configuração da imagem
    sharpMock.fit = { cover: 'cover' };
    sharpMock.strategy = { entropy: 'entropy' };
  
    return sharpMock;
});

// Mock do mongoose, simulando Schema e Types
jest.mock('mongoose', () => {
    class Schema {
      constructor(definition, options) {
        this.definition = definition;
        this.options = options;
        this.index = jest.fn();
        this.plugin = jest.fn();
      }
    }
    Schema.prototype.pre = jest.fn();
    Schema.Types = { ObjectId: 'ObjectId' };
  
    return {
        Schema,
        model: jest.fn(() => ({})),
        connect: jest.fn(),
        connection: {
            on: jest.fn(),
            once: jest.fn(),
            close: jest.fn()
        }
    };
});

// Mock do uuid
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'fixed-uuid')
}));
  
// Mock dos helpers
jest.mock('../../../utils/helpers/index.js', () => {
    return {
        CommonResponse: {
            success: jest.fn(),
            created: jest.fn()
        },
        CustomError: jest.fn((opts) => {
            const err = new Error(opts.customMessage);
            err.statusCode = opts.statusCode;
            err.errorType = opts.errorType;
            err.field = opts.field;
            err.details = opts.details;
            return err;
        }),
        HttpStatusCodes: {
            BAD_REQUEST: { code: 400 },
            NOT_FOUND: { code: 404 }
        },
        errorHandler: jest.fn(),
        messages: {},
        StatusService: {},
        asyncWrapper: jest.fn()
    };
});

// Mocks dos schemas Zod
jest.mock('../../../utils/validators/schemas/zod/EventoSchema.js', () => {
    return {
        EventoSchema: { parse: jest.fn() },
        EventoSchemaUpdateSchema: { parse: jest.fn() }
    };
});
  
// =================================================================
// Importação dos módulos que serão testados
// =================================================================
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import EventoController from '../../../controllers/EventoController.js';
import EventoService from '../../../services/EventoService.js';

import { CommonResponse, CustomError, HttpStatusCodes } from '../../../utils/helpers/index.js';

import { EventoSchema, EventoUpdateSchema } from '../../../utils/validators/schemas/zod/EventoSchema.js';

// =================================================================
// Testes para UsuarioController
// =================================================================
describe('EventoController', () => {
    let controller, req, res, next;

    beforeEach(() => {
        controller = new EventoController();
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            setHeader: jest.fn(),
            sendFile: jest.fn()
        };
        req = { params: {}, query: {}, body: {}, files: {} };
        next = jest.fn();

        // Limpa os mocks
        CommonResponse.success.mockClear();
        CommonResponse.created.mockClear();
        EventoSchema.parse.mockClear();
        EventoUpdateSchema.parse.mockClear();

        // Mocks do Service
        controller.service.cadastrar = jest.fn();
        controller.service.listar = jest.fn();
        controller.service.alterar = jest.fn();
        controller.service.alterarStatus = jest.fn();
        controller.service.deletar = jest.fn();
    });

    // ================================
    // Testes para o método cadastrar
    // ================================
    describe('Cadastrar', () => {
        console.log("Inicio aqui");
    });
})