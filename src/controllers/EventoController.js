// src/controllers/EventoController.js

import EventoService from '../services/EventoService.js';
import { EventoSchema, EventoUpdateSchema } from '../utils/validators/schemas/zod/EventoSchema.js';
import { EventoQuerySchema } from '../utils/validators/schemas/zod/querys/EventoQuerySchema.js';
import PermissaoSchema from '../utils/validators/schemas/zod/PermissaoSchema.js';
import objectIdSchema from '../utils/validators/schemas/zod/ObjectIdSchema.js';
import {
    CommonResponse,
    CustomError,
    HttpStatusCodes,
    errorHandler,
    messages,
    StatusService,
    asyncWrapper
} from '../utils/helpers/index.js';
import QRCode from 'qrcode';


class EventoController {
    constructor() {
        this.service = new EventoService();
    }

    // POST /eventos
    async cadastrar(req, res) {
        // Pega o usuário autenticado
        const usuarioLogado = req.user;

        const dadosEvento = {
            ...req.body,
            organizador: {
                _id: usuarioLogado._id,
                nome: usuarioLogado.nome
            }
        };

        const parseData = EventoSchema.parse(dadosEvento);
        const data = await this.service.cadastrar(parseData);
        
        return CommonResponse.created(res, data);
    }
    
    // GET /eventos && GET /eventos/:id
    async listar(req, res) {
        const { id } = req.params || {};
        const usuarioId = req.user?._id;
        
        if (id) {
            objectIdSchema.parse(id);
        }
        
        const query = req.query || {};
        if (Object.keys(query).length !== 0) {
            await EventoQuerySchema.parseAsync(query);
        }
        
        const data = await this.service.listar(req, usuarioId);
        
        if (id && !data) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'resourceNotFound',
                field: 'Evento',
                details: [],
                customMessage: messages.error.resourceNotFound('Evento')
            });
        }
        
        return CommonResponse.success(res, data);
    }

    // GET /eventos/:id/qrcode
    async gerarQRCode(req, res) {
        const { id } = req.params;
        objectIdSchema.parse(id);

        if(!id) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'id',
                details: [],
                customMessage: 'ID do evento é obrigatório para gerar o QR Code.'
            });
        }

        const evento = await this.service.listar(id, req.user?._id);
        
        if(!evento) {
            throw new CustomError(messages.event.notFound(), HttpStatusCodes.NOT_FOUND.code);
        }
        
        const qrCode = await QRCode.toDataURL(evento.linkInscricao);

        return CommonResponse.success(res, { evento: evento._id, linkInscricao: evento.linkInscricao, qrcode: qrCode }, 200, 'QR Code gerado com sucesso.');
    }

    // PATCH /eventos/:id
    async alterar(req, res) {
        const { id } = req.params;
        const usuarioLogado = req.user;
        
        objectIdSchema.parse(id);
        
        const parseData = EventoUpdateSchema.parse(req.body);
        
        const data = await this.service.alterar(id, parseData, usuarioLogado._id);
        
        return CommonResponse.success(res, data);
    }

    // PATCH /eventos/:id/status
    async alterarStatus(req, res) {
        const { id } = req.params;
        const usuarioLogado = req.user;
        
        objectIdSchema.parse(id);
        
        const { status } = req.body;
        
        if(!status || !['ativo', 'inativo', 'cancelado'].includes(status)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'status',
                details: [],
                customMessage: 'Status deve ser ativo, inativo ou cancelado.'
            });
        }
        
        const data = await this.service.alterarStatus(id, status, usuarioLogado._id);
        
        return CommonResponse.success(res, data);
    }

    // PATCH /eventos/:id/permissoes
    async adicionarPermissao(req, res) {
        const { id } = req.params;
        const usuarioLogado = req.user;
        
        objectIdSchema.parse(id);
        
        const permissoesData = Array.isArray(req.body) ? req.body : [req.body];

        // Validando cada permissão do array
        permissoesData.forEach((permissao, index) => {
            try {
                PermissaoSchema.parse(permissao);
            } catch (error) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.BAD_REQUEST.code,
                    errorType: 'validationError',
                    field: `permissoes[${index}]`,
                    details: error.errors,
                    customMessage: `Erro de validação na permissão ${index + 1}.`
                });
            }
        });

        const data = await this.service.adicionarPermissao(id, permissoesData, usuarioLogado._id);
        
        return CommonResponse.success(res, data);
    }

    // DELETE /eventos/:id
    async deletar(req, res) {
        const { id } = req.params;
        const usuarioLogado = req.user;
        
        objectIdSchema.parse(id);
        
        const data = await this.service.deletar(id, usuarioLogado._id);
        
        return CommonResponse.success(res, { 
            message: messages.success.resourceDeleted('Evento'),
            data 
        });
    }
}

export default EventoController;