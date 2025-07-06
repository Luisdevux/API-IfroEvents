// /src/seeds/seedsUsuarios.js

import "dotenv/config";

// Depêndencias
import { randomBytes as _randomBytes } from "crypto";
import bcrypt from "bcryptjs";

// Conexão com o banco
import DbConnect from "../config/DbConnect.js";

// Importação das Models
import Usuario from "../models/Usuario.js";

//Mapeador
import globalFakeMapping from "./globalFakeMapping.js";


// ----------------------------------------------------------------------------
// 1) Conectar ao banco de dados
// ----------------------------------------------------------------------------
await DbConnect.conectar();

// ----------------------------------------------------------------------------
// 2) Funções auxiliares
// ----------------------------------------------------------------------------
// Função para gerar senha criptografada
export function gerarSenhaHash() {
  return bcrypt.hashSync('ABab@123456', 8);
}

// ----------------------------------------------------------------------------
// 3) SEED de Usuários
// ----------------------------------------------------------------------------

async function seedUsuarios() {
    // Remove antes de criar os usuários
    await Usuario.deleteMany();

    const usuariosFixos = [
        {
            matricula: "2024103070022",
            nome: "Usuario Teste",
            email: "devTeste@gmail.com",
            senha: gerarSenhaHash(),
            status: "ativo"
        },
        {
            matricula: "2024103070030",
            nome: "Luis Felipe Lopes",
            email: "devMaster@gmail.com",
            senha: gerarSenhaHash(),
            status: "ativo" 
        }
    ];

    await Usuario.collection.insertMany(usuariosFixos);
    console.log(`${usuariosFixos.length} Usuários fixos inseridos com sucesso!`);

    // Const que recebe o mapeamento global para ser usado na criação dos usuarios aleatórios
    const mapping = await globalFakeMapping();

    // Gera usuários aleatórios mantendo apenas os mesmos campos
    const usuariosAleatorios = [];

    for (let i = 0; i < 20; i++) {
        usuariosAleatorios.push({
            matricula: mapping.matricula(),
            nome: mapping.nome(),
            email: mapping.email(),
            senha: gerarSenhaHash(),
            status: mapping.status()
        });
    }

    await Usuario.collection.insertMany(usuariosAleatorios);
    console.log(`${usuariosAleatorios.length} Usuários aleatórios inseridos com sucesso!`);

    return await Usuario.find(); // Retorna todos os usuários para uso no seed de eventos
}

export default seedUsuarios;