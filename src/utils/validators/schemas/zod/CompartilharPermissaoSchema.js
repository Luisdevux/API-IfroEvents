import { z } from 'zod';
import objectIdSchema from './ObjectIdSchema.js';

const CompartilharPermissaoSchema = z.object({
    usuarioId: objectIdSchema,
    expiraEm: z.coerce.date().refine((data) => data > new Date(), {
        message: 'A data de expiração deve ser uma data futura.'
    })
});

export default CompartilharPermissaoSchema;