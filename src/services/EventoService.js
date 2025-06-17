// src/services/EventoService.js

import EventoRepository from "../repositories/EventoRepository.js";
import objectIdSchema from "../utils/validators/schemas/zod/ObjectIdSchema.js";
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
    async listar(req) {
        if(typeof req === 'string') {
            objectIdSchema.parse(req);
            return await this.repository.listarPorId(req);
        }
        
        return await this.repository.listar();
    }
    
    // PATCH /eventos/:id
    async alterar(id, parsedData) {
        await this.ensureEventExists(id);
        
        const data = await this.repository.alterar(id, parsedData);
        return data;
    }
    
    // PATCH /eventos/:id/status
    async alterarStatus(id, novoStatus) {
        await this.ensureEventExists(id);
        
        const statusAtualizado = await this.repository.alterarStatus(id, novoStatus);
        return statusAtualizado;
    }
    
    // PATCH /eventos/:id/permissoes
    async adicionarPermissao(eventoId, permissaoData) {
        await this.ensureEventExists(eventoId);

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
    async deletar(id) {
        await this.ensureEventExists(id);
        
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
        const eventoExistente = await this.repository.listarPorId(id);
        if(!eventoExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Evento',
                details: [],
                customMessage: messages.error.resourceNotFound('Evento'),
            });
        }
        return eventoExistente;
    }
}

export default EventoService;