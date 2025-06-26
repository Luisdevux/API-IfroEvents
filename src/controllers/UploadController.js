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
    async adicionarMidia(req, res) {
        const { id: eventoId, tipo } = req.params;
        const usuarioLogado = req.user;
        
        const files = req.files; // Array de arquivos (carrossel)
        const file = req.file;   // Arquivo único (capa/video)

        const hasFiles = (tipo === 'carrossel' && files && files.length > 0) || (tipo !== 'carrossel' && file);

        if (!hasFiles) {
            const campoEsperado = tipo === 'carrossel' ? 'files' : 'file';
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: campoEsperado,
                customMessage: `Arquivo(s) de mídia não enviado(s). Use o campo '${campoEsperado}' para o tipo '${tipo}'.`
            });
        }

        let resultado;

        if (tipo === 'carrossel') {
            resultado = await this.service.adicionarMultiplasMidias(eventoId, tipo, files, usuarioLogado._id);
            return CommonResponse.created(res, resultado, `${files.length} arquivo(s) de carrossel salvos com sucesso.`);
        } else {
            resultado = await this.service.adicionarMidia(eventoId, tipo, file, usuarioLogado._id);
            return CommonResponse.created(res, resultado, `Mídia (${tipo}) salva com sucesso.`);
        }
    }

    // GET /eventos/:id/midias
    async listarTodasMidias(req, res) {
        const { id: eventoId } = req.params;

        const midias = await this.service.listarTodasMidias(eventoId);

        return CommonResponse.success(res, midias, 200, `Mídias do evento retornadas com sucesso.`);
    }

    // GET /eventos/:id/midia/capa
    async listarMidiaCapa(req, res) {
        const { id: eventoId } = req.params;

        const capa = await this.service.listarMidiaCapa(eventoId);

        return CommonResponse.success(res, capa, 200, `Capa do evento retornada com sucesso.`);
    }

    // GET /eventos/:id/midia/video
    async listarMidiaVideo(req, res) {
        const { id: eventoId } = req.params;

        const video = await this.service.listarMidiaVideo(eventoId);

        return CommonResponse.success(res, video, 200, `Video do evento retornada com sucesso.`);
    }

    // GET /eventos/:id/midia/carrossel
    async listarMidiaCarrossel(req, res) {
        const { id: eventoId } = req.params;

        const carrossel = await this.service.listarMidiaCarrossel(eventoId);

        return CommonResponse.success(res, carrossel, 200, `Carrossel do evento retornada com sucesso.`);
    }

    //DELETE /eventos/:id/midia/:tipo/:id
    async deletarMidia(req, res) {
        const { eventoId, tipo, midiaId } = req.params;
        const usuarioLogado = req.user;

        const evento = await this.service.deletarMidia(eventoId, tipo, midiaId, usuarioLogado._id);

        return CommonResponse.success(res, evento, 200, `Midia '${tipo}' do evento deletada com sucesso.`);
    }
}

export default UploadController;