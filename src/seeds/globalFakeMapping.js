// /src/seeds/globalFakeMapping.js

import { faker } from "@faker-js/faker";
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import loadModels from './loadModels.js';

/**
 * Estrutura de mappings organizada por model.
 */
const fakeMappings = {
  
    common: {},

    // Mapping específico para o model Usuario

    Usuario: {
        matricula: () => faker.random.numeric(13),
        nome: () =>
        faker.firstName() +
        " " +
        faker.lastName() +
        " " +
        faker.lastName(),
        senha: () => faker.internet.password(),
    },

    // Mapping específico para o model Evento

    Evento: {
        titulo: () => faker.company.catchPhrase(),
        descricao: () => faker.lorem.sentence(),
        local: () => faker.location.city(),
        dataEvento: () => faker.date.future(),
        organizador: () => ({
          _id: new mongoose.Types.ObjectId(),
          nome: faker.person.fullName()
        }),
        linkInscricao: () => faker.internet.url(),
        eventoCriadoEm: () => faker.date.past(),
        tags: () => [faker.lorem.word(), faker.lorem.word()],
        categoria: () => faker.lorem.word(),
        status: () => faker.helpers.arrayElement(['ativo', 'inativo']),
        midiaVideo: () => [
            {
                _id: new mongoose.Types.ObjectId(),
                url:  faker.internet.url() + "/" + uuid() + ".mp4",
                tamanhoMb: faker.number.float({ max: 25 }),
                altura: 720,
                largura: 1280,
            },
        ],
        midiaCapa: () => [
            {
                _id: new mongoose.Types.ObjectId(),
                url:  faker.internet.url() + "/" + uuid() + ".jpg",
                tamanhoMb: faker.number.float({ max: 25 }),
                altura: 720,
                largura: 1280,
            },
        ],
        midiaCarrossel: () => [
            {
                _id: new mongoose.Types.ObjectId(),
                url:  faker.internet.url() + "/" + uuid() + ".jpg",
                tamanhoMb: faker.number.float({ max: 25 }),
                altura: 768,
                largura: 1024,
            },
        ],
    }
}

/**
 * Retorna o mapping global, consolidando os mappings comuns e específicos.
 * Nesta versão automatizada, carregamos os models e combinamos o mapping comum com o mapping específico de cada model.
 */
export async function getGlobalFakeMapping() {
    const models = await loadModels();
    let globalMapping = { ...fakeMappings.common };
  
    models.forEach(({ name }) => {
      if (fakeMappings[name]) {
        globalMapping = {
          ...globalMapping,
          ...fakeMappings[name],
        };
      }
    });
  
    return globalMapping;
  }
  
  /**
   * Função auxiliar para extrair os nomes dos campos de um schema,
   * considerando apenas os níveis superiores (campos aninhados são verificados pela parte antes do ponto).
   */
  function getSchemaFieldNames(schema) {
    const fieldNames = new Set();
    Object.keys(schema.paths).forEach((key) => {
      if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) return;
      const topLevel = key.split('.')[0];
      fieldNames.add(topLevel);
    });
    return Array.from(fieldNames);
  }
  
  /**
   * Valida se o mapping fornecido cobre todos os campos do model.
   * Retorna um array com os nomes dos campos que estiverem faltando.
   */
  function validateModelMapping(model, modelName, mapping) {
    const fields = getSchemaFieldNames(model.schema);
    const missing = fields.filter((field) => !(field in mapping));
    if (missing.length > 0) {
      console.error(
        `Model ${modelName} está faltando mapeamento para os campos: ${missing.join(', ')}`
      );
    } else {
      console.log(`Model ${modelName} possui mapeamento para todos os campos.`);
    }
    return missing;
  }
  
  /**
   * Executa a validação para os models fornecidos, utilizando o mapping específico de cada um.
   */
  async function validateAllMappings() {
    const models = await loadModels();
    let totalMissing = {};
  
    models.forEach(({ model, name }) => {
      // Combina os campos comuns com os específicos de cada model
      const mapping = {
        ...fakeMappings.common,
        ...(fakeMappings[name] || {}),
      };
      const missing = validateModelMapping(model, name, mapping);
      if (missing.length > 0) {
        totalMissing[name] = missing;
      }
    });
  
    if (Object.keys(totalMissing).length === 0) {
      console.log('globalFakeMapping cobre todos os campos de todos os models.');
      return true;
    } else {
      console.warn('Faltam mapeamentos para os seguintes models:', totalMissing);
      return false;
    }
  }
  
  // Executa a validação antes de prosseguir com o seeding ou outras operações
  validateAllMappings()
    .then((valid) => {
      if (valid) {
        console.log('Podemos acessar globalFakeMapping com segurança.');
        // Prossegue com o seeding ou outras operações
      } else {
        throw new Error('globalFakeMapping não possui todos os mapeamentos necessários.');
      }
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  
  export default getGlobalFakeMapping;
