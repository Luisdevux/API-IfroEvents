// src/services/EventoService.js

import EventoRepository from "../repositories/EventoRepository.js";
import objectIdSchema from "../utils/validators/schemas/zod/ObjectIdSchema.js";
import { EventoQuerySchema } from "../utils/validators/schemas/zod/querys/EventoQuerySchema.js";
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from "../utils/helpers/index.js";

class EventoService {
    constructor() {
        this.repository = new EventoRepository();
    }

    // POST /eventos
    async cadastrar(dadosEventos) {
        const data = await this.repository.cadastrar(dadosEventos);
        return data;
    }
    
    // GET /eventos && GET /eventos/:id
    async listar(req, usuarioId) {
        if(typeof req === 'string') {
            objectIdSchema.parse(req);
            
            const eventoReq = { params: { id: req } };
            const evento = await this.repository.listar(eventoReq);
            
            if (!usuarioId && evento.status !== 'ativo') {
                throw new CustomError({
                    statusCode: HttpStatusCodes.NOT_FOUND.code,
                    errorType: 'resourceNotFound',
                    field: 'Evento',
                    details: [],
                    customMessage: 'Evento não encontrado ou inativo.'
                });
            }
            
            return evento;
        }
        
        if (usuarioId) {
            req.user = { id: usuarioId };
        }
        
        if (req.query) {
            EventoQuerySchema.parse(req.query);
        }
        
        return await this.repository.listar(req);
    }
    
    async listarEventosVisiveis(usuarioId) {
        const req = { 
            query: {},
            user: { id: usuarioId }
        };
        
        return await this.listar(req, usuarioId);
    }
    
    // PATCH /eventos/:id
    async alterar(id, parsedData, usuarioId) {
        const evento = await this.ensureEventExists(id);
        
        await this.ensureUserIsOwner(evento, usuarioId, false);
        
        const data = await this.repository.alterar(id, parsedData);
        return data;
    }
    
    // PATCH /eventos/:id/status
    async alterarStatus(id, novoStatus, usuarioId) {
        const evento = await this.ensureEventExists(id);
        
        await this.ensureUserIsOwner(evento, usuarioId, true);
        
        const statusAtualizado = await this.repository.alterarStatus(id, novoStatus);
        return statusAtualizado;
    }
    
    // PATCH /eventos/:id/permissoes
    async adicionarPermissao(eventoId, permissaoData, usuarioId) {
        const evento = await this.ensureEventExists(eventoId);
        
        await this.ensureUserIsOwner(evento, usuarioId, true);

        const permissoes = [];
        const buscaEvento = await this.repository.listarPorId(eventoId);

        permissaoData.forEach(perm => {
            const existe = buscaEvento.permissoes.find(p => p.usuario.toString() === perm.usuarioId);
            if(existe) {
                permissoes.push({
                    updateOne: {
                        filter: { _id: eventoId, "permissoes.usuario": perm.usuarioId },
                        update: {
                            $set: {
                                "permissoes.$.expiraEm": perm.expiraEm,
                                "permissoes.$.permissao": perm.permissao,
                            }
                        }
                    }
                });
            } else {
                permissoes.push({
                    updateOne: {
                        filter: { _id: eventoId },
                        update: {
                            $push: {
                                permissoes: {
                                    usuario: perm.usuarioId,
                                    expiraEm: perm.expiraEm,
                                    permissao: perm.permissao
                                }
                            }
                        }
                    }
                });
            }
        });

        if(permissoes.length > 0) {
            await this.repository.model.bulkWrite(permissoes);
        }

        return await this.repository.listarPorId(eventoId);
    }

    // DELETE /eventos/:id
    async deletar(id, usuarioId) {
        const evento = await this.ensureEventExists(id);
        
        await this.ensureUserIsOwner(evento, usuarioId, true);
        
        const data = await this.repository.deletar(id);
        return data;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // MÉTODOS AUXILIARES
    ////////////////////////////////////////////////////////////////////////////////

    /**
     * Garante que o evento existe.
     */
    async ensureEventExists(id) {
        objectIdSchema.parse(id);
        const evento = await this.repository.listarPorId(id);
        
        if(!evento) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Evento',
                details: [],
                customMessage: messages.error.resourceNotFound('Evento'),
            });
        }
        return evento;
    }

    /**
     * Garante que o usuário autenticado é o dono do evento ou possui permissão compartilhada válida.
     * @param {Object} evento - O evento a ser verificado
     * @param {String} usuarioId - ID do usuário a verificar
     * @param {Boolean} ownerOnly - Se true, apenas o proprietário original é permitido
     */
    async ensureUserIsOwner(evento, usuarioId, ownerOnly = false) {
        // Se for o dono, permite sempre as requisições
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

        // Verificação de permissão compartilhada
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

export default EventoService;