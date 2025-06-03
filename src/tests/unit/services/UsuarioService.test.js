// // src/tests/unit/services/UsuarioService.test.js
// import UsuarioService from "../../../services/UsuarioService.js";
// import { CustomError } from "../../../utils/helpers/index.js";
// import mongoose from "mongoose";

// // Mock do repositório para simular o banco
// const mockRepository = {
//   cadastrar: jest.fn(),
//   listar: jest.fn(),
//   listarPorId: jest.fn(),
//   alterar: jest.fn(),
//   deletar: jest.fn(),
// };

// const usuarioService = new UsuarioService();
// usuarioService.repository = mockRepository;

// const invalidId = "invalid";

// const usuarioFake = {
//   _id: new mongoose.Types.ObjectId().toString(),
//   matricula: "2024103070030",
//   nome: "Usuário Teste",
//   senha: "SenhaTeste1@",
//   createdAt: new Date(),
//   updatedAt: new Date()
// };

// describe("UsuarioService", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   // Teste do cadastrar
//   describe("Cadastrar", () => {
//     it("deve cadastrar um novo usuário com sucesso", async () => {
//       mockRepository.cadastrar.mockResolvedValue(usuarioFake);
//       const resultado = await usuarioService.cadastrar(usuarioFake);
//       expect(resultado).toEqual(usuarioFake);
//       expect(mockRepository.cadastrar).toHaveBeenCalledWith(usuarioFake);
//     });

//     it("deve lançar erro se o repositório falhar", async () => {
//       mockRepository.cadastrar.mockRejectedValue(new Error("Falha ao cadastrar"));
//       await expect(usuarioService.cadastrar(usuarioFake)).rejects.toThrow("Falha ao cadastrar");
//     });
//   });

//   // Teste de listar
//   describe("Listar e Listar por ID", () => {
//     it("deve retornar lista de usuários quando chamada sem parâmetro", async () => {
//       mockRepository.listar.mockResolvedValue([usuarioFake]);
//       const resultado = await usuarioService.listar();
//       expect(resultado).toEqual([usuarioFake]);
//       expect(mockRepository.listar).toHaveBeenCalled();
//     });

//     it("deve retornar um usuário pelo ID válido", async () => {
//       mockRepository.listarPorId.mockResolvedValue(usuarioFake);
//       const resultado = await usuarioService.listar(usuarioFake._id);
//       expect(resultado).toEqual(usuarioFake);
//       expect(mockRepository.listarPorId).toHaveBeenCalledWith(usuarioFake._id);
//     });

//     it("deve lançar erro se ID for inválido", async () => {
//       await expect(usuarioService.listar(invalidId)).rejects.toThrow();
//     });

//     it("deve lançar erro se listarPorId falhar", async () => {
//       mockRepository.listarPorId.mockRejectedValue(new Error("Erro no banco"));
//       await expect(usuarioService.listar(usuarioFake._id)).rejects.toThrow("Erro no banco");
//     });

//     it("deve lançar erro se listar falhar", async () => {
//       mockRepository.listar.mockRejectedValue(new Error("Erro no banco"));
//       await expect(usuarioService.listar()).rejects.toThrow("Erro no banco");
//     });
//   });

//   // Teste do alterar
//   describe("Alterar", () => {
//     const dadosAtualizados = { nome: "Novo Nome" };

//     it("deve atualizar usuário existente com sucesso", async () => {
//       mockRepository.listarPorId.mockResolvedValue(usuarioFake);
//       mockRepository.alterar.mockResolvedValue({ ...usuarioFake, ...dadosAtualizados });
//       const resultado = await usuarioService.alterar(usuarioFake._id, dadosAtualizados);
//       expect(resultado.nome).toBe("Novo Nome");
//       expect(mockRepository.listarPorId).toHaveBeenCalledWith(usuarioFake._id);
//       expect(mockRepository.alterar).toHaveBeenCalledWith(usuarioFake._id, dadosAtualizados);
//     });

//     it("deve lançar CustomError se usuário não existir", async () => {
//       mockRepository.listarPorId.mockResolvedValue(null);
//       await expect(usuarioService.alterar(usuarioFake._id, dadosAtualizados)).rejects.toThrow(CustomError);
//     });

//     it("deve lançar erro se ID for inválido", async () => {
//       await expect(usuarioService.alterar(invalidId, dadosAtualizados)).rejects.toThrow();
//     });

//     it("deve lançar erro se alterar falhar", async () => {
//       mockRepository.listarPorId.mockResolvedValue(usuarioFake);
//       mockRepository.alterar.mockRejectedValue(new Error("Erro no banco"));
//       await expect(usuarioService.alterar(usuarioFake._id, dadosAtualizados)).rejects.toThrow("Erro no banco");
//     });
//   });

//   // Teste do deletar
//   describe("Deletar", () => {
//     it("deve deletar usuário com sucesso", async () => {
//       mockRepository.listarPorId.mockResolvedValue(usuarioFake);
//       mockRepository.deletar.mockResolvedValue({ acknowledged: true, deletedCount: 1 });
//       const resultado = await usuarioService.deletar(usuarioFake._id);
//       expect(resultado).toEqual({ acknowledged: true, deletedCount: 1 });
//       expect(mockRepository.listarPorId).toHaveBeenCalledWith(usuarioFake._id);
//       expect(mockRepository.deletar).toHaveBeenCalledWith(usuarioFake._id);
//     });

//     it("deve lançar CustomError se usuário não existir", async () => {
//       mockRepository.listarPorId.mockResolvedValue(null);
//       await expect(usuarioService.deletar(usuarioFake._id)).rejects.toThrow(CustomError);
//     });

//     it("deve lançar erro se ID for inválido", async () => {
//       await expect(usuarioService.deletar(invalidId)).rejects.toThrow();
//     });

//     it("deve lançar erro se deletar falhar", async () => {
//       mockRepository.listarPorId.mockResolvedValue(usuarioFake);
//       mockRepository.deletar.mockRejectedValue(new Error("Erro no banco"));
//       await expect(usuarioService.deletar(usuarioFake._id)).rejects.toThrow("Erro no banco");
//     });
//   });

//   // Teste do ensureUserExists
//   describe("ensureUserExists", () => {
//     it("deve retornar usuário se existir", async () => {
//       mockRepository.listarPorId.mockResolvedValue(usuarioFake);
//       const resultado = await usuarioService.ensureUserExists(usuarioFake._id);
//       expect(resultado).toEqual(usuarioFake);
//     });

//     it("deve lançar CustomError se usuário não existir", async () => {
//       mockRepository.listarPorId.mockResolvedValue(null);
//       await expect(usuarioService.ensureUserExists(usuarioFake._id)).rejects.toThrow(CustomError);
//     });

//     it("deve lançar erro se ID for inválido", async () => {
//       await expect(usuarioService.ensureUserExists(invalidId)).rejects.toThrow();
//     });
//   });
// });