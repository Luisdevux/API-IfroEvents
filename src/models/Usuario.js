//models/Usuario.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class Usuario {
    constructor() {
        const usuarioSchema = new mongoose.Schema(
            {
                matricula: { type: Number, required: true},
                nome: { type: String, index: true, required: true },
                senha: { type: String },
                tokenUnico: { type: Boolean, default: false }, // token único para recuperação de senha
                refreshtoken: { type: String, select: false },  // Refresh token para geração de access token de autenticação longa duração 7 dias para invalidação
                accesstoken: { type: String, select: false }, // Refresh token para  autenticação curta longa 15 minutos para invalidação
            }
        );
    }
}