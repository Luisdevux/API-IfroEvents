// src/controllers/UploadController.js

import UploadService from '../services/UploadService.js';
import {
    CommonResponse,
    CustomError,
    HttpStatusCodes,
    errorHandler,
    messages,
    StatusService,
    asyncWrapper
} from '../utils/helpers/index.js';

class UploadController {
    constructor() {
        this.service = new UploadService();
    }

    // POST /eventos/:id/midia/:tipo
    async uploadMidia(req, res) {
        const { id: eventoId, tipo } = req.params;
        const file = req.file;

        if(!file) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST,
                errorType: 'validationError',
                field: 'file',
                customMessage: `Arquivo de mídia não enviado.`
            });
        }

        const midia = await this.service.salvarMidia(eventoId, tipo, file);

        return CommonResponse.success(res, midia, 201, `Midia (${tipo}) salva com sucesso.`);
    }
}

export default UploadController;