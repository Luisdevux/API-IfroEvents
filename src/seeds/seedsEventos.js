// /src/seeds/seedsEventos.js

import "dotenv/config";
import mongoose from "mongoose";

import { faker } from "@faker-js/faker";

// Depêndencias
import { randomBytes as _randomBytes } from "crypto";

// Conexão com o banco
import DbConnect from "../config/DbConnect";

// Importação das Models
import Usuario from "../models/Usuario";
import Evento from "../models/Evento";

//Mapeador
import globalFakeMapping from "./globalFakeMapping";


// ----------------------------------------------------------------------------
// 1) Conectar ao banco de dados
// ----------------------------------------------------------------------------
await DbConnect.conectar();

// ----------------------------------------------------------------------------
// 2) SEED de Eventos
// ----------------------------------------------------------------------------

async function seedEventos(usuarios) {
    //Remove antes de criar os eventos
    await Evento.deleteMany();

    const eventosFixos = [
        {
            titulo: "Semana de Inovação Tecnológica",
            descricao: "Uma semana dedicada a palestras e workshops sobre inovação tecnológica.",
            local: "Auditório Principal",
            dataEvento: new Date("2025-05-25"),
            organizador: {
                _id: usuarios[0]._id,
                nome: usuarios[0].nome
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
        },
        {
            titulo: "Semana de Interclasse Ifro",
            descrição: "Semana de Interclasse do Ifro, com competições e atividades esportivas.",
            local: "Quadra Poliesportiva",
            dataEvento: new Date("2025-05-15"),
            organizador: {
                _id: usuarios[0]._id,
                nome: usuarios[0].nome
            },
            linkInscricao: "https://forms.gle/exemplo",
            eventoCriadoEm: new Date(),
            tags: ["Esporte", "Interclasse"],
            categoria: "Esportivo",
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
        }
    ];

    await Evento.collection.insertMany(eventosFixos);
    console.log(eventosFixos.length + " Eventos fixos inseridos com sucesso!");

    // Gera eventos aleatórios
    const eventosAleatorios = [];

    for(let i = 0; i < 50; i++) {
        const titulo = faker.company.catchPhrase();
        const descricao = faker.lorem.sentence();
        const local = faker.location.city();
        const dataEvento = faker.date.future();
        const eventoCriadoEm = faker.date.past();
        const linkInscricao = faker.internet.url();
        const tags = [faker.lorem.word(), faker.lorem.word()];
        const categoria = faker.lorem.word();
        const status = faker.helpers.arrayElement(['ativo', 'inativo']);
        const midiaVideo = [
            {
                _id: new mongoose.Types.ObjectId(),
                url: faker.internet.url() + "/" + _randomBytes(16).toString('hex') + ".mp4",
                tamanhoMb: faker.number.float({ max: 25 }),
                altura: 720,
                largura: 1280,
            },
        ];
        const midiaCapa = [
            {
                _id: new mongoose.Types.ObjectId(),
                url: faker.internet.url() + "/" + _randomBytes(16).toString('hex') + ".jpg",
                tamanhoMb: faker.number.float({ max: 25 }),
                altura: 720,
                largura: 1280,
            },
        ];
        const midiaCarrossel = [
            {
                _id: new mongoose.Types.ObjectId(),
                url: faker.internet.url() + "/" + _randomBytes(16).toString('hex') + ".jpg",
                tamanhoMb: faker.number.float({ max: 25 }),
                altura: 768,
                largura: 1024,
            },
        ];

        eventosAleatorios.push({
            titulo,
            descricao,
            local,
            dataEvento,
            organizador: {
                _id: usuarios[0]._id,
                nome: usuarios[0].nome
            },
            linkInscricao,
            eventoCriadoEm,
            tags,
            categoria,
            status,
            midiaVideo,
            midiaCapa,
            midiaCarrossel,
        });
    };

    await Evento.collection.insertMany(eventosAleatorios);
    console.log(eventosAleatorios.length + "Eventos aleatórios inseridos com sucesso!");
}

export default seedEventos;