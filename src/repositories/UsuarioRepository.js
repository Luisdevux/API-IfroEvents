// src/repositories/UsuarioRepository.js

import UsuarioModel from '../models/Usuario.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class UsuarioRepository {
    constructor({
        usuarioModel = UsuarioModel,
    } = {}) {
        this.model = usuarioModel
    }

    // POST /usuarios
    async cadastrar(dadosUsuario) {
        const usuario = new this.model(dadosUsuario);
        return await usuario.save();
    }

    // GET /usuarios
    async listar() {
        const data = await this.model.find();
        return data;
    }

    // GET /usuarios/:id
    async listarPorId(id) {
        const usuario = await this.model.findById(id);
    
        if (!usuario) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'resourceNotFound',
                field: 'Usuário',
                details: [],
                customMessage: messages.error.resourceNotFound('Usuário')
            });
        }
    
        return usuario;
    }


    //PATH /usuarios
    async alterar(id, parsedData) {
        const usuario = await this.model.findByIdAndUpdate(id, parsedData, { new: true })

        if (!usuario) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'resourceNotFound',
                field: 'Usuário',
                details: [],
                customMessage: messages.error.resourceNotFound('Usuário')
            });
        }
        return usuario;
    }

    async atualizarSenha(id, senha) {
        const usuario = await this.model.findByIdAndUpdate(
            id,
            {
                // atualiza a senha
                $set: { senha },
                // remove os campos de código de recuperação e token único
                $unset: {
                    tokenUnico: "",
                    codigo_recupera_senha: "",
                    exp_codigo_recupera_senha: ""
                }
            },
            { new: true } // Retorna o documento atualizado
        ).exec();

        if (!usuario) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Usuário',
                details: [],
                customMessage: messages.error.resourceNotFound('Usuário')
            });
        }

        return usuario;
    }


    //DELETE /usuarios/:id
    async deletar(id) {
        const usuario = await this.model.findByIdAndDelete(id);
        return usuario;
    }
}

export default UsuarioRepository;