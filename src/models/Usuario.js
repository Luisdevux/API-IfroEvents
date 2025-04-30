//models/Usuario.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class Usuario {
    constructor() {
        const usuarioSchema = new mongoose.Schema(
            {
                matricula: { type: Number, required: true},
                nome: { type: String, index: true, required: true },
                senha: { type: String, required: true },
            }
        );

        usuarioSchema.plugin(mongoosePaginate);

        this.model = mongoose.model('Usuario', usuarioSchema);
    }
}

export default new Usuario().model;