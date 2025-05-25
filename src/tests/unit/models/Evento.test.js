// src/tests/unit/models/Evento.test.js
import mongoose from "mongoose";
import Usuario from "../../../models/Usuario";
import Evento from "../../../models/Evento";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

// Configuração antes de todos os testes
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        // Opções de conexão não são necessárias no Mongoose 6+
    });

    await mongoose.model('eventos').createIndexes();
});

// Limpeza após todos os testes
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// Limpeza após cada teste para garantir isolamento
afterEach(async () => {
    jest.clearAllMocks();
    await Usuario.deleteMany({});
    await Evento.deleteMany({});
});

describe('Modelo de Evento', () => {
    it('Deve criar um evento com dados válidos e referência ao usuário válida', async () => {
        const usuario = await Usuario.create({
            matricula: "2024103070030",
            nome: "Usuário Teste",
            senha: "SenhaTeste1@"
        });

        const eventData = {
            titulo: "Semana de Inovação Tecnológica",
            descricao: "Uma semana dedicada a palestras e workshops sobre inovação tecnológica.",
            local: "Auditório Principal",
            dataEvento: new Date("2025-05-25"),
            organizador: {
                _id: usuario._id,
                nome: usuario.nome
            },
            linkInscricao: "https://forms.gle/exemplo",
            eventoCriadoEm: new Date(),
            tags: ["Tecnologia", "Inovação"],
            categoria: "Tecnologia",
            status: "ativo",
            midiaVideo: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "videoApresentativo.mp4",
                    tamanhoMb: 12.3,
                    altura: 720,
                    largura: 1280,
                },
            ],
            midiaCapa: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "capaEvento.jpg",
                    tamanhoMb: 2.5,
                    altura: 720,
                    largura: 1280,
                },
            ],
            midiaCarrossel: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "carrosselEvento1.jpg",
                    tamanhoMb: 1.5,
                    altura: 768,
                    largura: 1024,
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "carrosselEvento2.jpg",
                    tamanhoMb: 1.8,
                    altura: 768,
                    largura: 1024,
                },
            ],
        };

        const event = new Evento(eventData);
        await event.save();

        const savedEvent = await Evento.findById(event._id);

        expect(savedEvent.titulo).toBe(eventData.titulo);
        expect(savedEvent.descricao).toBe(eventData.descricao);
        expect(savedEvent.local).toBe(eventData.local);
        expect(savedEvent.dataEvento).toEqual(eventData.dataEvento);
        expect(savedEvent.organizador._id.toString()).toBe(eventData.organizador._id.toString());
        expect(savedEvent.organizador.nome).toBe(eventData.organizador.nome);
        expect(savedEvent.linkInscricao).toBe(eventData.linkInscricao);
        expect(savedEvent.eventoCriadoEm).toBeInstanceOf(Date);
        expect(savedEvent.tags).toEqual(expect.arrayContaining(eventData.tags));
        expect(savedEvent.categoria).toBe(eventData.categoria);
        expect(savedEvent.status).toBe(eventData.status);
        expect(savedEvent.midiaVideo[0]).toMatchObject({
            url: eventData.midiaVideo[0].url,
            tamanhoMb: eventData.midiaVideo[0].tamanhoMb,
            altura: eventData.midiaVideo[0].altura,
            largura: eventData.midiaVideo[0].largura
        });
        expect(savedEvent.midiaCapa[0]).toMatchObject({
            url: eventData.midiaCapa[0].url,
            tamanhoMb: eventData.midiaCapa[0].tamanhoMb,
            altura: eventData.midiaCapa[0].altura,
            largura: eventData.midiaCapa[0].largura
        });
        expect(savedEvent.midiaCarrossel[0]).toMatchObject({
            url: eventData.midiaCarrossel[0].url,
            tamanhoMb: eventData.midiaCarrossel[0].tamanhoMb,
            altura: eventData.midiaCarrossel[0].altura,
            largura: eventData.midiaCarrossel[0].largura
        });
    });


    it('Deve falhar ao criar um evento sem um dos campos obrigatórios (titulo)', async () => {
        const usuario = await Usuario.create({
            matricula: "2024103070030",
            nome: "Usuário Teste",
            senha: "SenhaTeste1@"
        });
        
        const eventData = {
            descricao: "Uma semana dedicada a palestras e workshops sobre inovação tecnológica.",
            local: "Auditório Principal",
            dataEvento: new Date("2025-05-25"),
            organizador: {
                _id: usuario._id,
                nome: usuario.nome
            },
            linkInscricao: "https://forms.gle/exemplo",
            eventoCriadoEm: new Date(),
            tags: ["Tecnologia", "Inovação"],
            categoria: "Tecnologia",
            status: "ativo",
            midiaVideo: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "videoApresentativo.mp4",
                    tamanhoMb: 12.3,
                    altura: 720,
                    largura: 1280,
                },
            ],
            midiaCapa: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "capaEvento.jpg",
                    tamanhoMb: 2.5,
                    altura: 720,
                    largura: 1280,
                },
            ],
            midiaCarrossel: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "carrosselEvento1.jpg",
                    tamanhoMb: 1.5,
                    altura: 768,
                    largura: 1024,
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "carrosselEvento2.jpg",
                    tamanhoMb: 1.8,
                    altura: 768,
                    largura: 1024,
                },
            ],
        };
        
        const event = new Evento(eventData);
        await expect(event.save()).rejects.toThrowErrorMatchingSnapshot();
    });

    
    it('Deve permitir os valores válidos de status (ativo, inativo)', async () => {
        const usuario = await Usuario.create({
            matricula: "2024103070033",
            nome: "Organizador",
            senha: "SenhaTeste1@"
        });

        const statusValidos = ['ativo', 'inativo'];

        for (const status of statusValidos) {
            const evento = await Evento.create({
                titulo: "Semana de Inovação Tecnológica",
                descricao: "Uma semana dedicada a palestras e workshops sobre inovação tecnológica.",
                local: "Auditório Principal",
                dataEvento: new Date("2025-05-25"),
                organizador: {
                    _id: usuario._id,
                    nome: usuario.nome
                },
                linkInscricao: "https://forms.gle/exemplo",
                eventoCriadoEm: new Date(),
                tags: ["Tecnologia", "Inovação"],
                categoria: "Tecnologia",
                status,
                midiaVideo: [
                    {
                        _id: new mongoose.Types.ObjectId(),
                        url: "videoApresentativo.mp4",
                        tamanhoMb: 12.3,
                        altura: 720,
                        largura: 1280,
                    },
                ],
                midiaCapa: [
                    {
                        _id: new mongoose.Types.ObjectId(),
                        url: "capaEvento.jpg",
                        tamanhoMb: 2.5,
                        altura: 720,
                        largura: 1280,
                    },
                ],
                midiaCarrossel: [
                    {
                        _id: new mongoose.Types.ObjectId(),
                        url: "carrosselEvento1.jpg",
                        tamanhoMb: 1.5,
                        altura: 768,
                        largura: 1024,
                    },
                    {
                        _id: new mongoose.Types.ObjectId(),
                        url: "carrosselEvento2.jpg",
                        tamanhoMb: 1.8,
                        altura: 768,
                        largura: 1024,
                    },
                ],
            });

            expect(evento.status).toBe(status);
        }
    });

    
    it('Deve falhar ao criar evento com status inválido', async () => {
        const usuario = await Usuario.create({
            matricula: "2024103070031",
            nome: "Organizador",
            senha: "SenhaTeste1@"
        });

        const eventData = {
            titulo: "Semana de Inovação Tecnológica",
            descricao: "Uma semana dedicada a palestras e workshops sobre inovação tecnológica.",
            local: "Auditório Principal",
            dataEvento: new Date("2025-05-25"),
            organizador: {
                _id: usuario._id,
                nome: usuario.nome
            },
            linkInscricao: "https://forms.gle/exemplo",
            eventoCriadoEm: new Date(),
            tags: ["Tecnologia", "Inovação"],
            categoria: "Tecnologia",
            status: "teste",  // Inválido
            midiaVideo: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "videoApresentativo.mp4",
                    tamanhoMb: 12.3,
                    altura: 720,
                    largura: 1280,
                },
            ],
            midiaCapa: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "capaEvento.jpg",
                    tamanhoMb: 2.5,
                    altura: 720,
                    largura: 1280,
                },
            ],
            midiaCarrossel: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "carrosselEvento1.jpg",
                    tamanhoMb: 1.5,
                    altura: 768,
                    largura: 1024,
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "carrosselEvento2.jpg",
                    tamanhoMb: 1.8,
                    altura: 768,
                    largura: 1024,
                },
            ],
        };

        const evento = new Evento(eventData);
        await expect(evento.save()).rejects.toThrowErrorMatchingSnapshot();
    });

    
    it('Deve preencher campo eventoCriadoEm automaticamente', async () => {
        const usuario = await Usuario.create({
            matricula: "2024103070032",
            nome: "Organizador",
            senha: "SenhaTeste1@"
        });

        const evento = await Evento.create({
            titulo: "Semana de Inovação Tecnológica",
            descricao: "Uma semana dedicada a palestras e workshops sobre inovação tecnológica.",
            local: "Auditório Principal",
            dataEvento: new Date("2025-05-25"),
            organizador: {
                _id: usuario._id,
                nome: usuario.nome
            },
            linkInscricao: "https://forms.gle/exemplo",
            tags: ["Tecnologia", "Inovação"],
            categoria: "Tecnologia",
            status: "ativo",
            midiaVideo: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "videoApresentativo.mp4",
                    tamanhoMb: 12.3,
                    altura: 720,
                    largura: 1280,
                },
            ],
            midiaCapa: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "capaEvento.jpg",
                    tamanhoMb: 2.5,
                    altura: 720,
                    largura: 1280,
                },
            ],
            midiaCarrossel: [
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "carrosselEvento1.jpg",
                    tamanhoMb: 1.5,
                    altura: 768,
                    largura: 1024,
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    url: "carrosselEvento2.jpg",
                    tamanhoMb: 1.8,
                    altura: 768,
                    largura: 1024,
                },
            ],
        });

        expect(evento.eventoCriadoEm).toBeInstanceOf(Date);
    });
});