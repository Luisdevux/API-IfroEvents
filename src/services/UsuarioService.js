// src/services/UsuarioService.js

import UsuarioRepository from "../repositories/UsuarioRepository.js";
import objectIdSchema from "../utils/validators/schemas/zod/ObjectIdSchema.js";
import TokenUtil from "../utils/TokenUtil.js";
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from "../utils/helpers/index.js";

class UsuarioService {
    constructor() {
        this.repository = new UsuarioRepository();
        this.TokenUtil = TokenUtil; // Instância do TokenUtil para manipulação de tokens
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

        /**
        * Se o usuário não estiver ativo, remove os tokens de acesso e refresh.
        */
        if (!parsedData.ativo) {
            parsedData.accesstoken = null;
            parsedData.refreshtoken = null;
        }

        /**
        * Remove os campos que não podem ser atualizados.
        */
        delete parsedData.senha;
        delete parsedData.email;

        /**
        * Verifica se o usuário existe.
        */

        const data = await this.repository.alterar(id, parsedData);
        return data;
    }

    /**
    * Atualiza a senha de um usuário
    *
    * - Aceita **tokenRecuperacao** (JWT) ou **codigo_recupera_senha** (4 dígitos)
    * - Código expira após 60 min (verificado via `exp_codigo_recupera_senha`)
    */
    async atualizarSenha({ tokenRecuperacao = null, codigo_recupera_senha = null, senha }) {
        console.log('Estou no atualizarSenha em UsuarioService');

        /* 1) Nenhum identificador */
        if (!tokenRecuperacao && !codigo_recupera_senha) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'tokenRecuperacao / codigo_recupera_senha',
                details: [],
                customMessage:
                    'Informe o token de recuperação ou o código de recuperação.',
            });
        }

        let usuarioId;

        /* ─── A) Código de 4 caracteres ───────────────────────────── */
        if (codigo_recupera_senha) {
            const usuario = await this.repository.buscarPorPorCodigoRecuperacao(
                codigo_recupera_senha,
            );

            if (!usuario) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.NOT_FOUND.code,
                    errorType: 'validationError',
                    field: 'codigo_recupera_senha',
                    details: [
                        {
                            path: 'codigo_recupera_senha',
                            message: 'Código de recuperação inválido ou não encontrado.',
                        },
                    ],
                    customMessage: 'Código de recuperação inválido ou não encontrado.',
                });
            }

            /* Validação de expiração */
            const expTime = new Date(usuario.exp_codigo_recupera_senha).getTime();
            if (!expTime || expTime < Date.now()) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                    errorType: 'authenticationError',
                    field: 'codigo_recupera_senha',
                    details: [
                        {
                            path: 'codigo_recupera_senha',
                            message: 'Código de recuperação expirado.',
                        },
                    ],
                    customMessage: 'Código de recuperação expirado.',
                });
            }

            usuarioId = usuario._id.toString();
        }

        /* ─── B) Token JWT ────────────────────────────────────────── */
        if (tokenRecuperacao) {
            if (typeof tokenRecuperacao !== 'string' || !tokenRecuperacao.trim()) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.BAD_REQUEST.code,
                    errorType: 'validationError',
                    field: 'tokenRecuperacao',
                    details: [
                        {
                            path: 'tokenRecuperacao',
                            message: 'Token de recuperação inválido.',
                        },
                    ],
                    customMessage: 'Token de recuperação deve ser uma string não vazia.',
                });
            }

            let decoded;
            try {
                decoded = await this.TokenUtil.decodePasswordRecoveryToken(
                    tokenRecuperacao,
                );
            } catch (err) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                    errorType: 'authenticationError',
                    field: 'tokenRecuperacao',
                    details: [],
                    customMessage: 'Token de recuperação expirado ou inválido.',
                });
            }

            if (!decoded.usuarioId) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.BAD_REQUEST.code,
                    errorType: 'validationError',
                    field: 'tokenRecuperacao',
                    details: [],
                    customMessage: 'Payload do token não contém ID do usuário.',
                });
            }

            usuarioId = decoded.usuarioId;
        }

        /* 3) Valida ID e busca usuário */
        UsuarioIdSchema.parse(usuarioId);

        const usuarioEncontrado = await this.repository.buscarPorId(usuarioId);
        if (!usuarioEncontrado) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'notFound',
                field: 'id',
                details: [],
                customMessage: 'Usuário não encontrado para alteração de senha.',
            });
        }

        /* 4) Valida / gera hash da nova senha */
        const { senha: senhaValidada } = UsuarioUpdateSchema.parse({ senha });
        const senhaHash = await bcrypt.hash(senhaValidada, 10);

        /* 5) Persiste */
        await this.repository.atualizarSenha(usuarioId, senhaHash);

        /* 6) Remove código após uso */
        if (codigo_recupera_senha) {
            await this.repository.atualizar(usuarioId, {
                codigo_recupera_senha: null,
                exp_codigo_recupera_senha: null,
            });
        }

        return { message: 'Senha atualizada com sucesso.' };
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
        if (!usuarioExistente) {
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