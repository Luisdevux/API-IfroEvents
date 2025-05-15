// src/controllers/EventoController.js

import EventoService from '../services/EventoService.js';
import { EventoSchema, EventoUpdateSchema } from '../utils/validators/schemas/zod/EventoSchema.js'
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


class EventoController {
    constructor() {
        this.service = new EventoService();
    }

    // POST /eventos
    async cadastrar(req, res) {
        try {
            const usuarioSimulado = {
                _id: "682520e98e38a409ac2ac569",
                nome: "Usuário Teste"
            };

            const dadosEvento = {
                ...req.body,
                organizador: {
                    _id: usuarioSimulado._id,
                    nome: usuarioSimulado.nome
                }
            };
            const parseData = EventoSchema.parse(dadosEvento);
            const data = await this.service.cadastrar(parseData);
            return CommonResponse.success(res, data);
        } catch (error) {
            return CommonResponse.error(res, error);
        }
    }

    // GET /eventos && GET /eventos/:id
    async listar(req, res) {
        console.log("Estou no listar eventos!");

        const { id } = req.params;

        if(id) {
            objectIdSchema.parse(id);

            const data = await this.service.listar(id);

            if(!data) {
                throw new CustomError(messages.event.notFound(), HttpStatusCodes.NOT_FOUND);
            }

            return CommonResponse.success(res, data);
        }

        const data = await this.service.listar(req);
        return CommonResponse.success(res, data);

    }
}

export default EventoController;