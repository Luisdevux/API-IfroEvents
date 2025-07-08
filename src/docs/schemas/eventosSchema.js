import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

// Definição original do eventosSchemas
const eventosSchemas = {
  EventoPost: {
    type: "object",
    properties: {
      titulo: {
        type: "string",
        description: "Título do evento",
        example: "Semana de Tecnologia 2025"
      },
      descricao: {
        type: "string",
        description: "Descrição do evento",
        example: "Evento de tecnologia com palestras e workshops"
      },
      local: {
        type: "string",
        description: "Local do evento",
        example: "Centro de Convenções"
      },
      dataEvento: {
        type: "string",
        format: "date-time",
        description: "Data e hora do evento",
        example: "2025-08-15T10:00:00.000Z"
      },
      linkInscricao: {
        type: "string",
        description: "Link para inscrição no evento",
        example: "https://exemplo.com/inscricao"
      },
      categoria: {
        type: "string",
        description: "Categoria do evento",
        example: "tecnologia"
      },
      tags: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Tags do evento",
        example: ["tecnologia", "inovação", "palestras"]
      },
      status: {
        type: "string",
        enum: ["ativo", "inativo"],
        description: "Status do evento",
        example: "inativo"
      }
    },
    required: ["titulo", "descricao", "local", "dataEvento", "linkInscricao", "categoria", "tags"]
  },
  EventoDetalhes: {
    type: "object",
    properties: {
      _id: {
        type: "string",
        description: "ID único do evento",
        example: "507f1f77bcf86cd799439011"
      },
      titulo: {
        type: "string",
        description: "Título do evento",
        example: "Semana de Tecnologia 2025"
      },
      descricao: {
        type: "string",
        description: "Descrição do evento",
        example: "Evento de tecnologia com palestras e workshops"
      },
      local: {
        type: "string",
        description: "Local do evento",
        example: "Centro de Convenções"
      },
      dataEvento: {
        type: "string",
        format: "date-time",
        description: "Data e hora do evento",
        example: "2025-08-15T10:00:00.000Z"
      },
      organizador: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "ID do organizador",
            example: "507f1f77bcf86cd799439011"
          },
          nome: {
            type: "string",
            description: "Nome do organizador",
            example: "João Silva"
          }
        }
      },
      linkInscricao: {
        type: "string",
        description: "Link para inscrição no evento",
        example: "https://exemplo.com/inscricao"
      },
      eventoCriadoEm: {
        type: "string",
        format: "date-time",
        description: "Data de criação do evento",
        example: "2025-07-08T21:35:10.742Z"
      },
      categoria: {
        type: "string",
        description: "Categoria do evento",
        example: "tecnologia"
      },
      tags: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Tags do evento",
        example: ["tecnologia", "inovação", "palestras"]
      },
      status: {
        type: "string",
        enum: ["ativo", "inativo"],
        description: "Status do evento",
        example: "inativo"
      },
      midiaVideo: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID da mídia",
              example: "507f1f77bcf86cd799439011"
            },
            url: {
              type: "string",
              description: "URL do vídeo",
              example: "/uploads/eventos/507f1f77bcf86cd799439011/video/video.mp4"
            },
            tamanhoMb: {
              type: "number",
              description: "Tamanho do arquivo em MB",
              example: 12.5
            },
            altura: {
              type: "number",
              description: "Altura do vídeo em pixels",
              example: 720
            },
            largura: {
              type: "number",
              description: "Largura do vídeo em pixels",
              example: 1280
            }
          }
        },
        description: "Mídias de vídeo do evento",
        example: []
      },
      midiaCapa: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID da mídia",
              example: "507f1f77bcf86cd799439011"
            },
            url: {
              type: "string",
              description: "URL da capa",
              example: "/uploads/eventos/507f1f77bcf86cd799439011/capa/capa.jpg"
            },
            tamanhoMb: {
              type: "number",
              description: "Tamanho do arquivo em MB",
              example: 2.5
            },
            altura: {
              type: "number",
              description: "Altura da imagem em pixels",
              example: 720
            },
            largura: {
              type: "number",
              description: "Largura da imagem em pixels",
              example: 1280
            }
          }
        },
        description: "Mídias de capa do evento",
        example: []
      },
      midiaCarrossel: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID da mídia",
              example: "507f1f77bcf86cd799439011"
            },
            url: {
              type: "string",
              description: "URL da imagem do carrossel",
              example: "/uploads/eventos/507f1f77bcf86cd799439011/carrossel/carrossel1.jpg"
            },
            tamanhoMb: {
              type: "number",
              description: "Tamanho do arquivo em MB",
              example: 1.8
            },
            altura: {
              type: "number",
              description: "Altura da imagem em pixels",
              example: 720
            },
            largura: {
              type: "number",
              description: "Largura da imagem em pixels",
              example: 1280
            }
          }
        },
        description: "Mídias do carrossel do evento",
        example: []
      },
      permissoes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            usuario: {
              type: "string",
              description: "ID do usuário com permissão",
              example: "507f1f77bcf86cd799439011"
            },
            permissao: {
              type: "string",
              enum: ["editar"],
              description: "Tipo de permissão",
              example: "editar"
            },
            expiraEm: {
              type: "string",
              format: "date-time",
              description: "Data de expiração da permissão",
              example: "2025-12-31T23:59:59.000Z"
            }
          }
        },
        description: "Permissões do evento",
        example: []
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Data de última atualização",
        example: "2025-07-08T21:35:10.742Z"
      }
    }
  },
  EventoUpdate: {
    type: "object",
    properties: {
      titulo: {
        type: "string",
        description: "Título do evento",
        example: "Semana de Tecnologia 2025 - Atualizado"
      },
      descricao: {
        type: "string",
        description: "Descrição do evento",
        example: "Evento de tecnologia com palestras e workshops atualizadas"
      },
      local: {
        type: "string",
        description: "Local do evento",
        example: "Centro de Convenções - Novo Local"
      },
      dataEvento: {
        type: "string",
        format: "date-time",
        description: "Data e hora do evento",
        example: "2025-08-20T14:00:00.000Z"
      },
      linkInscricao: {
        type: "string",
        description: "Link para inscrição no evento",
        example: "https://exemplo.com/nova-inscricao"
      },
      categoria: {
        type: "string",
        description: "Categoria do evento",
        example: "tecnologia"
      },
      tags: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Tags do evento",
        example: ["tecnologia", "inovação", "workshops"]
      }
    }
  },
  EventoStatusUpdate: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["ativo", "inativo"],
        description: "Novo status do evento",
        example: "ativo"
      }
    },
    required: ["status"]
  },
  EventoCompartilhamento: {
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "Email do usuário para compartilhar permissão",
        example: "usuario@exemplo.com"
      },
      permissao: {
        type: "string",
        enum: ["editar"],
        description: "Tipo de permissão",
        example: "editar"
      },
      expiraEm: {
        type: "string",
        format: "date-time",
        description: "Data de expiração da permissão",
        example: "2025-12-31T23:59:59.000Z"
      }
    },
    required: ["email", "expiraEm"]
  }
};

const addExamples = async () => {
  for (const key of Object.keys(eventosSchemas)) {
    const schema = eventosSchemas[key];
    if (schema.properties) {
      for (const [propKey, propertySchema] of Object.entries(schema.properties)) {
        if (!propertySchema.example) {
          propertySchema.example = await generateExample(propertySchema, propKey);
        }
      }
    }
    if (!schema.example) {
      schema.example = await generateExample(schema);
    }
  }
};

await addExamples();

export default eventosSchemas;
