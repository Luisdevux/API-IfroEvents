// src/tests/unit/utils/validators/schemas/zod/EventoSchema.test.js

import { EventoSchema, EventoUpdateSchema } from '../../../../../../utils/validators/schemas/zod/EventoSchema.js';
import mongoose from 'mongoose';

describe('EventoSchema', () => {
    const midiaValida = {
        url: 'https://example.com/image.jpg',
        tamanhoMb: 2.5,
        altura: 720,
        largura: 1280,
    };

    const eventoValido = {
        titulo: 'Semana Nacional de Ciência e Tecnologia',
        descricao: 'Evento anual de ciência e tecnologia',
        local: 'Campus Vilhena',
        dataEvento: new Date(),
        organizador: {
            _id: new mongoose.Types.ObjectId().toString(),
            nome: 'Usuario de Teste',
        },
        linkInscricao: 'https://example.com/inscricao',
        tags: ['ciência', 'tecnologia'],
        categoria: 'evento',
        status: 'ativo',
        midiaVideo: [ midiaValida ],
        midiaCapa: [ midiaValida ],
        midiaCarrossel: [ midiaValida ],
    };

    it('deve validar um evento com todos os campos corretos', () => {
        const resultado = EventoSchema.safeParse(eventoValido);
        expect(resultado.success).toBe(true);
    });

    describe(' validação de campos obrigatórios', () => {
        const obrigatorios = [ 'titulo', 'descricao', 'local', 'dataEvento', 'organizador', 'linkInscricao', 'tags', 'categoria', 'midiaVideo', 'midiaCapa', 'midiaCarrossel' ];

        obrigatorios.forEach(campo => {
            it(`deve falhar se o campo ${campo} não estiver presente`, () => {
                const eventoInvalido = { ...eventoValido };
                delete eventoInvalido[campo];
                const resultado = EventoSchema.safeParse(eventoInvalido);
                expect(resultado.success).toBe(false);
                expect(resultado.error.issues[0].path).toContain(campo);
            });
        });
    });

    it('deve falhar com URL inválido em linkInscricao', () => {
        const eventoInvalido = { ...eventoValido, linkInscricao: 'url-invalido' };
        const resultado = EventoSchema.safeParse(eventoInvalido);
        expect(resultado.success).toBe(false);
        expect(resultado.error.issues[0].message).toBe('Link de inscrição inválido');
    });
});