// src/tests/unit/controllers/UsuarioController.test.js

// ==================================================================
// Mocks que precisam ser definidos ANTES de quaisquer outros imports
// ==================================================================

jest.mock('../../../utils/helpers/index.js', () => {
    return {
        CommonResponse: {
            success: jest.fn(),
            created: jest.fn()
        },
        CustomError: jest.fn((opts) => {
            const err = new Error(opts.customMessage || opts);
            err.statusCode = opts.statusCode;
            err.errorType = opts.errorType || 'CustomError';
            err.field = opts.field;
            err.details = opts.details;
            return err;
        }),
        HttpStatusCodes: {
            BAD_REQUEST: { code: 400 },
            NOT_FOUND: { code: 404 }
        },
        errorHandler: jest.fn(),
        messages: {
            user: {
                notFound: () => 'Usuário não encontrado.'
            }
        },
        StatusService: {},
        asyncWrapper: jest.fn()
    };
});

jest.mock('../../../utils/validators/schemas/zod/UsuarioSchema.js', () => {
    return {
        UsuarioSchema: { parse: jest.fn() },
        UsuarioUpdateSchema: { parse: jest.fn() }
    };
});

jest.mock('../../../utils/validators/schemas/zod/ObjectIdSchema.js', () => ({
    parse: jest.fn()
}));
  
// =================================================================
// Importação dos módulos que serão testados
// =================================================================
import mongoose from 'mongoose';

import UsuarioController from '../../../controllers/UsuarioController.js';
import UsuarioService from '../../../services/UsuarioService.js';

import { CommonResponse, CustomError, HttpStatusCodes } from '../../../utils/helpers/index.js';

import objectIdSchema from '../../../utils/validators/schemas/zod/ObjectIdSchema.js';
import { UsuarioSchema, UsuarioUpdateSchema } from '../../../utils/validators/schemas/zod/UsuarioSchema.js';

// =================================================================
// Testes para UsuarioController
// =================================================================
describe('UsuarioController', () => {
    let controller, req, res, next;

    beforeEach(() => {
        controller = new UsuarioController();
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        req = { params: {}, body: {}, query: {} };
        next = jest.fn();

        CommonResponse.success.mockClear();
        CommonResponse.created.mockClear();
        UsuarioSchema.parse.mockClear();
        UsuarioUpdateSchema.parse.mockClear();
        objectIdSchema.parse.mockClear();

        controller.service.cadastrar = jest.fn();
        controller.service.listar = jest.fn();
        controller.service.alterar = jest.fn();
        controller.service.deletar = jest.fn();
    });

     // ================================
    // Testes para o método cadastrar
    // ================================
    describe('cadastrar', () => {
        it('deve cadastrar um usuário com sucesso', async () => {
            req.body = { 
                nome: 'Usuário Teste',
                email: 'teste@example.com',
                senha: 'senha123'
            };

            const usuarioCadastrado = {
                ...req.body,
                _id: new mongoose.Types.ObjectId(),
                senha: undefined
            };

            UsuarioSchema.parse.mockReturnValue(req.body);
            controller.service.cadastrar.mockResolvedValue(usuarioCadastrado);

            await controller.cadastrar(req, res);

            expect(UsuarioSchema.parse).toHaveBeenCalledWith(req.body);
            expect(controller.service.cadastrar).toHaveBeenCalledWith(req.body);
            expect(CommonResponse.created).toHaveBeenCalledWith(res, usuarioCadastrado);
        });
    });

    // =================================================================
    // Testes adicionais para validações e casos de erro de ID inválido
    // =================================================================
    describe('validação para ID inválido', () => {
        beforeEach(() => {
            jest.spyOn(objectIdSchema, 'parse').mockImplementation(() => {
                throw new Error('ID inválido');
            });
        });

        afterEach(() => {
            objectIdSchema.parse.mockRestore();
        });

        it('listar deve lançar erro se ID inválido for passado', async () => {
            req.params.id = 'id-invalido';

            await expect(controller.listar(req, res)).rejects.toThrow('ID inválido');
            expect(objectIdSchema.parse).toHaveBeenCalledWith(req.params.id);
        });

        it('alterar deve lançar erro se ID inválido for passado', async () => {
            req.params.id = 'id-invalido';
            req.body = { nome: 'Novo Nome' };

            await expect(controller.alterar(req, res)).rejects.toThrow('ID inválido');
            expect(objectIdSchema.parse).toHaveBeenCalledWith('id-invalido');
        });

        it('deletar deve lançar erro se ID inválido for passado', async () => {
            req.params.id = 'id-invalido';

            await expect(controller.deletar(req, res)).rejects.toThrow('ID inválido');
            expect(objectIdSchema.parse).toHaveBeenCalledWith('id-invalido');
        });
    });

    // ==============================================
    // Testes para o método listar e listar por ID
    // ==============================================
    describe('listar', () => {
        it('deve listar um usuário por ID válido', async () => {
            const idValido = new mongoose.Types.ObjectId().toString();
            const usuario = { 
                _id: idValido, 
                nome: 'Usuário Único',
                email: 'unico@test.com'
            };
            req.params.id = idValido;
            objectIdSchema.parse.mockReturnValue(idValido);
            controller.service.listar.mockResolvedValue(usuario);

            await controller.listar(req, res);

            expect(objectIdSchema.parse).toHaveBeenCalledWith(idValido);
            expect(controller.service.listar).toHaveBeenCalledWith(idValido);
            expect(CommonResponse.success).toHaveBeenCalledWith(res, usuario);
        });

        it('deve lançar erro se o usuário não for encontrado', async () => {
            const idValido = new mongoose.Types.ObjectId().toString();
            req.params.id = idValido;
            objectIdSchema.parse.mockReturnValue(idValido);
            controller.service.listar.mockResolvedValue(null);

            await expect(controller.listar(req, res)).rejects.toThrow('Usuário não encontrado.');
            expect(objectIdSchema.parse).toHaveBeenCalledWith(idValido);
            expect(controller.service.listar).toHaveBeenCalledWith(idValido);
        });
    });

    // ================================
    // Testes para o método alterar
    // ================================
    describe('alterar', () => {
        it('deve alterar um usuário com sucesso', async () => {
            const idValido = new mongoose.Types.ObjectId().toString();
            req.params.id = idValido;
            req.body = { nome: 'Novo Nome' };
            
            const dadosAtualizados = { nome: 'Novo Nome' };
            objectIdSchema.parse.mockReturnValue(idValido);
            UsuarioUpdateSchema.parse.mockReturnValue(dadosAtualizados);

            const resultado = { 
                _id: idValido, 
                nome: 'Novo Nome',
                email: 'teste@example.com'
            };
            controller.service.alterar.mockResolvedValue(resultado);

            await controller.alterar(req, res);

            expect(objectIdSchema.parse).toHaveBeenCalledWith(idValido);
            expect(UsuarioUpdateSchema.parse).toHaveBeenCalledWith(req.body);
            expect(controller.service.alterar).toHaveBeenCalledWith(idValido, dadosAtualizados);
            expect(CommonResponse.success).toHaveBeenCalledWith(
                res, 
                resultado, 
                200, 
                'Usuário atualizado com sucesso.'
            );
        });
    });

    // ================================
    // Testes para o método deletar
    // ================================
    describe('deletar', () => {
        it('deve deletar um usuário com sucesso', async () => {
            const idValido = new mongoose.Types.ObjectId().toString();
            req.params.id = idValido;
            objectIdSchema.parse.mockReturnValue(idValido);
            const resultado = { acknowledged: true, deletedCount: 1 };
            controller.service.deletar.mockResolvedValue(resultado);

            await controller.deletar(req, res);

            expect(objectIdSchema.parse).toHaveBeenCalledWith(idValido);
            expect(controller.service.deletar).toHaveBeenCalledWith(idValido);
            expect(CommonResponse.success).toHaveBeenCalledWith(
                res, 
                resultado, 
                200, 
                'Usuário excluído com sucesso.'
            );
        });

        it('deve lançar erro se ID não for fornecido', async () => {
            req.params = {};

            await expect(controller.deletar(req, res)).rejects.toMatchObject({
                statusCode: 400,
                field: 'id',
                message: 'ID do usuário é obrigatório para deletar.'
            });
        });
    });
});