//models/Eventos.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class Eventos {
    constructor() {
        const eventoSchema = new mongoose.Schema(
            {
                titulo: { type: String, index: true, required: true },
                descricao: { type: String, required: true },
                local: { type: String, required: true },
                dataEvento: { type: Date, required: true },
                organizadorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
                organizadorNome: { type: mongoose.Schema.Types.String, required: true },
                linkInscricao: { type: String, required: true},
                criadoEm: { type: Date, default: Date.now, required: true },
                tags: { type: [ String ], required: true },
                categoria: { type: String, required: true },
                midiaVideo: [{
                    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                    url: { type: String, required: true },
                    tamanhoMb: {type: Number, required: true },
                    altura: { type: Number, required: true },
                    largura: { type: Number, required: true }
                }],
                midiaCapa: [{
                    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                    url: { type: String, required: true },
                    tamanhoMb: { type: Number, required: true },
                    altura: { type: Number, required: true },
                    largura: { type: Number, required: true }
                }],
                midiaCarrossel: [{
                    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                    url: { type: String, required: true },
                    tamanhoMb: { type: Number, required: true },
                    altura: { type: Number, required: true },
                    largura: { type: Number, required: true }
                }]
            }
        );

        eventoSchema.plugin(mongoosePaginate);

        this.model = mongoose.model('Eventos', eventoSchema);
    }
}

export default new Eventos().model;