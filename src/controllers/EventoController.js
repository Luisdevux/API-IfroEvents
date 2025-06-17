// src/controllers/EventoController.js

import EventoService from '../services/EventoService.js';
import { EventoSchema, EventoUpdateSchema } from '../utils/validators/schemas/zod/EventoSchema.js'
import CompartilharPermissaoSchema from '../utils/validators/schemas/zod/CompartilharPermissaoSchema.js';
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

    // POST /eventos/:id/compartilhar
    async compartilhar(req, res) {
        const dadosValidos = CompartilharPermissaoSchema.parse(req.body);

        const { id } = req.params;
        const { usuarioId, expiraEm } = dadosValidos;
        const donoId = req.user.id;

        const eventoCompartilhado = await this.service.compartilharPermissao(id, donoId, {
            usuarioId,
            expiraEm
        });

        return CommonResponse.success(res, eventoCompartilhado, 200, 'Permissão compartilhada com sucesso.');
    }

    // GET /eventos && GET /eventos/:id
    async listar(req, res) {
        const { id } = req.params;

        if(id) {
            objectIdSchema.parse(id);

            const data = await this.service.listar(id);

            if(!data) {
                throw new CustomError(messages.event.notFound(), HttpStatusCodes.NOT_FOUND.code);
            }

            return CommonResponse.success(res, data);
        }

        const data = await this.service.listar(req);
        return CommonResponse.success(res, data);

    }

    //PATCH /eventos/:id
    async alterar(req, res) {
        const { id } = req.params;
        objectIdSchema.parse(id);

        await this.ensureUserIsOwner(id, req.user._id);

        const parsedData = EventoUpdateSchema.parse(req.body);

        const data = await this.service.alterar(id, parsedData);

        return CommonResponse.success(res, data, 200, 'Evento atualizado com sucesso.');
    }

    //PATCH /eventos/:id/status
    async alterarStatus(req, res) {
        const { id } = req.params;
        objectIdSchema.parse(id);

        const parsedData = EventoUpdateSchema.parse({ status: req.body.status });

        if (!['ativo', 'inativo'].includes(parsedData.status)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'status',
                customMessage: 'Status inválido. Use "ativo" ou "inativo".'
            });
        }

        const statusAtualizado = await this.service.alterarStatus(id, parsedData.status);

        return CommonResponse.success(res, statusAtualizado, 200, 'Status do evento atualizado com sucesso.');
    }

    // DELETE /eventos/:id
    async deletar(req, res) {
        const { id } = req.params || {};

        if(!id) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'id',
                details: [],
                customMessage: 'ID do evento é obrigatório para deletar.'
            });
        }

        objectIdSchema.parse(id);
        
        const data = await this.service.deletar(id);
        return CommonResponse.success(res, data, 200, 'Evento excluído com sucesso.');
    }

    /**
     * Garante que o usuário autenticado é o dono do evento.
     */
    async ensureUserIsOwner(evento, usuarioId) {
        if (evento.organizador._id.toString() !== usuarioId) {
            throw new CustomError({
                statusCode: 403,
                errorType: 'unauthorizedAccess',
                field: 'Evento',
                details: [],
                customMessage: 'Você não tem permissão para manipular este evento.'
            });
        }
    }
}

export default EventoController;