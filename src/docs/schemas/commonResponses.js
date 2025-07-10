// src/docs/schemas/commonResponses.js

const commonResponses = {
  UnauthorizedError: {
    description: "Token de acesso inválido ou ausente",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: {
              type: "boolean",
              example: true
            },
            code: {
              type: "integer",
              example: 401
            },
            message: {
              type: "string",
              example: "Não autorizado"
            },
            data: {
              type: "object",
              nullable: true,
              example: null
            },
            errors: {
              type: "array",
              example: [
                {
                  message: "Token JWT inválido"
                }
              ]
            }
          }
        }
      }
    }
  },
  
  ForbiddenError: {
    description: "Acesso negado - usuário não tem permissão",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: {
              type: "boolean",
              example: true
            },
            code: {
              type: "integer",
              example: 403
            },
            message: {
              type: "string",
              example: "Proibido"
            },
            data: {
              type: "object",
              nullable: true,
              example: null
            },
            errors: {
              type: "array",
              example: [
                {
                  message: "Usuário não tem permissão para esta operação"
                }
              ]
            }
          }
        }
      }
    }
  },
  
  NotFoundError: {
    description: "Recurso não encontrado",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: {
              type: "boolean",
              example: true
            },
            code: {
              type: "integer",
              example: 404
            },
            message: {
              type: "string",
              example: "Recurso não encontrado"
            },
            data: {
              type: "object",
              nullable: true,
              example: null
            },
            errors: {
              type: "array",
              example: [
                {
                  message: "O recurso solicitado não foi encontrado"
                }
              ]
            }
          }
        }
      }
    }
  },
  
  BadRequestError: {
    description: "Requisição inválida",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: {
              type: "boolean",
              example: true
            },
            code: {
              type: "integer",
              example: 400
            },
            message: {
              type: "string",
              example: "Requisição com sintaxe incorreta"
            },
            data: {
              type: "object",
              nullable: true,
              example: null
            },
            errors: {
              type: "array",
              example: [
                {
                  message: "Dados da requisição são inválidos"
                }
              ]
            }
          }
        }
      }
    }
  },
  
  InternalServerError: {
    description: "Erro interno do servidor",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: {
              type: "boolean",
              example: true
            },
            code: {
              type: "integer",
              example: 500
            },
            message: {
              type: "string",
              example: "Erro interno do servidor"
            },
            data: {
              type: "object",
              nullable: true,
              example: null
            },
            errors: {
              type: "array",
              example: [
                {
                  message: "Ocorreu um erro interno no servidor"
                }
              ]
            }
          }
        }
      }
    }
  }
};

export default commonResponses;
