import request from 'supertest';
import app from '../../app.js';

import DbConnect from '../../config/DbConnect.js';
import mongoose from 'mongoose';

beforeAll(async () => {
    await DbConnect.conectar();
});

afterAll(async () => {
    await mongoose.connection.close();
});

it("deve retornar uma lista de eventos existentes", async() => {
    const resposta = await 
        request(app)
        .get('/eventos/');
        expect(resposta.status).toBe(200);
});

// TODO: Para funcionar tive que comentar o await DbConnect no app.js, revisar dps a causa!

// npm run test src/tests/routes/eventoRoutes.test.js