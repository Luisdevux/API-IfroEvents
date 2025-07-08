import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

// Definição original do uploadSchemas
const uploadSchemas = {
  UploadResponse: {
    type: "object",
    properties: {
      evento: {
        type: "string",
        description: "ID do evento",
        example: "507f1f77bcf86cd799439011"
      },
      tipo: {
        type: "string",
        enum: ["capa", "video", "carrossel"],
        description: "Tipo de mídia",
        example: "capa"
      },
      midia: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "ID da mídia",
            example: "507f1f77bcf86cd799439012"
          },
          url: {
            type: "string",
            description: "URL da mídia",
            example: "/uploads/capa/507f1f77bcf86cd799439011_1641234567890.jpg"
          },
          tamanhoMb: {
            type: "number",
            description: "Tamanho do arquivo em MB",
            example: 2.5
          },
          altura: {
            type: "number",
            description: "Altura da mídia em pixels",
            example: 720
          },
          largura: {
            type: "number",
            description: "Largura da mídia em pixels",
            example: 1280
          }
        }
      },
      midias: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID da mídia",
              example: "507f1f77bcf86cd799439012"
            },
            url: {
              type: "string",
              description: "URL da mídia",
              example: "/uploads/carrossel/507f1f77bcf86cd799439011_1641234567890.jpg"
            },
            tamanhoMb: {
              type: "number",
              description: "Tamanho do arquivo em MB",
              example: 1.8
            },
            altura: {
              type: "number",
              description: "Altura da mídia em pixels",
              example: 720
            },
            largura: {
              type: "number",
              description: "Largura da mídia em pixels",
              example: 1280
            }
          }
        },
        description: "Array de mídias (para carrossel)"
      }
    }
  },
  MidiasEventoResponse: {
    type: "object",
    properties: {
      evento: {
        type: "string",
        description: "ID do evento",
        example: "507f1f77bcf86cd799439011"
      },
      midiaCapa: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID da mídia",
              example: "507f1f77bcf86cd799439012"
            },
            url: {
              type: "string",
              description: "URL da capa",
              example: "/uploads/capa/507f1f77bcf86cd799439011_1641234567890.jpg"
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
        description: "Mídias de capa do evento"
      },
      midiaVideo: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID da mídia",
              example: "507f1f77bcf86cd799439013"
            },
            url: {
              type: "string",
              description: "URL do vídeo",
              example: "/uploads/video/507f1f77bcf86cd799439011_1641234567890.mp4"
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
        description: "Mídias de vídeo do evento"
      },
      midiaCarrossel: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID da mídia",
              example: "507f1f77bcf86cd799439014"
            },
            url: {
              type: "string",
              description: "URL da imagem do carrossel",
              example: "/uploads/carrossel/507f1f77bcf86cd799439011_1641234567890.jpg"
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
        description: "Mídias do carrossel do evento"
      }
    }
  },
  MidiaCapaResponse: {
    type: "object",
    properties: {
      evento: {
        type: "string",
        description: "ID do evento",
        example: "507f1f77bcf86cd799439011"
      },
      midiaCapa: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID da mídia",
              example: "507f1f77bcf86cd799439012"
            },
            url: {
              type: "string",
              description: "URL da capa",
              example: "/uploads/capa/507f1f77bcf86cd799439011_1641234567890.jpg"
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
        description: "Mídias de capa do evento"
      }
    }
  },
  MidiaVideoResponse: {
    type: "object",
    properties: {
      evento: {
        type: "string",
        description: "ID do evento",
        example: "507f1f77bcf86cd799439011"
      },
      midiaVideo: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID da mídia",
              example: "507f1f77bcf86cd799439013"
            },
            url: {
              type: "string",
              description: "URL do vídeo",
              example: "/uploads/video/507f1f77bcf86cd799439011_1641234567890.mp4"
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
        description: "Mídias de vídeo do evento"
      }
    }
  },
  MidiaCarrosselResponse: {
    type: "object",
    properties: {
      evento: {
        type: "string",
        description: "ID do evento",
        example: "507f1f77bcf86cd799439011"
      },
      midiaCarrossel: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID da mídia",
              example: "507f1f77bcf86cd799439014"
            },
            url: {
              type: "string",
              description: "URL da imagem do carrossel",
              example: "/uploads/carrossel/507f1f77bcf86cd799439011_1641234567890.jpg"
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
        description: "Mídias do carrossel do evento"
      }
    }
  }
};

const addExamples = async () => {
  for (const key of Object.keys(uploadSchemas)) {
    const schema = uploadSchemas[key];
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

export default uploadSchemas;
