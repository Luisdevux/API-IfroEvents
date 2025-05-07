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

        const usuarioFixo = [
            {
                matricula: "2024103070017",
                nome: "Deivid",
                senha: '1234abcd',
            },
            {
                matricula: "2024103070011",
                nome: "Kauã",
                senha: '1234abcd',
            }
        
        ]
    }
    // teste