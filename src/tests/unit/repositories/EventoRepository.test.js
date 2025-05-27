// src/tests/unit/repository/EventoRepository.test.js

import EventoRepository from '../../../../src/repositories/EventoRepository.js';
import EventoModel from '../../../../src/models/Evento.js';
import { CustomError, messages } from '../../../../src/utils/helpers/index.js';

// Mock do modelo Evento do Mongoose
jest.mock('../../../../src/models/Evento.js');

// Mock de messages e CustomError com template literals corretos
jest.mock('../../../../src/utils/helpers/index.js', () => ({
  CustomError: class extends Error {
    constructor({ statusCode, errorType, field, details, customMessage }) {
      super(customMessage);
      this.statusCode = statusCode;
      this.errorType = errorType;
      this.field = field;
      this.details = details;
    }
  },
  messages: {
    error: {
      internalServerError: (resource) => `Erro interno no ${resource}`,
      resourceNotFound: (resource) => `${resource} não encontrado`
    }
  }
}));

describe('EventoRepository', () => {
  let eventoRepository;

beforeEach(() => {
    eventoRepository = new EventoRepository();
});

afterEach(() => {
    jest.clearAllMocks();
});


describe('criar', () => {
    it('deve criar um novo evento com sucesso', async () => {
        const dadosEvento = { titulo: 'Novo Evento', data: new Date() };
        EventoModel.create.mockResolvedValue(dadosEvento);
  
        const result = await eventoRepository.cadastrar(dadosEvento);
  
        expect(result).toEqual(dadosEvento);
        expect(EventoModel.create).toHaveBeenCalledWith(dadosEvento);
    });

    
    it('deve lançar erro ao falhar criação', async () => {
        EventoModel.create.mockRejectedValue(new Error('Erro ao criar'));
  
        await expect(eventoRepository.cadastrar({})).rejects.toThrow(CustomError);
    });
 

    it('deve lançar erro se dados do evento forem inválidos', async () => {
        // Exemplo se passar dados nulos ou vazio
        await expect(eventoRepository.cadastrar(null)).rejects.toThrow();
        await expect(eventoRepository.cadastrar(undefined)).rejects.toThrow();
        expect(EventoModel.create).not.toHaveBeenCalled();
    });
});


describe('buscarPorId', () => {
    it('deve encontrar um evento por ID', async () => {
      const mockEvento = { _id: 'abc123', titulo: 'Evento Teste' };
      EventoModel.findById.mockResolvedValue(mockEvento);

      const result = await eventoRepository.listarPorId('abc123');

      expect(result).toEqual(mockEvento);
      expect(EventoModel.findById).toHaveBeenCalledWith('abc123');
    });

    it('deve lançar erro se o evento não for encontrado', async () => {
      EventoModel.findById.mockResolvedValue(null);

      await expect(eventoRepository.listarPorId('abc123')).rejects.toThrow(CustomError);
      expect(EventoModel.findById).toHaveBeenCalledWith('abc123');
    });

    it('deve lançar CustomError ao ocorrer erro inesperado', async () => {
      EventoModel.findById.mockRejectedValue(new Error('Erro inesperado'));

      await expect(eventoRepository.listarPorId('abc123')).rejects.toThrow(CustomError);
    });

    it('deve lançar erro se ID for inválido ou vazio', async () => {
      await expect(eventoRepository.listarPorId(null)).rejects.toThrow();
      await expect(eventoRepository.listarPorId('')).rejects.toThrow();
      // Só para garantir, mesmo que o repo não valide, evita chamada ao DB:
      expect(EventoModel.findById).not.toHaveBeenCalled();
    });
  });


  describe('atualizar', () => {
    it('deve atualizar um evento existente', async () => {
      const id = 'abc123';
      const dadosAtualizados = { titulo: 'Evento Atualizado' };
      const mockEventoAtualizado = { _id: id, ...dadosAtualizados };

      EventoModel.findByIdAndUpdate.mockResolvedValue(mockEventoAtualizado);

      const result = await eventoRepository.alterar(id, dadosAtualizados);

      expect(result).toEqual(mockEventoAtualizado);
      expect(EventoModel.findByIdAndUpdate).toHaveBeenCalledWith(id, dadosAtualizados, { new: true });
    });

    it('deve lançar erro se evento não existir ao atualizar', async () => {
      EventoModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(eventoRepository.alterar('abc123', {})).rejects.toThrow(CustomError);
    });

    it('deve lançar CustomError ao ocorrer erro inesperado', async () => {
      EventoModel.findByIdAndUpdate.mockRejectedValue(new Error('Erro inesperado'));

      await expect(eventoRepository.alterar('abc123', {})).rejects.toThrow(CustomError);
    });

    it('deve lançar erro se id ou dados forem inválidos', async () => {
      await expect(eventoRepository.alterar(null, {})).rejects.toThrow();
      await expect(eventoRepository.alterar('abc123', null)).rejects.toThrow();
      await expect(eventoRepository.alterar('', {})).rejects.toThrow();
      expect(EventoModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe('remover', () => {
    it('deve remover um evento por ID', async () => {
      const mockEvento = { _id: 'abc123' };
      EventoModel.findByIdAndDelete.mockResolvedValue(mockEvento);

      const result = await eventoRepository.deletar('abc123');

      expect(result).toEqual(mockEvento);
      expect(EventoModel.findByIdAndDelete).toHaveBeenCalledWith('abc123');
    });

    it('deve lançar erro se evento não existir ao remover', async () => {
      EventoModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(eventoRepository.deletar('abc123')).rejects.toThrow(CustomError);
    });

    it('deve lançar CustomError ao ocorrer erro inesperado', async () => {
      EventoModel.findByIdAndDelete.mockRejectedValue(new Error('Erro inesperado'));

      await expect(eventoRepository.deletar('abc123')).rejects.toThrow(CustomError);
    });

    it('deve lançar erro se ID for inválido ou vazio', async () => {
      await expect(eventoRepository.deletar(null)).rejects.toThrow();
      await expect(eventoRepository.deletar('')).rejects.toThrow();
      expect(EventoModel.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });
});