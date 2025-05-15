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

    async cadastrar() {
        console.log("Estou no cadastrar eventos!");
    }

    //Teste... Revisar Bem
    async listar(req, res) {
        console.log("Estou no listar eventos!");

        const { id } = req.params;

        if(id) {
            objectIdSchema.parse(id);

            const evento = await this.service.listar(id);

            if(!evento) {
                throw new CustomError(messages.event.notFound(), HttpStatusCodes.NOT_FOUND);
            }

            return CommonResponse.success(res, evento);
        }

        const eventos = await this.service.listar(req);
        return CommonResponse.success(res, eventos);

    }
}

export default EventoController;