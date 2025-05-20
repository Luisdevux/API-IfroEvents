// src/utils/validators/schemas/zod/UsuarioSchema.js

import { z } from 'zod';

/** Definição da expressão regular para a senha
 * Padrão: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial
 * Tamanho mínimo: 8 caracteres
 **/
const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//Schema de Validação de Usuário
const UsuarioSchema = z.object({
  matricula: z.string().regex(/^\d+$/, 'Matrícula inválida!').max(13),
  nome: z.string().min(1, 'Campo nome é obrigatório.'),
  senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.').regex(senhaRegex, 'A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e no mínimo 8 caracteres.')
});

const UsuarioUpdateSchema = UsuarioSchema.partial();

export { UsuarioSchema, UsuarioUpdateSchema };