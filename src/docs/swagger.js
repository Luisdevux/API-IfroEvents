/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Endpoints para autenticação de usuários (login, logout, refresh token)
 *   - name: Usuários
 *     description: Endpoints para gerenciamento de usuários (CRUD, perfil, etc.)
 *   - name: Eventos
 *     description: Endpoints para gerenciamento de eventos (CRUD, status, compartilhamento)
 *   - name: Upload
 *     description: Endpoints para gerenciamento de uploads de mídias
 */

import authPaths from './paths/auth.js';
import usuariosPaths from './paths/usuarios.js';
import eventosPaths from './paths/eventos.js';
import uploadPaths from './paths/upload.js';

import authSchema from './schemas/authSchema.js';
import usuariosSchema from './schemas/usuariosSchema.js';
import eventosSchema from './schemas/eventosSchema.js';
import uploadSchema from './schemas/uploadSchema.js';
import swaggerCommonResponses from './schemas/swaggerCommonResponses.js';

// Configuração principal do Swagger
const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Plataforma de Divulgação de Eventos - API',
    version: '1.0.0',
    description: 'API para gerenciamento de eventos, usuários e upload de mídias',
    contact: {
      name: 'Equipe de Desenvolvimento',
      email: 'dev@plataforma-eventos.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desenvolvimento'
    },
    {
      url: 'https://api.plataforma-eventos.com',
      description: 'Servidor de produção'
    }
  ],
  paths: {
    ...authPaths,
    ...usuariosPaths,
    ...eventosPaths,
    ...uploadPaths
  },
  components: {
    schemas: {
      ...authSchema,
      ...usuariosSchema,
      ...eventosSchema,
      ...uploadSchema,
      ...swaggerCommonResponses
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Token obtido através do endpoint de login'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

export default swaggerConfig;
