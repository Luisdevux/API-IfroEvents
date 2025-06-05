// src/controllers/UsuarioController.js

import UsuarioService from '../services/UsuarioService.js';
import { UsuarioSchema, UsuarioUpdateSchema } from '../utils/validators/schemas/zod/UsuarioSchema.js';
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
  
  
class UsuarioController {
    constructor() {
      this.service = new UsuarioService();
    }

    // POST /usuarios
    async cadastrar(req, res) {
      const parsedData = UsuarioSchema.parse(req.body);
      let data = await this.service.cadastrar(parsedData);

      let usuarioLimpo = data.toObject();

      delete usuarioLimpo.senha; // Remove senha do objeto de resposta

      return CommonResponse.created(res, usuarioLimpo);
    };

    // GET /usuarios && GET /usuarios/:id
    async listar(req, res) {
      const { id } = req.params;
      
      if(id) {
        objectIdSchema.parse(id);

        const data = await this.service.listar(id);

        if (!data) {
          throw new CustomError(messages.user.notFound(), HttpStatusCodes.NOT_FOUND.code);
        }

        return CommonResponse.success(res, data);
      }

      const data = await this.service.listar(req);
      return CommonResponse.success(res, data);
    };

    //PATCH /usuarios/:id
    async alterar(req, res) {
      const { id } = req.params;
      objectIdSchema.parse(id);
      
      const parsedData = UsuarioUpdateSchema.parse(req.body);

      const data = await this.service.alterar(id, parsedData);

      let usuarioLimpo = data.toObject();

      delete usuarioLimpo.senha;

      return CommonResponse.success(res, usuarioLimpo, 200, 'Usuário atualizado com sucesso.');
    };

        /**
      * Atualiza a senha do próprio usuário em dois cenários NÃO autenticados:
      *
      * 1) Normal (token único passado na URL como query: `?token=<JWT_PASSWORD_RECOVERY>`) 
      *    + { senha } no body.
      *    → Decodifica JWT, extrai usuarioId, salva o hash da nova senha mesmo que usuário esteja inativo.
      *
      * 2) Recuperação por código (envia `{ codigo_recupera_senha, senha }` no body).
      *    → Busca usuário pelo campo `codigo_recupera_senha`, salva hash da nova senha (mesmo se inativo),
      *      e “zera” o campo `codigo_recupera_senha`.
      */
    async atualizarSenha(req, res, next) {
        console.log('Estou no atualizarSenha em UsuarioController');

        const tokenRecuperacao = req.query.token || null; // token de recuperação passado na URL como query
        const { codigo_recupera_senha } = req.body || null; // código de recuperação passado no body
        const { senha } = req.body || null; // nova senha passada no body

        // 1) Verifica se veio o token de recuperação OU o código_recupera_senha no body:
        if (!tokenRecuperacao && !codigo_recupera_senha) {
            throw new CustomError({
                statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                errorType: 'unauthorized',
                field: 'authentication',
                details: [],
                customMessage:
                    'Token de recuperação na URL ou código_recupera_senha no body é obrigatório para atualizar a senha.'
            });
        }

        // 2) Verifica se `senha` foi fornecida:
        if (!senha || typeof senha !== 'string' || senha.trim().length === 0) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'senha',
                details: [],
                customMessage: 'O campo "senha" (nova senha) é obrigatório e deve ser uma string não-vazia.'
            });
        }

        // atualiza a senha 
        await this.service.atualizarSenha({
            "tokenRecuperacao": tokenRecuperacao, "codigo_recupera_senha": codigo_recupera_senha, "senha": senha,
        });

        return CommonResponse.success(
            res,
            { message: 'Senha atualizada com sucesso via token de recuperação.' },
            HttpStatusCodes.OK.code,
            'Senha atualizada com sucesso.'
        );
    }

    // DELETE /usuarios/:id
    async deletar(req, res) {
      const { id } = req.params || {};

      objectIdSchema.parse(id);

      const data = await this.service.deletar(id);
      return CommonResponse.success(res, data, 200, 'Usuário excluído com sucesso.');
    };
}

export default UsuarioController;