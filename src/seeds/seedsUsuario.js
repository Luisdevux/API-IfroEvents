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
// 2) SEED de Usuários
// ----------------------------------------------------------------------------

async function seedUsuarios() {
    // Remove todos os usuários antes de criar novos
    await Usuario.deleteMany();

    const usuarioFixo = [
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

    await Usuario.collection.insertMany(usuarioFixo);
    console.log(usuarioFixo.length + " Usuários fixos inseridos com sucesso!");

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

// ----------------------------------------------------------------------------
// 3) Execução final (ordem de chamada)
// ----------------------------------------------------------------------------
async function main() {
    try {
        // 1) Seed de usuários
        const usuarios = await seedUsuarios();
        
        // 2) Seed de eventos (utilizando os usuários criados)
        await seedEventos(usuarios);

        console.log(">>>> SEED FINALIZADO COM SUCESSO! <<<<");
    } catch (err) {
        console.log("Erro ao executar SEED:", err);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
}

// Função que executa tudo
main();