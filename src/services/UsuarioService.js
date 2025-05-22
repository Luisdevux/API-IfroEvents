// src/services/UsuarioService.js

import UsuarioRepository from "../repositories/UsuarioRepository.js";
import objectIdSchema from "../utils/validators/schemas/zod/ObjectIdSchema.js";
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from "../utils/helpers/index.js";

class UsuarioService {
    constructor() {
        this.repository = new UsuarioRepository();
    }

    // POST /usuario
    async cadastrar(dadosUsuario) {
        const data = await this.repository.cadastrar(dadosUsuario);
        return data;
    }

    // GET /usuario && GET /usuario/:id
    async listar(req) {
        if (typeof req === 'string') {
            objectIdSchema.parse(req);
            return await this.repository.listarPorId(req);
        }

        return await this.repository.listar();
    }

    // PATCH /usuario/:id
    async alterar(id, parsedData) {
        await this.ensureUserExists(id);

        const data = await this.repository.alterar(id, parsedData);
        return data;
    }

    // DELETE /usuario/:id
    async deletar(id) {
        await this.ensureUserExists(id);
        
        const data = await this.repository.deletar(id);
        return data;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // MÉTODOS AUXILIARES
    ////////////////////////////////////////////////////////////////////////////////

    /**
     * Garante que o usuário existe.
     */
    async ensureUserExists(id) {
        objectIdSchema.parse(id);
        const usuarioExistente = await this.repository.listarPorId(id);
        if(!usuarioExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Usuario',
                details: [],
                customMessage: messages.error.resourceNotFound('Usuario'),
            });
        }
        return usuarioExistente;
    }
}
    
export default UsuarioService;