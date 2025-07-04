// src/tests/unit/services/EventoService.test.js

import EventoService from "../../../services/EventoService.js";
import mongoose from "mongoose";
import { CustomError } from "../../../utils/helpers/index.js";

// Mock do repositório para simular o banco
const mockRepository = {
  cadastrar: jest.fn(),
  listar: jest.fn(),
  listarPorId: jest.fn(),
  alterar: jest.fn(),
  alterarStatus: jest.fn(),
  deletar: jest.fn(),
};

const eventoService = new EventoService();
eventoService.repository = mockRepository;

// Mock dos métodos auxiliares
eventoService.ensureEventExists = jest.fn();
eventoService.ensureUserIsOwner = jest.fn();
eventoService.validarMidiasObrigatorias = jest.fn();

const invalidId = "invalid";

const mockUsuario = {
    _id: '6653d0b8e7b98e0014e6f009',
    nome: 'João da Silva',
};

const eventoFake = {
    _id: new mongoose.Types.ObjectId().toString(),
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

describe("EventoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    eventoService.ensureEventExists.mockClear();
    eventoService.ensureUserIsOwner.mockClear();
    eventoService.validarMidiasObrigatorias.mockClear();
  });


  //Teste do cadastrar
  describe("Cadastrar", () => {
    it("deve cadastrar um novo evento com sucesso", async () => {
      mockRepository.cadastrar.mockResolvedValue(eventoFake);
      const resultado = await eventoService.cadastrar(eventoFake);
      expect(resultado).toEqual(eventoFake);
      expect(mockRepository.cadastrar).toHaveBeenCalledWith(eventoFake);
    });

    it("deve lançar erro se o repositório falhar", async () => {
      mockRepository.cadastrar.mockRejectedValue(new Error("Falha ao cadastrar"));
      await expect(eventoService.cadastrar(eventoFake)).rejects.toThrow("Falha ao cadastrar");
    });
  });

  // Teste de listar
  describe("Listar e Listar por ID", () => {
    it("deve retornar lista de eventos quando chamada sem parâmetro", async () => {
      const mockReq = { query: {}, user: { _id: mockUsuario._id } };
      mockRepository.listar.mockResolvedValue([eventoFake]);
      
      const resultado = await eventoService.listar(mockReq);
      expect(resultado).toEqual([eventoFake]);
      expect(mockRepository.listar).toHaveBeenCalledWith(mockReq);
    });

    it("deve retornar um evento pelo ID válido", async () => {
      const mockReq = { params: { id: eventoFake._id } };
      mockRepository.listar.mockResolvedValue(eventoFake);
      
      const resultado = await eventoService.listar(eventoFake._id, mockUsuario._id);
      expect(resultado).toEqual(eventoFake);
      expect(mockRepository.listar).toHaveBeenCalledWith(mockReq);
    });

    it("deve lançar erro se ID for inválido (objectIdSchema)", async () => {
      await expect(eventoService.listar(invalidId, mockUsuario._id)).rejects.toThrow();
    });

    it("deve lançar erro se evento não for encontrado para usuário não autenticado", async () => {
      const eventoInativo = { ...eventoFake, status: 'inativo' };
      const mockReq = { params: { id: eventoFake._id } };
      mockRepository.listar.mockResolvedValue(eventoInativo);
      
      await expect(eventoService.listar(eventoFake._id)).rejects.toThrow('Evento não encontrado ou inativo');
    });

    it("deve lançar erro se listar falhar", async () => {
      const mockReq = { query: {}, user: { _id: mockUsuario._id } };
      mockRepository.listar.mockRejectedValue(new Error("Erro no banco"));
      
      await expect(eventoService.listar(mockReq)).rejects.toThrow("Erro no banco");
    });
  });


  // Teste do alterar
  describe("Alterar", () => {
    const dadosAtualizados = { titulo: "Novo Título" };

    it("deve atualizar evento existente com sucesso", async () => {
      eventoService.ensureEventExists.mockResolvedValue(eventoFake);
      eventoService.ensureUserIsOwner.mockResolvedValue();
      mockRepository.alterar.mockResolvedValue({ ...eventoFake, ...dadosAtualizados });
      
      const resultado = await eventoService.alterar(eventoFake._id, dadosAtualizados, mockUsuario._id);
      expect(resultado.titulo).toBe("Novo Título");
      expect(eventoService.ensureEventExists).toHaveBeenCalledWith(eventoFake._id);
      expect(eventoService.ensureUserIsOwner).toHaveBeenCalledWith(eventoFake, mockUsuario._id, false);
      expect(mockRepository.alterar).toHaveBeenCalledWith(eventoFake._id, dadosAtualizados);
    });

    it("deve lançar CustomError se evento não existir", async () => {
      eventoService.ensureEventExists.mockRejectedValue(new CustomError({
        statusCode: 404,
        errorType: 'resourceNotFound',
        field: 'Evento',
        details: [],
        customMessage: 'Evento não encontrado'
      }));
      
      await expect(eventoService.alterar(eventoFake._id, dadosAtualizados, mockUsuario._id)).rejects.toThrow(CustomError);
    });

    it("deve lançar erro se ID for inválido", async () => {
      await expect(eventoService.alterar(invalidId, dadosAtualizados, mockUsuario._id)).rejects.toThrow();
    });

    it("deve lançar erro se alterar falhar", async () => {
      eventoService.ensureEventExists.mockResolvedValue(eventoFake);
      eventoService.ensureUserIsOwner.mockResolvedValue();
      mockRepository.alterar.mockRejectedValue(new Error("Erro no banco"));
      
      await expect(eventoService.alterar(eventoFake._id, dadosAtualizados, mockUsuario._id)).rejects.toThrow("Erro no banco");
    });
  });


  // Teste do alterarStatus
  describe("Alterar Status", () => {
    const novoStatus = "inativo";

    it("deve alterar status do evento com sucesso", async () => {
      eventoService.ensureEventExists.mockResolvedValue(eventoFake);
      eventoService.ensureUserIsOwner.mockResolvedValue();
      mockRepository.alterarStatus.mockResolvedValue({ ...eventoFake, status: novoStatus });
      
      const resultado = await eventoService.alterarStatus(eventoFake._id, novoStatus, mockUsuario._id);
      expect(resultado.status).toBe(novoStatus);
      expect(eventoService.ensureEventExists).toHaveBeenCalledWith(eventoFake._id);
      expect(eventoService.ensureUserIsOwner).toHaveBeenCalledWith(eventoFake, mockUsuario._id, true);
      expect(mockRepository.alterarStatus).toHaveBeenCalledWith(eventoFake._id, novoStatus);
    });

    it("deve lançar CustomError se evento não existir", async () => {
      eventoService.ensureEventExists.mockRejectedValue(new CustomError({
        statusCode: 404,
        errorType: 'resourceNotFound',
        field: 'Evento',
        details: [],
        customMessage: 'Evento não encontrado'
      }));
      
      await expect(eventoService.alterarStatus(eventoFake._id, novoStatus, mockUsuario._id)).rejects.toThrow(CustomError);
    });

    it("deve lançar erro se ID for inválido", async () => {
      await expect(eventoService.alterarStatus(invalidId, novoStatus, mockUsuario._id)).rejects.toThrow();
    });

    it("deve lançar erro se alterarStatus falhar", async () => {
      eventoService.ensureEventExists.mockResolvedValue(eventoFake);
      eventoService.ensureUserIsOwner.mockResolvedValue();
      mockRepository.alterarStatus.mockRejectedValue(new Error("Erro no banco"));
      
      await expect(eventoService.alterarStatus(eventoFake._id, novoStatus, mockUsuario._id)).rejects.toThrow("Erro no banco");
    });
  });


  // Teste do deletar
  describe("Deletar", () => {
    it("deve deletar evento com sucesso", async () => {
      eventoService.ensureEventExists.mockResolvedValue(eventoFake);
      eventoService.ensureUserIsOwner.mockResolvedValue();
      mockRepository.deletar.mockResolvedValue({ acknowledged: true, deletedCount: 1 });
      
      const resultado = await eventoService.deletar(eventoFake._id, mockUsuario._id);
      expect(resultado).toEqual({ acknowledged: true, deletedCount: 1 });
      expect(eventoService.ensureEventExists).toHaveBeenCalledWith(eventoFake._id);
      expect(eventoService.ensureUserIsOwner).toHaveBeenCalledWith(eventoFake, mockUsuario._id, true);
      expect(mockRepository.deletar).toHaveBeenCalledWith(eventoFake._id);
    });

    it("deve lançar CustomError se evento não existir", async () => {
      eventoService.ensureEventExists.mockRejectedValue(new CustomError({
        statusCode: 404,
        errorType: 'resourceNotFound',
        field: 'Evento',
        details: [],
        customMessage: 'Evento não encontrado'
      }));
      
      await expect(eventoService.deletar(eventoFake._id, mockUsuario._id)).rejects.toThrow(CustomError);
    });

    it("deve lançar erro se ID for inválido", async () => {
      await expect(eventoService.deletar(invalidId, mockUsuario._id)).rejects.toThrow();
    });

    it("deve lançar erro se deletar falhar", async () => {
      eventoService.ensureEventExists.mockResolvedValue(eventoFake);
      eventoService.ensureUserIsOwner.mockResolvedValue();
      mockRepository.deletar.mockRejectedValue(new Error("Erro no banco"));
      
      await expect(eventoService.deletar(eventoFake._id, mockUsuario._id)).rejects.toThrow("Erro no banco");
    });
  });
});