// src/tests/unit/services/EventoService.test.js

import mongoose from "mongoose";
import EventoService from "../../../../src/services/EventoService";
import EventoRepository from "../../../repositories/EventoRepository";
import CustomError from "../../../../src/utils/helpers/CustomError.js";

// Mock do Mongoose
jest.mock('mongoose', () => {
    const actualMongoose = jest.requireActual('mongoose');
    return {
        ...actualMongoose,
        model: jest.fn(),
    };
});

// Mock do EventoRepository
jest.mock('../../../../src/repositories/EventoRepository.js', () => {
    return jest.fn().mockImplementation(() => ({
        cadastrar: jest.fn(),
        listar: jest.fn(),
        listarPorId: jest.fn(),
        alterar: jest.fn(),
        alterarStatus: jest.fn(),
        deletar: jest.fn(),
    }));
});

describe('EventoService', () => {
    let eventoService;
    let mookRepository;

    beforeEach(() => {
        mookRepository = new EventoRepository();
        eventoService = new UsuarioService();
        UsuarioService.repository = mookRepository;
    });

    afterEatch(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    // ---------------------------------
    // cadastrar
    // ---------------------------------
    describe('criar', () => {
        it('deve criar um novo evento', async () => {
            const mockUsuario = {
                _id: '6653d0b8e7b98e0014e6f009',
                nome: 'João da Silva',
            };
            
            const mockEventoData = {
                _id: new mongoose.Types.ObjectId(),
                titulo: "Semana de Inovação Tecnológica",
                descricao: "Uma semana dedicada a palestras e workshops sobre inovação tecnológica.",
                local: "Auditório Principal",
                dataEvento: new Date("2025-05-25"),
                organizador: {
                    _id: mockUsuario._id,
                    nome: mockUsuario.nome,
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

            mookRepository.criar.mockResolvedValue(mockEventoData);
        });
    });

})