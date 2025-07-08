import usuariosSchemas from "../schemas/usuariosSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";

const usuariosRoutes = {
    "/usuarios": {
        get: {
            tags: ["Usuários"],
            summary: "Lista todos os usuários",
            description: `
        + Caso de uso: Listagem de usuários para gerenciamento e consulta.
        
        + Função de Negócio:
            - Permitir à front-end, App Mobile e serviços server-to-server obter uma lista de usuários cadastrados.
            + Não possui parâmetros específicos, retorna todos os usuários ativos.

        + Regras de Negócio:
            - Apenas usuários autenticados podem acessar esta rota.
            - Senhas são removidas da resposta por segurança.
            - Retorna dados básicos dos usuários (ID, nome, email, status).
        
        + Resultado Esperado:
            - HTTP 200 OK com lista de usuários conforme **UsuarioDetalhes**.
        `,
            security: [{ bearerAuth: [] }],
            responses: {
                200: commonResponses[200]("#/components/schemas/UsuarioDetalhes"),
                401: commonResponses[401](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
        post: {
            tags: ["Usuários"],
            summary: "Cria um novo usuário",
            description: `
        + Caso de uso: Criação de usuário por administrador.
        
        + Função de Negócio:
            - Permitir à front-end, App Mobile e serviços server-to-server criar novos usuários no sistema.
            + Recebe no corpo da requisição:
                - Objeto conforme schema **UsuarioPost**, contendo campos como nome, email, senha, etc.

        + Regras de Negócio:
            - Validação de campos obrigatórios (nome, email, senha).
            - Verificação de unicidade para o email.
            - Senha é criptografada antes do armazenamento.
            - Status inicial é definido como 'ativo'.
            - Senha é removida da resposta por segurança.
        
        + Resultado Esperado:
            - HTTP 201 Created com corpo conforme **UsuarioDetalhes**, contendo dados do usuário criado (sem senha).
        `,
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { "$ref": "#/components/schemas/UsuarioPost" }
                    }
                }
            },
            responses: {
                201: commonResponses[201]("#/components/schemas/UsuarioDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        }
    },
    "/usuarios/{id}": {
        get: {
            tags: ["Usuários"],
            summary: "Obtém detalhes de um usuário",
            description: `
            + Caso de uso: Consulta de detalhes de usuário específico.
            
            + Função de Negócio:
                - Permitir à front-end, App Mobile ou serviços obter todas as informações de um usuário cadastrado.
                + Recebe como path parameter:
                    - **id**: identificador do usuário (MongoDB ObjectId).

            + Regras de Negócio:
                - Validação do formato do ID.
                - Verificar existência do usuário.
                - Senha é removida da resposta por segurança.
                - Checar permissões do solicitante para visualizar dados.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **UsuarioDetalhes**, contendo dados completos do usuário.
        `,
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "ID único do usuário"
                }
            ],
            responses: {
                200: commonResponses[200]("#/components/schemas/UsuarioDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
        patch: {
            tags: ["Usuários"],
            summary: "Atualiza um usuário (PATCH)",
            description: `
            + Caso de uso: Atualização parcial de dados do usuário.
            
            + Função de Negócio:
                - Permitir ao perfil administrador ou usuário autorizado modificar os campos desejados.
                + Recebe:
                    - **id** no path.  
                    - No corpo, objeto conforme **UsuarioPutPatch** com os campos a alterar.

            + Regras de Negócio:
                - Garantir unicidade de campos como email.
                - Email não pode ser alterado (é proibido).
                - Senha não pode ser alterada por esta rota.
                - Aplicar imediatamente alterações críticas (ex.: desativação inibe login).
                - Senha é removida da resposta por segurança.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **UsuarioDetalhes**, refletindo as alterações.
        `,
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "ID único do usuário"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { "$ref": "#/components/schemas/UsuarioPutPatch" }
                    }
                }
            },
            responses: {
                200: commonResponses[200]("#/components/schemas/UsuarioDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        }
    },
    "/usuarios/{id}/status": {
        patch: {
            tags: ["Usuários"],
            summary: "Atualiza o status de um usuário",
            description: `
            + Caso de uso: Ativação/desativação de usuário.
            
            + Função de Negócio:
                - Permitir ao perfil administrador alterar o status de um usuário (ativo/inativo).
                + Recebe:
                    - **id** no path.
                    - **status** no corpo da requisição.

            + Regras de Negócio:
                - Apenas valores 'ativo' ou 'inativo' são permitidos.
                - Usuário inativo não pode fazer login.
                - Mudança de status é registrada no sistema.

            + Resultado Esperado:
                - HTTP 200 OK com mensagem de confirmação da mudança de status.
        `,
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "ID único do usuário"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { "$ref": "#/components/schemas/UsuarioStatusUpdate" }
                    }
                }
            },
            responses: {
                200: commonResponses[200]("#/components/schemas/UsuarioDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        }
    }
};

export default usuariosRoutes;
