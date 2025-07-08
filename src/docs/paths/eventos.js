// src/docs/paths/eventos.js

export const eventosPath = {
  "/eventos": {
    "post": {
      "tags": ["Eventos"],
      "summary": "Cadastrar novo evento",
      "description": "Cria um novo evento com mídias opcionais. Aceita multipart/form-data para upload de arquivos.",
      "security": [
        {
          "bearerAuth": []
        }
      ],
      "requestBody": {
        "content": {
          "multipart/form-data": {
            "schema": {
              "$ref": "#/components/schemas/EventoCadastroFormData"
            }
          },
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/EventoCadastro"
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Evento criado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/EventoCadastroResponse"
              },
              "examples": {
                "sucesso": {
                  "value": {
                    "statusCode": 201,
                    "message": "Evento criado com sucesso",
                    "data": {
                      "_id": "60b5f8c8d8f8f8f8f8f8f8f8",
                      "titulo": "Workshop de Node.js",
                      "descricao": "Aprenda Node.js do zero ao avançado",
                      "dataInicio": "2024-01-15T10:00:00.000Z",
                      "dataTermino": "2024-01-15T18:00:00.000Z",
                      "local": "Centro de Convenções",
                      "endereco": "Rua das Flores, 123",
                      "linkInscricao": "https://exemplo.com/inscricao",
                      "categoria": "Tecnologia",
                      "tipoEvento": "workshop",
                      "capacidade": 50,
                      "organizador": {
                        "_id": "60b5f8c8d8f8f8f8f8f8f8f9",
                        "nome": "João Silva"
                      },
                      "status": "inativo",
                      "createdAt": "2024-01-01T12:00:00.000Z",
                      "updatedAt": "2024-01-01T12:00:00.000Z"
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "Erro de validação",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "examples": {
                "validacao": {
                  "value": {
                    "statusCode": 400,
                    "error": "Erro de validação",
                    "message": "Dados inválidos fornecidos",
                    "details": [
                      {
                        "field": "titulo",
                        "message": "Título é obrigatório"
                      }
                    ]
                  }
                }
              }
            }
          }
        },
        "401": {
          "$ref": "#/components/responses/UnauthorizedError"
        },
        "500": {
          "$ref": "#/components/responses/InternalServerError"
        }
      }
    },
    "get": {
      "tags": ["Eventos"],
      "summary": "Listar eventos",
      "description": "Lista todos os eventos com paginação e filtros opcionais",
      "security": [
        {
          "bearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "page",
          "in": "query",
          "description": "Número da página (padrão: 1)",
          "required": false,
          "schema": {
            "type": "integer",
            "minimum": 1,
            "default": 1
          }
        },
        {
          "name": "limit",
          "in": "query",
          "description": "Limite de itens por página (padrão: 10, máximo: 100)",
          "required": false,
          "schema": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100,
            "default": 10
          }
        },
        {
          "name": "titulo",
          "in": "query",
          "description": "Filtrar por título (busca parcial)",
          "required": false,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "categoria",
          "in": "query",
          "description": "Filtrar por categoria",
          "required": false,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "status",
          "in": "query",
          "description": "Filtrar por status",
          "required": false,
          "schema": {
            "type": "string",
            "enum": ["ativo", "inativo"]
          }
        },
        {
          "name": "dataInicio",
          "in": "query",
          "description": "Filtrar por data de início (formato ISO)",
          "required": false,
          "schema": {
            "type": "string",
            "format": "date-time"
          }
        },
        {
          "name": "dataTermino",
          "in": "query",
          "description": "Filtrar por data de término (formato ISO)",
          "required": false,
          "schema": {
            "type": "string",
            "format": "date-time"
          }
        },
        {
          "name": "apenasVisiveis",
          "in": "query",
          "description": "Mostrar apenas eventos visíveis (totem)",
          "required": false,
          "schema": {
            "type": "boolean"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Lista de eventos recuperada com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/EventosListaResponse"
              },
              "examples": {
                "sucesso": {
                  "value": {
                    "statusCode": 200,
                    "message": "Eventos recuperados com sucesso",
                    "data": {
                      "eventos": [
                        {
                          "_id": "60b5f8c8d8f8f8f8f8f8f8",
                          "titulo": "Workshop de Node.js",
                          "descricao": "Aprenda Node.js do zero ao avançado",
                          "dataInicio": "2024-01-15T10:00:00.000Z",
                          "dataTermino": "2024-01-15T18:00:00.000Z",
                          "local": "Centro de Convenções",
                          "categoria": "Tecnologia",
                          "status": "ativo",
                          "organizador": {
                            "_id": "60b5f8c8d8f8f8f8f8f8f8f9",
                            "nome": "João Silva"
                          }
                        }
                      ],
                      "pagination": {
                        "currentPage": 1,
                        "totalPages": 5,
                        "totalItems": 47,
                        "itemsPerPage": 10
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "401": {
          "$ref": "#/components/responses/UnauthorizedError"
        },
        "500": {
          "$ref": "#/components/responses/InternalServerError"
        }
      }
    }
  },
  "/eventos/{id}": {
    "get": {
      "tags": ["Eventos"],
      "summary": "Obter evento por ID",
      "description": "Recupera um evento específico pelo seu ID",
      "security": [
        {
          "bearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "ID do evento",
          "schema": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Evento encontrado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/EventoDetalheResponse"
              },
              "examples": {
                "sucesso": {
                  "value": {
                    "statusCode": 200,
                    "message": "Evento recuperado com sucesso",
                    "data": {
                      "_id": "60b5f8c8d8f8f8f8f8f8f8",
                      "titulo": "Workshop de Node.js",
                      "descricao": "Aprenda Node.js do zero ao avançado",
                      "dataInicio": "2024-01-15T10:00:00.000Z",
                      "dataTermino": "2024-01-15T18:00:00.000Z",
                      "local": "Centro de Convenções",
                      "endereco": "Rua das Flores, 123",
                      "linkInscricao": "https://exemplo.com/inscricao",
                      "categoria": "Tecnologia",
                      "tipoEvento": "workshop",
                      "capacidade": 50,
                      "organizador": {
                        "_id": "60b5f8c8d8f8f8f8f8f8f8f9",
                        "nome": "João Silva"
                      },
                      "status": "ativo",
                      "midiaCapa": [],
                      "midiaVideo": [],
                      "midiaCarrossel": [],
                      "createdAt": "2024-01-01T12:00:00.000Z",
                      "updatedAt": "2024-01-01T12:00:00.000Z"
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "ID inválido",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "examples": {
                "id_invalido": {
                  "value": {
                    "statusCode": 400,
                    "error": "Erro de validação",
                    "message": "ID fornecido não é válido",
                    "details": [
                      {
                        "field": "id",
                        "message": "ID deve ser um ObjectId válido"
                      }
                    ]
                  }
                }
              }
            }
          }
        },
        "401": {
          "$ref": "#/components/responses/UnauthorizedError"
        },
        "404": {
          "description": "Evento não encontrado",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "examples": {
                "nao_encontrado": {
                  "value": {
                    "statusCode": 404,
                    "error": "Recurso não encontrado",
                    "message": "Evento não encontrado",
                    "details": []
                  }
                }
              }
            }
          }
        },
        "500": {
          "$ref": "#/components/responses/InternalServerError"
        }
      }
    },
    "patch": {
      "tags": ["Eventos"],
      "summary": "Atualizar evento",
      "description": "Atualiza um evento existente. Apenas o organizador pode atualizar o evento.",
      "security": [
        {
          "bearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "ID do evento",
          "schema": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          }
        }
      ],
      "requestBody": {
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/EventoAtualizacao"
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Evento atualizado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/EventoDetalheResponse"
              },
              "examples": {
                "sucesso": {
                  "value": {
                    "statusCode": 200,
                    "message": "Evento atualizado com sucesso",
                    "data": {
                      "_id": "60b5f8c8d8f8f8f8f8f8f8f8",
                      "titulo": "Workshop de Node.js Avançado",
                      "descricao": "Aprenda Node.js do zero ao avançado - Atualizado",
                      "dataInicio": "2024-01-15T10:00:00.000Z",
                      "dataTermino": "2024-01-15T18:00:00.000Z",
                      "local": "Centro de Convenções",
                      "endereco": "Rua das Flores, 123",
                      "linkInscricao": "https://exemplo.com/inscricao",
                      "categoria": "Tecnologia",
                      "tipoEvento": "workshop",
                      "capacidade": 50,
                      "organizador": {
                        "_id": "60b5f8c8d8f8f8f8f8f8f8f9",
                        "nome": "João Silva"
                      },
                      "status": "ativo",
                      "updatedAt": "2024-01-01T14:00:00.000Z"
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          "$ref": "#/components/responses/BadRequestError"
        },
        "401": {
          "$ref": "#/components/responses/UnauthorizedError"
        },
        "403": {
          "$ref": "#/components/responses/ForbiddenError"
        },
        "404": {
          "$ref": "#/components/responses/NotFoundError"
        },
        "500": {
          "$ref": "#/components/responses/InternalServerError"
        }
      }
    },
    "delete": {
      "tags": ["Eventos"],
      "summary": "Deletar evento",
      "description": "Remove um evento do sistema. Apenas o organizador pode deletar o evento.",
      "security": [
        {
          "bearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "ID do evento",
          "schema": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Evento deletado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SuccessResponse"
              },
              "examples": {
                "sucesso": {
                  "value": {
                    "statusCode": 200,
                    "message": "Evento deletado com sucesso",
                    "data": {
                      "message": "Evento deletado com sucesso",
                      "data": {
                        "_id": "60b5f8c8d8f8f8f8f8f8f8f8",
                        "titulo": "Workshop de Node.js"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          "$ref": "#/components/responses/BadRequestError"
        },
        "401": {
          "$ref": "#/components/responses/UnauthorizedError"
        },
        "403": {
          "$ref": "#/components/responses/ForbiddenError"
        },
        "404": {
          "$ref": "#/components/responses/NotFoundError"
        },
        "500": {
          "$ref": "#/components/responses/InternalServerError"
        }
      }
    }
  },
  "/eventos/{id}/qrcode": {
    "get": {
      "tags": ["Eventos"],
      "summary": "Gerar QR Code do evento",
      "description": "Gera um QR Code contendo o link de inscrição do evento",
      "security": [
        {
          "bearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "ID do evento",
          "schema": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "QR Code gerado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/QRCodeResponse"
              },
              "examples": {
                "sucesso": {
                  "value": {
                    "statusCode": 200,
                    "message": "QR Code gerado com sucesso.",
                    "data": {
                      "evento": "60b5f8c8d8f8f8f8f8f8f8f8",
                      "linkInscricao": "https://exemplo.com/inscricao",
                      "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAjklEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8NzwGkFAAAAAElFTkSuQmCC"
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "ID inválido ou ausente",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "examples": {
                "id_obrigatorio": {
                  "value": {
                    "statusCode": 400,
                    "error": "Erro de validação",
                    "message": "ID do evento é obrigatório para gerar o QR Code.",
                    "details": []
                  }
                }
              }
            }
          }
        },
        "401": {
          "$ref": "#/components/responses/UnauthorizedError"
        },
        "404": {
          "description": "Evento não encontrado",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "examples": {
                "evento_nao_encontrado": {
                  "value": {
                    "statusCode": 404,
                    "error": "Recurso não encontrado",
                    "message": "Evento não encontrado",
                    "details": []
                  }
                }
              }
            }
          }
        },
        "500": {
          "$ref": "#/components/responses/InternalServerError"
        }
      }
    }
  },
  "/eventos/{id}/status": {
    "patch": {
      "tags": ["Eventos"],
      "summary": "Alterar status do evento",
      "description": "Altera o status de um evento (ativo/inativo). Apenas o organizador pode alterar o status.",
      "security": [
        {
          "bearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "ID do evento",
          "schema": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          }
        }
      ],
      "requestBody": {
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/EventoStatusAtualizacao"
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Status do evento alterado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/EventoDetalheResponse"
              },
              "examples": {
                "status_alterado": {
                  "value": {
                    "statusCode": 200,
                    "message": "Status do evento alterado com sucesso!",
                    "data": {
                      "_id": "60b5f8c8d8f8f8f8f8f8f8f8",
                      "titulo": "Workshop de Node.js",
                      "status": "ativo",
                      "organizador": {
                        "_id": "60b5f8c8d8f8f8f8f8f8f8f9",
                        "nome": "João Silva"
                      },
                      "updatedAt": "2024-01-01T14:00:00.000Z"
                    }
                  }
                },
                "evento_ativado": {
                  "value": {
                    "statusCode": 200,
                    "message": "Evento cadastrado e ativado com sucesso!",
                    "data": {
                      "_id": "60b5f8c8d8f8f8f8f8f8f8f8",
                      "titulo": "Workshop de Node.js",
                      "status": "ativo",
                      "organizador": {
                        "_id": "60b5f8c8d8f8f8f8f8f8f8f9",
                        "nome": "João Silva"
                      },
                      "updatedAt": "2024-01-01T14:00:00.000Z"
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "Status inválido",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "examples": {
                "status_invalido": {
                  "value": {
                    "statusCode": 400,
                    "error": "Erro de validação",
                    "message": "Status deve ser ativo ou inativo.",
                    "details": []
                  }
                }
              }
            }
          }
        },
        "401": {
          "$ref": "#/components/responses/UnauthorizedError"
        },
        "403": {
          "$ref": "#/components/responses/ForbiddenError"
        },
        "404": {
          "$ref": "#/components/responses/NotFoundError"
        },
        "500": {
          "$ref": "#/components/responses/InternalServerError"
        }
      }
    }
  },
  "/eventos/{id}/compartilhar": {
    "patch": {
      "tags": ["Eventos"],
      "summary": "Compartilhar permissão de evento",
      "description": "Compartilha permissão de edição de um evento com outro usuário via email",
      "security": [
        {
          "bearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "ID do evento",
          "schema": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          }
        }
      ],
      "requestBody": {
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/EventoCompartilhamento"
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Permissão compartilhada com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SuccessResponse"
              },
              "examples": {
                "sucesso": {
                  "value": {
                    "statusCode": 200,
                    "message": "Permissão compartilhada com sucesso!",
                    "data": {
                      "evento": "60b5f8c8d8f8f8f8f8f8f8",
                      "email": "usuario@exemplo.com",
                      "permissao": "editar",
                      "expiraEm": "2024-02-01T00:00:00.000Z"
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "Dados inválidos",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "examples": {
                "email_invalido": {
                  "value": {
                    "statusCode": 400,
                    "error": "Erro de validação",
                    "message": "Email válido é obrigatório.",
                    "details": []
                  }
                },
                "data_invalida": {
                  "value": {
                    "statusCode": 400,
                    "error": "Erro de validação",
                    "message": "Data de expiração deve ser futura.",
                    "details": []
                  }
                }
              }
            }
          }
        },
        "401": {
          "$ref": "#/components/responses/UnauthorizedError"
        },
        "403": {
          "$ref": "#/components/responses/ForbiddenError"
        },
        "404": {
          "$ref": "#/components/responses/NotFoundError"
        },
        "500": {
          "$ref": "#/components/responses/InternalServerError"
        }
      }
    }
  }
};

export default eventosPath;
