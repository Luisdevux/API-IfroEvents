// middlewares/AuthPermission.js

import jwt from 'jsonwebtoken';
import { CustomError, errorHandler, messages } from '../utils/helpers/index.js';

// Certifique-se de que as variáveis de ambiente estejam carregadas
const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;

class AuthPermission {
  constructor() {
    this.jwt = jwt;
    this.JWT_SECRET_ACCESS_TOKEN = JWT_SECRET_ACCESS_TOKEN;
    this.messages = messages;
    

    // Vincula o método handle ao contexto da instância
    this.handle = this.handle.bind(this);
  }

  async handle(req, res, next) {
    try {
      // 1. Extrai o token do cabeçalho Authorization
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new CustomError({
          statusCode: 401,
          errorType: 'authenticationError',
          field: 'Authorization',
          details: [],
          customMessage: this.messages.error.unauthorized('Token')
        });
      }

      const token = authHeader.split(' ')[1];

      // 2. Verifica e decodifica o token
      let decoded;
      try {
        decoded = this.jwt.verify(token, this.JWT_SECRET_ACCESS_TOKEN);
      } catch (err) {
        throw new CustomError({
          statusCode: 401,
          errorType: 'authenticationError',
          field: 'Token',
          details: [],
          customMessage: this.messages.error.unauthorized('Token inválido')
        });
      }

      // 3. Anexa o ID do usuário à requisição
      if (!decoded?.id) {
        throw new CustomError({
          statusCode: 401,
          errorType: 'authenticationError',
          field: 'Token',
          details: [],
          customMessage: this.messages.error.unauthorized('Token inválido')
        });
      }

      req.user = { id: decoded.id };

      // 4. Continua para o próximo middleware
      next();
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }
}

// Instanciar e exportar apenas o método 'handle' como função de middleware
export default new AuthPermission().handle;
