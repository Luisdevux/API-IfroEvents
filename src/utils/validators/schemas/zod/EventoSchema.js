// src/utils/validators/schemas/zod/EventoSchema.js

import { z } from 'zod';
import objectIdSchema from './ObjectIdSchema.js';

// Schema de Validação das Mídias
const MidiaSchema = z.object({
    url: z.string().url(),
    tamanhoMb: z.number().positive(),
    altura: z.number().positive(),
    largura: z.number().positive()
})

// Schema de Validação de Evento
const EventoSchema = z.object({
    titulo: z.string().min(1, 'Campo Nome é obrigatório'),
    descricao: z.string().min(1, 'Campo descrição é obrigatório'),
    local: z.string().min(1, 'Campo local é obrigatório'),
    dataEvento: z.coerce.date({ required_error: 'Campo data é obrigatório' }),
    organizador: z.object({
        _id: objectIdSchema,
        nome: z.string().min(1)
    }),
    linkInscricao: z.string().url('Link de inscrição inválido'),
    tags: z.array(z.string().min(1)).min(1, 'Insira pelo menos uma tag'),
    categoria: z.string().min(1, 'Campo categoria é obrigatório'),
    status: z.enum(['ativo', 'inativo']).default('ativo'),
    midiaVideo: z.array(MidiaSchema).min(1, 'Campo mídia é obrigatório'),
    midiaCapa: z.array(MidiaSchema).min(1, 'Campo mídia é obrigatório'),
    midiaCarrossel: z.array(MidiaSchema).min(1, 'Campo mídia é obrigatório'),
});

const EventoUpdateSchema = EventoSchema.partial();

export { EventoSchema, EventoUpdateSchema };