//models/Usuario.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class Usuario {
    constructor() {
        const usuarioSchema = new mongoose.Schema(
            {
                matricula: { type: String, index: true, required: true},
                nome: { type: String, index: true, required: true },
                email: { type: String, unique: true, required: true },
                senha: { type: String, required: true },
                tokenUnico: { type: String, select: false }, // Token único para validação de email, recuperação de senha e autenticação
                refreshtoken: { type: String, select: false }, // Refresh token para geração de access token de autenticação longa duração 7 dias para invalidação
                accesstoken: { type: String, select: false }, // Refresh token para  autenticação curta longa 15 minutos para invalidação
                codigo_recupera_senha: { type: String, select: false, unique: true, sparse: true }, // Código de recuperação de senha, usado para validar a recuperação de senha do usuário
                exp_codigo_recupera_senha: { type: Date, select: false }, // Data de expiração do código de recuperação de senha, usado para validar a recuperação de senha do usuário
            },
            {
                timestamps: true,
                versionKey: false,
            }
        );

        usuarioSchema.plugin(mongoosePaginate);

        this.model = mongoose.model('usuarios', usuarioSchema);
    }
}

export default new Usuario().model;