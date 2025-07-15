import authPaths from "../paths/auth.js";
import usuariosPaths from "../paths/usuarios.js";
import eventosPaths from "../paths/eventos.js";
import uploadPaths from "../paths/upload.js";

import authSchemas from "../schemas/authSchema.js";
import usuariosSchemas from "../schemas/usuariosSchema.js";
import eventosSchemas from "../schemas/eventosSchema.js";
import uploadSchemas from "../schemas/uploadSchema.js";
import swaggerCommonResponses from "../schemas/swaggerCommonResponses.js";

// Função para definir as URLs do servidor dependendo do ambiente
const getServersInCorrectOrder = () => {
    const devUrl = { url: process.env.SWAGGER_DEV_URL || "http://localhost:5015" };
    const prodUrl = { url: process.env.SWAGGER_PROD_URL || "https://exemplo.ifroevents.com/IfroEvents" };

    if (process.env.NODE_ENV === "production") return [prodUrl, devUrl];
    else return [devUrl, prodUrl];
};

// Função para obter as opções do Swagger
const getSwaggerOptions = () => {
    return {
        swaggerDefinition: {
            openapi: "3.0.0",
            info: {
                title: "API PLATAFORMA DE DIVULGAÇÃO DE EVENTOS",
                version: "1.0.0",
                description: "API para gestão de eventos e divulgação \n\nÉ necessário autenticar com token JWT antes de utilizar a maioria das rotas, faça isso na rota /login com um email e senha válido. Esta API conta com refresh token, que pode ser obtido na rota /refresh, e com logout, que pode ser feito na rota /logout. Para mais informações, acesse a documentação.",
                contact: {
                    name: "Luis Felipe Lopes",
                    email: "devMaster@gmail.com",
                },
            },
            servers: getServersInCorrectOrder(),
            tags: [
                {
                    name: "Auth",
                    description: "Rotas para autenticação e autorização"
                },
                {
                    name: "Usuários",
                    description: "Rotas para gestão de usuários"
                },
                {
                    name: "Eventos",
                    description: "Rotas para gestão de eventos"
                },
                {
                    name: "Upload de Mídias",
                    description: "Rotas para upload de mídias dos eventos"
                }
            ],
            paths: {
                ...authPaths,
                ...usuariosPaths,
                ...eventosPaths,
                ...uploadPaths
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT"
                    }
                },
                schemas: {
                    ...authSchemas,
                    ...usuariosSchemas,
                    ...eventosSchemas,
                    ...uploadSchemas
                },
                responses: {
                    ...swaggerCommonResponses
                }
            },
            security: [{
                bearerAuth: []
            }]
        },
        apis: ["./src/routes/*.js"]
    };
};

export default getSwaggerOptions;
