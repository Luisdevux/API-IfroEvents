// src/docs/paths/upload.js

const uploadPath = {
  "/eventos/{id}/midia/{tipo}": {
    "post": {
      "tags": ["Upload de Mídias"],
      "summary": "Adicionar mídia ao evento",
      "description": "Adiciona uma ou múltiplas mídias ao evento. Tipo 'carrossel' aceita múltiplos arquivos, outros tipos aceitam apenas um arquivo.",
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
        },
        {
          "name": "tipo",
          "in": "path",
          "required": true,
          "description": "Tipo de mídia",
          "schema": {
            "type": "string",
            "enum": ["capa", "video", "carrossel"]
          }
        }
      ],
      "requestBody": {
        "content": {
          "multipart/form-data": {
            "schema": {
              "type": "object",
              "properties": {
                "file": {
                  "type": "string",
                  "format": "binary",
                  "description": "Arquivo único para capa ou video"
                },
                "files": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "format": "binary"
                  },
                  "description": "Múltiplos arquivos para carrossel"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Mídia(s) adicionada(s) com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UploadResponse"
              },
              "examples": {
                "midia_unica": {
                  "value": {
                    "statusCode": 201,
                    "message": "Mídia (capa) salva com sucesso.",
                    "data": {
                      "evento": "60b5f8c8d8f8f8f8f8f8f8",
                      "tipo": "capa",
                      "midia": {
                        "_id": "60b5f8c8d8f8f8f8f8f8f8fa",
                        "filename": "capa_evento.jpg",
                        "originalName": "imagem_capa.jpg",
                        "mimetype": "image/jpeg",
                        "size": 1024000,
                        "url": "/uploads/eventos/60b5f8c8d8f8f8f8f8f8f8/capa_evento.jpg",
                        "createdAt": "2024-01-01T12:00:00.000Z"
                      }
                    }
                  }
                },
                "multiplas_midias": {
                  "value": {
                    "statusCode": 201,
                    "message": "3 arquivo(s) de carrossel salvos com sucesso.",
                    "data": {
                      "evento": "60b5f8c8d8f8f8f8f8f8f8",
                      "tipo": "carrossel",
                      "midias": [
                        {
                          "_id": "60b5f8c8d8f8f8f8f8f8f8fa",
                          "filename": "carrossel_1.jpg",
                          "originalName": "imagem_1.jpg",
                          "mimetype": "image/jpeg",
                          "size": 1024000,
                          "url": "/uploads/eventos/60b5f8c8d8f8f8f8f8f8f8f8/carrossel_1.jpg",
                          "createdAt": "2024-01-01T12:00:00.000Z"
                        },
                        {
                          "_id": "60b5f8c8d8f8f8f8f8f8f8fb",
                          "filename": "carrossel_2.jpg",
                          "originalName": "imagem_2.jpg",
                          "mimetype": "image/jpeg",
                          "size": 1024000,
                          "url": "/uploads/eventos/60b5f8c8d8f8f8f8f8f8f8f8/carrossel_2.jpg",
                          "createdAt": "2024-01-01T12:00:00.000Z"
                        }
                      ]
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
                "arquivo_ausente": {
                  "value": {
                    "statusCode": 400,
                    "error": "Erro de validação",
                    "message": "Arquivo(s) de mídia não enviado(s). Use o campo 'file' para o tipo 'capa'.",
                    "details": []
                  }
                },
                "tipo_invalido": {
                  "value": {
                    "statusCode": 400,
                    "error": "Erro de validação",
                    "message": "Tipo de mídia deve ser: capa, video ou carrossel",
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
        "413": {
          "description": "Arquivo muito grande",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "examples": {
                "arquivo_grande": {
                  "value": {
                    "statusCode": 413,
                    "error": "Arquivo muito grande",
                    "message": "O arquivo excede o tamanho máximo permitido",
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
  "/eventos/{id}/midias": {
    "get": {
      "tags": ["Upload de Mídias"],
      "summary": "Listar todas as mídias do evento",
      "description": "Retorna todas as mídias associadas ao evento (capa, video e carrossel)",
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
          "description": "Mídias do evento retornadas com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MidiasEventoResponse"
              },
              "examples": {
                "sucesso": {
                  "value": {
                    "statusCode": 200,
                    "message": "Mídias do evento retornadas com sucesso.",
                    "data": {
                      "evento": "60b5f8c8d8f8f8f8f8f8f8f8",
                      "midiaCapa": [
                        {
                          "_id": "60b5f8c8d8f8f8f8f8f8f8fa",
                          "filename": "capa_evento.jpg",
                          "originalName": "imagem_capa.jpg",
                          "mimetype": "image/jpeg",
                          "size": 1024000,
                          "url": "/uploads/eventos/60b5f8c8d8f8f8f8f8f8f8f8/capa_evento.jpg",
                          "createdAt": "2024-01-01T12:00:00.000Z"
                        }
                      ],
                      "midiaVideo": [
                        {
                          "_id": "60b5f8c8d8f8f8f8f8f8f8fb",
                          "filename": "video_evento.mp4",
                          "originalName": "video_promocional.mp4",
                          "mimetype": "video/mp4",
                          "size": 10240000,
                          "url": "/uploads/eventos/60b5f8c8d8f8f8f8f8f8f8f8/video_evento.mp4",
                          "createdAt": "2024-01-01T12:00:00.000Z"
                        }
                      ],
                      "midiaCarrossel": [
                        {
                          "_id": "60b5f8c8d8f8f8f8f8f8f8fc",
                          "filename": "carrossel_1.jpg",
                          "originalName": "imagem_1.jpg",
                          "mimetype": "image/jpeg",
                          "size": 1024000,
                          "url": "/uploads/eventos/60b5f8c8d8f8f8f8f8f8f8f8/carrossel_1.jpg",
                          "createdAt": "2024-01-01T12:00:00.000Z"
                        },
                        {
                          "_id": "60b5f8c8d8f8f8f8f8f8f8fd",
                          "filename": "carrossel_2.jpg",
                          "originalName": "imagem_2.jpg",
                          "mimetype": "image/jpeg",
                          "size": 1024000,
                          "url": "/uploads/eventos/60b5f8c8d8f8f8f8f8f8f8f8/carrossel_2.jpg",
                          "createdAt": "2024-01-01T12:00:00.000Z"
                        }
                      ]
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
        "404": {
          "$ref": "#/components/responses/NotFoundError"
        },
        "500": {
          "$ref": "#/components/responses/InternalServerError"
        }
      }
    }
  },
  "/eventos/{id}/midia/capa": {
    "get": {
      "tags": ["Upload de Mídias"],
      "summary": "Listar mídia de capa do evento",
      "description": "Retorna a mídia de capa do evento",
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
          "description": "Capa do evento retornada com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MidiaCapaResponse"
              },
              "examples": {
                "sucesso": {
                  "value": {
                    "statusCode": 200,
                    "message": "Capa do evento retornada com sucesso.",
                    "data": {
                      "evento": "60b5f8c8d8f8f8f8f8f8f8f8",
                      "midiaCapa": [
                        {
                          "_id": "60b5f8c8d8f8f8f8f8f8f8fa",
                          "filename": "capa_evento.jpg",
                          "originalName": "imagem_capa.jpg",
                          "mimetype": "image/jpeg",
                          "size": 1024000,
                          "url": "/uploads/eventos/60b5f8c8d8f8f8f8f8f8f8f8/capa_evento.jpg",
                          "createdAt": "2024-01-01T12:00:00.000Z"
                        }
                      ]
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
        "404": {
          "$ref": "#/components/responses/NotFoundError"
        },
        "500": {
          "$ref": "#/components/responses/InternalServerError"
        }
      }
    }
  },
  "/eventos/{id}/midia/video": {
    "get": {
      "tags": ["Upload de Mídias"],
      "summary": "Listar mídia de vídeo do evento",
      "description": "Retorna a mídia de vídeo do evento",
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
          "description": "Vídeo do evento retornada com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MidiaVideoResponse"
              },
              "examples": {
                "sucesso": {
                  "value": {
                    "statusCode": 200,
                    "message": "Video do evento retornada com sucesso.",
                    "data": {
                      "evento": "60b5f8c8d8f8f8f8f8f8f8f8",
                      "midiaVideo": [
                        {
                          "_id": "60b5f8c8d8f8f8f8f8f8f8fb",
                          "filename": "video_evento.mp4",
                          "originalName": "video_promocional.mp4",
                          "mimetype": "video/mp4",
                          "size": 10240000,
                          "url": "/uploads/eventos/60b5f8c8d8f8f8f8f8f8f8f8/video_evento.mp4",
                          "createdAt": "2024-01-01T12:00:00.000Z"
                        }
                      ]
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
        "404": {
          "$ref": "#/components/responses/NotFoundError"
        },
        "500": {
          "$ref": "#/components/responses/InternalServerError"
        }
      }
    }
  },
  "/eventos/{id}/midia/carrossel": {
    "get": {
      "tags": ["Upload de Mídias"],
      "summary": "Listar mídia de carrossel do evento",
      "description": "Retorna as mídias de carrossel do evento",
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
          "description": "Carrossel do evento retornada com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MidiaCarrosselResponse"
              },
              "examples": {
                "sucesso": {
                  "value": {
                    "statusCode": 200,
                    "message": "Carrossel do evento retornada com sucesso.",
                    "data": {
                      "evento": "60b5f8c8d8f8f8f8f8f8f8f8",
                      "midiaCarrossel": [
                        {
                          "_id": "60b5f8c8d8f8f8f8f8f8f8fc",
                          "filename": "carrossel_1.jpg",
                          "originalName": "imagem_1.jpg",
                          "mimetype": "image/jpeg",
                          "size": 1024000,
                          "url": "/uploads/eventos/60b5f8c8d8f8f8f8f8f8f8f8/carrossel_1.jpg",
                          "createdAt": "2024-01-01T12:00:00.000Z"
                        },
                        {
                          "_id": "60b5f8c8d8f8f8f8f8f8f8fd",
                          "filename": "carrossel_2.jpg",
                          "originalName": "imagem_2.jpg",
                          "mimetype": "image/jpeg",
                          "size": 1024000,
                          "url": "/uploads/eventos/60b5f8c8d8f8f8f8f8f8f8f8/carrossel_2.jpg",
                          "createdAt": "2024-01-01T12:00:00.000Z"
                        }
                      ]
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
        "404": {
          "$ref": "#/components/responses/NotFoundError"
        },
        "500": {
          "$ref": "#/components/responses/InternalServerError"
        }
      }
    }
  },
  "/eventos/{eventoId}/midia/{tipo}/{midiaId}": {
    "delete": {
      "tags": ["Upload de Mídias"],
      "summary": "Deletar mídia do evento",
      "description": "Remove uma mídia específica do evento",
      "security": [
        {
          "bearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "eventoId",
          "in": "path",
          "required": true,
          "description": "ID do evento",
          "schema": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          }
        },
        {
          "name": "tipo",
          "in": "path",
          "required": true,
          "description": "Tipo de mídia",
          "schema": {
            "type": "string",
            "enum": ["capa", "video", "carrossel"]
          }
        },
        {
          "name": "midiaId",
          "in": "path",
          "required": true,
          "description": "ID da mídia",
          "schema": {
            "type": "string",
            "pattern": "^[0-9a-fA-F]{24}$"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Mídia deletada com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SuccessResponse"
              },
              "examples": {
                "sucesso": {
                  "value": {
                    "statusCode": 200,
                    "message": "Midia 'capa' do evento deletada com sucesso.",
                    "data": {
                      "evento": "60b5f8c8d8f8f8f8f8f8f8f8",
                      "midiaRemovida": {
                        "_id": "60b5f8c8d8f8f8f8f8f8f8fa",
                        "filename": "capa_evento.jpg",
                        "tipo": "capa"
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
  }
};

export default uploadPath;
