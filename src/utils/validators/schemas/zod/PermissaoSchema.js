import { z } from 'zod';
import objectIdSchema from './ObjectIdSchema.js';

const permissaoSchema = z.object({
    usuarioId: objectIdSchema,
    permissao: z.enum(['editar']),
    expiraEm: z.coerce.date().refine((data) => data > new Date(), {
        message: 'A data de expiração deve ser uma data futura.'
    }),
});

export default permissaoSchema;