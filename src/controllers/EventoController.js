// src/controllers/EventoController.js

import EventoService from '../services/EventoService.js';
import { EventoSchema, EventoUpdateSchema } from '../utils/validators/schemas/zod/EventoSchema.js'
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
        const { id } = req.params;
        
        if(id) {
            objectIdSchema.parse(id);
            
            const data = await this.service.listar(id);
            
            if(!data) {
                throw new CustomError(messages.event.notFound(), HttpStatusCodes.NOT_FOUND.code);
            }

            if(req.user) {
                // Verifica se o evento é do usuário autenticado
                await this.ensureUserIsOwner(data, req.user._id);
            }
            return CommonResponse.success(res, data);
        }
        
        const data = await this.service.listar(req);
        return CommonResponse.success(res, data);
    }
    
    // PATCH /eventos/:id
    async alterar(req, res) {
        const { id } = req.params;
        objectIdSchema.parse(id);
        
        // Busca o evento para garantir que o usuário é o dono
        const evento = await this.service.listar(id);
        
        // Verifica se o evento é do usuário autenticado
        await this.ensureUserIsOwner(evento, req.user._id);
        
        const parsedData = EventoUpdateSchema.parse(req.body);
        
        const data = await this.service.alterar(id, parsedData);
        
        return CommonResponse.success(res, data, 200, 'Evento atualizado com sucesso.');
    }
    
    // PATCH /eventos/:id/status
    async alterarStatus(req, res) {
        const { id } = req.params;
        objectIdSchema.parse(id);

        // Busca o evento para garantir que o usuário é o dono
        const evento = await this.service.listar(id);
        
        // Verifica se o evento é do usuário autenticado
        await this.ensureUserIsOwner(evento, req.user._id);
        
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
    
    // PATCH /eventos/:id/permissoes
    async adicionarPermissao(req, res) {
        const { id } = req.params;
        objectIdSchema.parse(id);

        // Busca o evento para garantir que o usuário é o dono
        const evento = await this.service.listar(id);
        
        // Verifica se o evento é do usuário autenticado
        await this.ensureUserIsOwner(evento, req.user._id, true);

        const permissoes = Array.isArray(req.body) ? req.body : [req.body];
        const permissoesValidas = permissoes.map(p => PermissaoSchema.parse(p));

        const data = await this.service.adicionarPermissao(id, permissoesValidas);

        return CommonResponse.success(res, data, 200, 'Permissão adicionada com sucesso.');
    }

    // DELETE /eventos/:id
    async deletar(req, res) {
        const { id } = req.params || {};

        // Busca o evento para garantir que o usuário é o dono
        const evento = await this.service.listar(id);

        // Verifica se o evento é do usuário autenticado
        await this.ensureUserIsOwner(evento, req.user._id, true);

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
     * Garante que o usuário autenticado é o dono do evento ou possui permissão compartilhada válida.
     * @param {Object} evento - O evento a ser verificado
     * @param {String} usuarioId - ID do usuário a verificar
     * @param {Boolean} ownerOnly - Se true, apenas o proprietário original é permitido
     */
    async ensureUserIsOwner(evento, usuarioId, ownerOnly = false) {
        // Se for o dono, permite sempre as requisiçoes
        if (evento.organizador._id.toString() === usuarioId) {
            return;
        }

        // Se o modo estrito estiver ativado, apenas o dono é permitido
        if (ownerOnly) {
            throw new CustomError({
                statusCode: 403,
                errorType: 'unauthorizedAccess',
                field: 'Evento',
                details: [],
                customMessage: 'Apenas o proprietário do evento pode realizar esta operação.'
            });
        }

        // Verificação de permissão compartilhada (só chega aqui se não for modo estrito)
        const agora = new Date();
        const permissaoValida = (evento.permissoes || []).some(permissao =>
            permissao.usuario.toString() === usuarioId &&
            permissao.permissao === 'editar' &&
            new Date(permissao.expiraEm) > agora
        );

        if (permissaoValida) {
            return;
        }

        // Caso contrário, bloqueia
        throw new CustomError({
            statusCode: 403,
            errorType: 'unauthorizedAccess',
            field: 'Evento',
            details: [],
            customMessage: 'Você não tem permissão para manipular este evento.'
        });
    }
}

export default EventoController;