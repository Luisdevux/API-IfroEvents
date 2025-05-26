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
        // TODO: Substituir por autenticação real em quando implementada
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
        
        return CommonResponse.created(res, data);
    }

    // GET /eventos && GET /eventos/:id
    async listar(req, res) {
        const { id } = req.params;

        if(id) {
            objectIdSchema.parse(id);

            const data = await this.service.listar(id);

            if(!data) {
                throw new CustomError(messages.event.notFound(), HttpStatusCodes.NOT_FOUND.code);
            }

            return CommonResponse.success(res, data);
        }

        const data = await this.service.listar(req);
        return CommonResponse.success(res, data);

    }

    //PATCH /eventos/:id
    async alterar(req, res) {
        const { id } = req.params;
        objectIdSchema.parse(id);

        const parsedData = EventoUpdateSchema.parse(req.body);

        const data = await this.service.alterar(id, parsedData);

        return CommonResponse.success(res, data, 200, 'Evento atualizado com sucesso.');
    }

    // DELETE /eventos/:id
    async deletar(req, res) {
        const { id } = req.params || {};

        if(!id) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'id',
                details: [],
                customMessage: 'ID do evento é obrigatório para deletar.'
            });
        }

        objectIdSchema.parse(id);
        
        const data = await this.service.deletar(id);
        return CommonResponse.success(res, data, 200, 'Evento excluído com sucesso.');
    }
}

export default EventoController;