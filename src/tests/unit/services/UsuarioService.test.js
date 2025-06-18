// src/tests/unit/services/UsuarioService.test.js
import UsuarioService from "../../../services/UsuarioService.js";
import { CustomError, HttpStatusCodes } from "../../../utils/helpers/index.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UsuarioUpdateSchema } from "../../../utils/validators/schemas/zod/UsuarioSchema.js";

// Mock do repositório para simular o banco
const mockRepository = {
  cadastrar: jest.fn(),
  listar: jest.fn().mockResolvedValue([]),
  listarPorId: jest.fn(),
  buscarPorEmail: jest.fn(),
  buscarPorCodigoRecuperacao: jest.fn(),
  alterar: jest.fn(),
  atualizarSenha: jest.fn(),
  deletar: jest.fn(),
  armazenarTokens: jest.fn(),
  removeToken: jest.fn(),
};

// Mock do TokenUtil
const mockTokenUtil = {
  decodePasswordRecoveryToken: jest.fn(),
};

// Criação do ID e usuário fake
const usuarioId = new mongoose.Types.ObjectId();
const invalidId = "123"; // ID inválido

const usuarioFake = {
  _id: usuarioId.toString(),
  matricula: "2024103070030",
  nome: "Usuário Teste",
  email: "testeUnit@gmail.com",
  senha: "SenhaTeste1@",
  createdAt: new Date(),
  updatedAt: new Date()
};

// Adiciona método equals para comparação
usuarioFake._id.equals = function(otherId) {
  return this.toString() === otherId.toString();
};

// Usuário com código de recuperação
const usuarioComCodigoRecuperacao = {
  ...usuarioFake,
  codigo_recupera_senha: "1234",
  exp_codigo_recupera_senha: new Date(Date.now() + 3600000)
};

// Configuração do serviço
let usuarioService;

beforeAll(() => {
  usuarioService = new UsuarioService({
    repository: mockRepository,
    TokenUtil: mockTokenUtil
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  
  // Configurações padrão dos mocks
  mockRepository.listar.mockResolvedValue([usuarioFake]);
  mockRepository.listarPorId.mockImplementation((id) => 
    id === usuarioFake._id ? usuarioFake : null
  );
  mockRepository.buscarPorEmail.mockResolvedValue(null);
  mockTokenUtil.decodePasswordRecoveryToken.mockResolvedValue({ 
    usuarioId: usuarioFake._id 
  });
});

describe("UsuarioService", () => {
  describe("cadastrar", () => {
    it("deve cadastrar um novo usuário com sucesso", async () => {
      const senhaHash = 'hashedPassword';
      mockRepository.buscarPorEmail.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(senhaHash);
      mockRepository.cadastrar.mockResolvedValue({ ...usuarioFake, senha: senhaHash });
      
      const resultado = await usuarioService.cadastrar(usuarioFake);
      
      expect(resultado._id).toBe(usuarioFake._id);
      expect(bcrypt.hash).toHaveBeenCalledWith(usuarioFake.senha, 10);
    });

    it("deve lançar erro se o email já estiver em uso", async () => {
      mockRepository.buscarPorEmail.mockResolvedValue(usuarioFake);
      await expect(usuarioService.cadastrar(usuarioFake)).rejects.toThrow(CustomError);
    });

    it("deve lançar erro se o repositório falhar", async () => {
      mockRepository.buscarPorEmail.mockResolvedValue(null);
      mockRepository.cadastrar.mockRejectedValue(new Error("Falha ao cadastrar"));
      await expect(usuarioService.cadastrar(usuarioFake)).rejects.toThrow("Falha ao cadastrar");
    });
  });

  describe("listar", () => {
    it("deve retornar lista de usuários quando chamada sem parâmetro", async () => {
      mockRepository.listar.mockResolvedValue([usuarioFake]);
      const resultado = await usuarioService.listar();
      expect(resultado).toEqual([usuarioFake]);
    });

    it("deve retornar um usuário pelo ID válido", async () => {
      const resultado = await usuarioService.listar(usuarioFake._id);
      expect(resultado).toEqual(usuarioFake);
      expect(mockRepository.listarPorId).toHaveBeenCalledWith(usuarioFake._id);
    });

    it("deve lançar erro se ID for inválido", async () => {
      await expect(usuarioService.listar(invalidId)).rejects.toThrow();
    });

    it("deve lançar erro se listarPorId falhar", async () => {
      mockRepository.listarPorId.mockRejectedValue(new Error("Erro no banco"));
      await expect(usuarioService.listar(usuarioFake._id)).rejects.toThrow("Erro no banco");
    });
  });

  describe("alterar", () => {
    const dadosAtualizados = { nome: "Novo Nome" };

    it("deve atualizar usuário existente com sucesso", async () => {
      mockRepository.alterar.mockResolvedValue({ ...usuarioFake, ...dadosAtualizados });
      const resultado = await usuarioService.alterar(usuarioFake._id, dadosAtualizados);
      expect(resultado.nome).toBe("Novo Nome");
    });

    it("deve remover campos não permitidos na atualização", async () => {
      const dadosComCamposProibidos = {
        ...dadosAtualizados,
        email: "novo@email.com",
        senha: "NovaSenha123@"
      };
      
      await usuarioService.alterar(usuarioFake._id, dadosComCamposProibidos);
      expect(mockRepository.alterar).toHaveBeenCalledWith(usuarioFake._id, dadosAtualizados);
    });

    it("deve lançar CustomError se usuário não existir", async () => {
      mockRepository.listarPorId.mockResolvedValue(null);
      await expect(usuarioService.alterar(usuarioFake._id, dadosAtualizados))
        .rejects.toThrow(CustomError);
    });

    it("deve lançar erro se ID for inválido", async () => {
      await expect(usuarioService.alterar(invalidId, dadosAtualizados))
        .rejects.toThrow();
    });
  });

  describe("atualizarSenha", () => {
    const novaSenha = "NovaSenha123@";
    const tokenValido = "token.valido";
    const codigoValido = "1234";

    beforeEach(() => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
    });

    it("deve atualizar senha com token válido", async () => {
      mockRepository.atualizarSenha.mockResolvedValue(true);
      const resultado = await usuarioService.atualizarSenha({
        tokenRecuperacao: tokenValido,
        senha: novaSenha
      });
      expect(resultado).toEqual({ message: 'Senha atualizada com sucesso.' });
    });

    it("deve atualizar senha com código válido", async () => {
      mockRepository.buscarPorCodigoRecuperacao.mockResolvedValue(usuarioComCodigoRecuperacao);
      const resultado = await usuarioService.atualizarSenha({
        codigo_recupera_senha: codigoValido,
        senha: novaSenha
      });
      expect(resultado).toEqual({ message: 'Senha atualizada com sucesso.' });
    });

    it("deve lançar erro se código de recuperação for inválido", async () => {
      mockRepository.buscarPorCodigoRecuperacao.mockResolvedValue(null);
      await expect(usuarioService.atualizarSenha({
        codigo_recupera_senha: "0000",
        senha: novaSenha
      })).rejects.toThrow(CustomError);
    });
  });

  describe("deletar", () => {
    it("deve deletar usuário com sucesso", async () => {
      mockRepository.deletar.mockResolvedValue({ acknowledged: true, deletedCount: 1 });
      const resultado = await usuarioService.deletar(usuarioFake._id);
      expect(resultado).toEqual({ acknowledged: true, deletedCount: 1 });
    });

    it("deve lançar CustomError se usuário não existir", async () => {
      mockRepository.listarPorId.mockResolvedValue(null);
      await expect(usuarioService.deletar(usuarioFake._id))
        .rejects.toThrow(CustomError);
    });
  });

  describe("validateEmail", () => {
    it("deve passar se email não estiver em uso", async () => {
      await expect(usuarioService.validateEmail("novo@email.com"))
        .resolves.not.toThrow();
    });

    it("deve lançar erro se email já estiver em uso", async () => {
      mockRepository.buscarPorEmail.mockResolvedValue(usuarioFake);
      await expect(usuarioService.validateEmail(usuarioFake.email))
        .rejects.toThrow(CustomError);
    });
  });
});