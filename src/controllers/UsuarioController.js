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
      const body = req.body || {};
      const parsedData = UsuarioSchema.parse(body);

      const data = await this.service.cadastrar(parsedData);

      return CommonResponse.created(res, data);
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

      return CommonResponse.success(res, data, 200, 'Usuário atualizado com sucesso.');
    };

    // DELETE /usuarios/:id
    async deletar(req, res) {
      const { id } = req.params;

      if(!id){
        throw new CustomError({
          statusCode: HttpStatusCodes.BAD_REQUEST.code,
          errorType: 'validationError',
          field: 'id',
          customMessage: 'ID do usuário é obrigatório para deletar.'
        })
      }

      objectIdSchema.parse(id);

      const data = await this.service.deletar(id);
      return CommonResponse.success(res, data, 200, 'Usuário excluído com sucesso.');
    };
}

export default UsuarioController;