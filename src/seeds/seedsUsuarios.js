// /src/seeds/seedsUsuarios.js

import "dotenv/config";
import mongoose from "mongoose";

import { faker } from "@faker-js/faker";

// Depêndencias
import { randomBytes as _randomBytes } from "crypto";

// Conexão com o banco
import DbConnect from "../config/DbConnect";

// Importação das Models
import Usuario from "../models/Usuario";

//Mapeador
import globalFakeMapping from "./globalFakeMapping";


// ----------------------------------------------------------------------------
// 1) Conectar ao banco de dados
// ----------------------------------------------------------------------------
await DbConnect.conectar();

// ----------------------------------------------------------------------------
// 2) SEED de Usuários
// ----------------------------------------------------------------------------

async function seedUsuarios() {
    // Remove antes de criar os usuários
    await Usuario.deleteMany();

    const usuariosFixos = [
        {
            matricula: "2024103070017",
            nome: "Deivid",
            senha: '1234abcd'
        },
        {
            matricula: "2024103070011",
            nome: "Kauã",
            senha: '1234abcd'
        }
    ];

    await Usuario.collection.insertMany(usuariosFixos);
    console.log(usuariosFixos.length + " Usuários fixos inseridos com sucesso!");

    // Gera usuários aleatórios mantendo apenas os mesmos campos
    const usuariosAleatorios = [];

    for (let i = 0; i < 20; i++) {
        usuariosAleatorios.push({
            matricula: `2024${faker.number.int({ min: 1000, max: 9999 })}${faker.number.int({ min: 1000, max: 9999 })}`,
            nome: faker.person.fullName(),
            senha: _randomBytes(8).toString('hex')
        });
    }

    await Usuario.collection.insertMany(usuariosAleatorios);
    console.log(usuariosAleatorios.length + " Usuários aleatórios inseridos com sucesso!");

    return await Usuario.find(); // Retorna todos os usuários para uso no seed de eventos
}

export default seedUsuarios;