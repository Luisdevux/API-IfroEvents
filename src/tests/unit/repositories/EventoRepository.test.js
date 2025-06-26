// src/tests/unit/repositories/EventoRepository.test.js

import mongoose from 'mongoose';
import EventoRepository from '../../../repositories/EventoRepository.js';

// mock dos helpers
jest.mock('../../../utils/helpers/index.js', () => ({
  CustomError: class extends Error {
    constructor({ statusCode, errorType, field, details, customMessage }) {
      super(customMessage);
      this.statusCode = statusCode;
      this.errorType = errorType;
      this.field = field;
      this.details = details;
    }
  },
  HttpStatusCodes: {
    NOT_FOUND: { code: 404, message: 'Recurso não encontrado' },
    INTERNAL_SERVER_ERROR: { code: 500, message: 'Erro interno do servidor' },
    BAD_REQUEST: { code: 400, message: 'Requisição com sintaxe incorreta' },
  },
  messages: {
    error: {
      internalServerError: (resource) => `Erro interno no ${resource}`,
      resourceNotFound: (resource) => `${resource} não encontrado`,
    },
  },
}));

// mock dos métodos da model
const MockEventoModel = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

// mock dos dados a serem utilizados para os testes
describe('EventoRepository', () => {
  let eventoRepository;

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
        url: "/uploads/video/videoApresentativo.mp4",
        tamanhoMb: 12.3,
        altura: 720,
        largura: 1280,
      },
    ],
    midiaCapa: [
      {
        _id: new mongoose.Types.ObjectId(),
        url: "/uploads/capa/capaEvento.jpg",
        tamanhoMb: 2.5,
        altura: 720,
        largura: 1280,
      },
    ],
    midiaCarrossel: [
      {
        _id: new mongoose.Types.ObjectId(),
        url: "/uploads/carrossel/carrosselEvento1.jpg",
        tamanhoMb: 1.5,
        altura: 768,
        largura: 1024,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        url: "/uploads/carrossel/carrosselEvento2.jpg",
        tamanhoMb: 1.8,
        altura: 768,
        largura: 1024,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    eventoRepository = new EventoRepository({
      eventoModel: MockEventoModel
  });
});


  describe('Cadastrar', () => {
    // Testa cadastro de evento e testa erros do cadastro
    it('deve cadastrar um novo evento com sucesso', async () => {
      MockEventoModel.create.mockResolvedValue(mockEventoData);

      const evento = await eventoRepository.cadastrar(mockEventoData);

      expect(MockEventoModel.create).toHaveBeenCalledWith(mockEventoData);
      expect(evento).toEqual(mockEventoData);
    });


    it('deve lançar erro ao tentar cadastrar evento com campos obrigatórios ausentes', async () => {
      MockEventoModel.create.mockImplementation(() => {
        throw new Error('Campo obrigatório ausente: descricao');
      });

      await expect(
        eventoRepository.cadastrar({ ...mockEventoData, descricao: undefined })
      ).rejects.toThrow('Campo obrigatório ausente: descricao');
    });


    it('deve lançar erro ao tentar cadastrar evento com tipo inválido (data como string)', async () => {
      MockEventoModel.create.mockImplementation(() => {
        throw new Error('Cast to Date failed for value "data-invalida"');
      });

      await expect(
        eventoRepository.cadastrar({ ...mockEventoData, dataEvento: 'data-invalida' })
      ).rejects.toThrow(/Cast to Date failed/);
    });


    it('deve lançar erro ao cadastrar com midiaCapa com campos inválidos', async () => {
      MockEventoModel.create.mockImplementation(() => {
        throw new Error('Campo altura é obrigatório');
      });

      await expect(
        eventoRepository.cadastrar({
          ...mockEventoData,
          midiaCapa: [{ url: 'https://imagem.jpg', largura: 1280 }], // falta altura
        })
      ).rejects.toThrow('Campo altura é obrigatório');
    });


    it('deve lançar erro ao cadastrar com arrays obrigatórios vazios', async () => {
      MockEventoModel.create.mockImplementation(() => {
        throw new Error('Campo tags não pode estar vazio');
      });

      await expect(eventoRepository.cadastrar({ ...mockEventoData, tags: [] })).rejects.toThrow(
        'Campo tags não pode estar vazio'
      );
    });
  });


  describe('Listar', () => {
    // Testa listagem de eventos e erros de listagem
    it('deve listar todos os eventos', async () => {
      MockEventoModel.find.mockResolvedValue([mockEventoData]);

      const eventos = await eventoRepository.listar();

      expect(MockEventoModel.find).toHaveBeenCalled();
      expect(eventos).toEqual([mockEventoData]);
    });


    it('deve lançar erro ao listar todos os eventos quando find falha', async () => {
      MockEventoModel.find.mockImplementation(() => {
        throw new Error('Erro no banco de dados ao listar');
      });

      await expect(eventoRepository.listar()).rejects.toThrow('Erro no banco de dados ao listar');
    });
  });


  describe('Listar por ID', () => {
    // Testa listagem de eventos por ID e erros da listagem por ID
    it('deve retornar evento pelo ID', async () => {
      MockEventoModel.findById.mockResolvedValue(mockEventoData);

      const evento = await eventoRepository.listarPorId(mockEventoData._id);

      expect(MockEventoModel.findById).toHaveBeenCalledWith(mockEventoData._id);
      expect(evento).toEqual(mockEventoData);
    });


    it('deve lançar erro se evento não for encontrado por ID', async () => {
      MockEventoModel.findById.mockResolvedValue(null);

      await expect(eventoRepository.listarPorId(mockEventoData._id)).rejects.toThrow('Evento não encontrado');
    });


    it('deve lançar erro ao listarPorId quando findById falha', async () => {
      MockEventoModel.findById.mockImplementation(() => {
        throw new Error('Erro no banco de dados ao buscar por ID');
      });

      await expect(eventoRepository.listarPorId(mockEventoData._id)).rejects.toThrow(
        'Erro no banco de dados ao buscar por ID'
      );
    });
  });


  describe('Alterar', () => {
    // Testa alteração de eventos e erros de alteração
    it('deve alterar campos do evento com sucesso', async () => {
      MockEventoModel.findByIdAndUpdate.mockResolvedValue({ ...mockEventoData, titulo: 'Atualizado' });

      const eventoAtualizado = await eventoRepository.alterar(mockEventoData._id, { titulo: 'Atualizado' });

      expect(MockEventoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockEventoData._id,
        { titulo: 'Atualizado' },
        { new: true }
      );
      expect(eventoAtualizado.titulo).toBe('Atualizado');
    });


    it('deve lançar erro ao tentar alterar evento inexistente', async () => {
      MockEventoModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(eventoRepository.alterar(mockEventoData._id, { titulo: 'Atualizado' })).rejects.toThrow(
        'Evento não encontrado'
      );
    });


    it('deve lançar erro ao alterar evento quando findByIdAndUpdate falha', async () => {
      MockEventoModel.findByIdAndUpdate.mockImplementation(() => {
        throw new Error('Erro no banco de dados ao alterar');
      });

      await expect(eventoRepository.alterar(mockEventoData._id, { titulo: 'Teste' })).rejects.toThrow(
        'Erro no banco de dados ao alterar'
      );
    });


    it('deve alterar o status do evento', async () => {
      MockEventoModel.findByIdAndUpdate.mockResolvedValue({ ...mockEventoData, status: 'inativo' });

      const atualizado = await eventoRepository.alterarStatus(mockEventoData._id, 'inativo');

      expect(MockEventoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockEventoData._id,
        { status: 'inativo' },
        { new: true }
      );
      expect(atualizado.status).toBe('inativo');
    });


    it('deve lançar erro ao alterar status com ID inexistente', async () => {
      MockEventoModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(eventoRepository.alterarStatus(mockEventoData._id, 'inativo')).rejects.toThrow(
        'Evento não encontrado'
      );
    });


    it('deve lançar erro ao alterarStatus quando findByIdAndUpdate falha', async () => {
      MockEventoModel.findByIdAndUpdate.mockImplementation(() => {
        throw new Error('Erro no banco de dados ao alterar status');
      });

      await expect(eventoRepository.alterarStatus(mockEventoData._id, 'inativo')).rejects.toThrow(
        'Erro no banco de dados ao alterar status'
      );
    });
  });

  describe('Deletar', () => {
    // Testa deleção de eventos e erros de deleção
    it('deve deletar evento pelo ID', async () => {
      MockEventoModel.findByIdAndDelete.mockResolvedValue(mockEventoData);

      const deletado = await eventoRepository.deletar(mockEventoData._id);

      expect(MockEventoModel.findByIdAndDelete).toHaveBeenCalledWith(mockEventoData._id);
      expect(deletado).toEqual(mockEventoData);
    });


    it('deve retornar null ao tentar deletar evento inexistente', async () => {
      MockEventoModel.findByIdAndDelete.mockResolvedValue(null);

      const resultado = await eventoRepository.deletar(mockEventoData._id);

      expect(resultado).toBeNull();
    });


    it('deve lançar erro ao deletar evento quando findByIdAndDelete falha', async () => {
      MockEventoModel.findByIdAndDelete.mockImplementation(() => {
        throw new Error('Erro no banco de dados ao deletar');
      });

      await expect(eventoRepository.deletar(mockEventoData._id)).rejects.toThrow(
        'Erro no banco de dados ao deletar'
      );
    });
  });
});