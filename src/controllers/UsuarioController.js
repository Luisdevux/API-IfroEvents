// src/controllers/UsuarooController.js

import EventoService from '../services/UsuarioService.js';
import { EventoSchema, EventoUpdateSchema } from '../utils/validators/schemas/zod/UsuarioSchema.js'
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


  
  import { UsuarioIdSchema } from '../utils/validators/schemas/zod/querys/UsuarioQuerySchema.js';
  
  import UsuarioService from '../services/UsuarioService.js';
  
  class UsuarioController {
    constructor() {
      this.service = new UsuarioService();
    }
  
    
    register = async (req, res) => {
      const body = req.body || {};
      const validatedBody = UsuarioSchema.parse(body);
  
      const data = await this.service.register(validatedBody);
  
      return CommonResponse.success(res, data, HttpStatusCodes.CREATED.code, messages.success.register);
    };
  
    
    getUsers = async (req, res) => {
      const data = await this.service.getUsers();
      return CommonResponse.success(res, data);
    };
  
    
    getUserById = async (req, res) => {
      const { id } = req.params;
      UsuarioIdSchema.parse(id);
  
      const data = await this.service.getUserById(id);
  
      if (!data) {
        throw new CustomError({
          statusCode: HttpStatusCodes.NOT_FOUND.code,
          errorType: 'notFound',
          field: 'User',
          details: [],
          customMessage: 'Usuário não encontrado.'
        });
      }
  
      return CommonResponse.success(res, data);
    };
  
    updateUser = async (req, res) => {
      const { id } = req.params;
      const body = req.body || {};
  
      UsuarioIdSchema.parse(id);
      const validatedBody = UsuarioUpdateSchema.parse(body);
  
      const data = await this.service.updateUser(id, validatedBody);
  
      return CommonResponse.success(res, data, HttpStatusCodes.OK.code, messages.success.update);
    };
  
   
    deleteUser = async (req, res) => {
      const { id } = req.params;
      UsuarioIdSchema.parse(id);
  
      await this.service.deleteUser(id);
  
      return CommonResponse.success(res, null, HttpStatusCodes.OK.code, messages.success.delete);
    };
  }
  
  export default UsuarioController;
  