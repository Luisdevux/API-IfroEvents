//models/Eventos.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import Usuario from './Usuario.js';

class Evento {
    constructor() {
        const eventoSchema = new mongoose.Schema(
            {
                titulo: { type: String, index: true, required: true },
                descricao: { type: String, required: true },
                local: { type: String, required: true },
                dataEvento: { type: Date, required: true },
                organizador: {
                    _id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'usuarios',
                        required: true,
                    },
                    nome: {
                        type: String,
                        required: true,
                    },
                },
                linkInscricao: { type: String, required: true},
                eventoCriadoEm: { type: Date, default: Date.now, required: true },
                tags: { type: [ String ], required: true, validate: { validator: (arr) => arr.length > 0, message: 'tags não pode ser vazio' }},
                categoria: { type: String, required: true },
                status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
                midiaVideo: {
                    type: [{
                        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                        url: { type: String, required: true },
                        tamanhoMb: {type: Number, required: true },
                        altura: { type: Number, required: true },
                        largura: { type: Number, required: true },
                    }],
                    validate: { validator: (arr) => arr.length > 0, message: 'midiaVideo não pode ser vazio' },
                },
                midiaCapa: {
                    type: [{
                        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                        url: { type: String, required: true },
                        tamanhoMb: { type: Number, required: true },
                        altura: { type: Number, required: true },
                        largura: { type: Number, required: true },
                    }],
                    validate: { validator: (arr) => arr.length > 0, message: 'midiaCapa não pode ser vazio' },
                },
                midiaCarrossel: {
                    type: [{
                        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                        url: { type: String, required: true },
                        tamanhoMb: { type: Number, required: true },
                        altura: { type: Number, required: true },
                        largura: { type: Number, required: true },
                    }],
                    validate: { validator: (arr) => arr.length > 0, message: 'midiaCarrossel não pode ser vazio' },
                },
            },
            {
                timestamps: { createdAt: 'eventoCriadoEm' },
                versionKey: false,
            }
        );

        eventoSchema.plugin(mongoosePaginate);

        this.model = mongoose.model('eventos', eventoSchema);
    }
}

export default new Evento().model;