// /src/seeds/seeds.js

import "dotenv/config";
import mongoose from "mongoose";

import { faker } from "@faker-js/faker";

import DbConnect from "../config/DbConnect";

// Importação das Models
import Usuario from "../models/Usuario";
import Evento from "../models/Evento";

await DbConnect.conectar();
