import mongoose from 'mongoose';
import UsuarioRepository from '../../../repositories/UsuarioRepository.js';

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

const MockUsuarioModel = {
  save: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};


describe('UsuarioRepository', () => {
  let usuarioRepository;

  const mockUsuarioData = {
    _id: new mongoose.Types.ObjectId(),
    nome: 'Maria Souza',
    email: 'maria@email.com',
    senha: 'senha123',
    tokenUnico: 'token-unico',
    exp_tokenUnico_recuperacao: new Date(),
    refreshtoken: 'refresh-token',
    accesstoken: 'access-token'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    function UsuarioModel(data) {
      Object.assign(this, data);
      this.save = MockUsuarioModel.save;
    }
    usuarioRepository = new UsuarioRepository({
      usuarioModel: UsuarioModel,
    });
    // Para métodos estáticos
    usuarioRepository.model.find = MockUsuarioModel.find;
    usuarioRepository.model.findById = MockUsuarioModel.findById;
    usuarioRepository.model.findOne = MockUsuarioModel.findOne;
    usuarioRepository.model.findByIdAndUpdate = MockUsuarioModel.findByIdAndUpdate;
    usuarioRepository.model.findByIdAndDelete = MockUsuarioModel.findByIdAndDelete;
  });

  describe('cadastrar', () => {
    it('deve cadastrar um novo usuário com sucesso', async () => {
      MockUsuarioModel.save.mockResolvedValue(mockUsuarioData);
      const usuario = await usuarioRepository.cadastrar(mockUsuarioData);
      expect(MockUsuarioModel.save).toHaveBeenCalled();
      expect(usuario).toEqual(mockUsuarioData);
    });

    it('deve lançar erro ao cadastrar usuário inválido', async () => {
      MockUsuarioModel.save.mockImplementation(() => {
        throw new Error('Campo obrigatório ausente: email');
      });
      await expect(
        usuarioRepository.cadastrar({ ...mockUsuarioData, email: undefined })
      ).rejects.toThrow('Campo obrigatório ausente: email');
    });
  });

  describe('listar', () => {
    it('deve listar todos os usuários', async () => {
      MockUsuarioModel.find.mockResolvedValue([mockUsuarioData]);
      const usuarios = await usuarioRepository.listar();
      expect(MockUsuarioModel.find).toHaveBeenCalled();
      expect(usuarios).toEqual([mockUsuarioData]);
    });

    it('deve lançar erro ao listar usuários quando find falha', async () => {
      MockUsuarioModel.find.mockImplementation(() => {
        throw new Error('Erro no banco de dados ao listar');
      });
      await expect(usuarioRepository.listar()).rejects.toThrow('Erro no banco de dados ao listar');
    });
  });

  describe('listarPorId', () => {
    it('deve retornar usuário pelo ID', async () => {
      MockUsuarioModel.findById.mockResolvedValue(mockUsuarioData);
      const usuario = await usuarioRepository.listarPorId(mockUsuarioData._id);
      expect(MockUsuarioModel.findById).toHaveBeenCalledWith(mockUsuarioData._id);
      expect(usuario).toEqual(mockUsuarioData);
    });

    it('deve lançar erro se usuário não for encontrado', async () => {
      MockUsuarioModel.findById.mockResolvedValue(null);
      await expect(usuarioRepository.listarPorId(mockUsuarioData._id)).rejects.toThrow('Usuário não encontrado');
    });

    it('deve lançar erro ao listarPorId quando findById falha', async () => {
      MockUsuarioModel.findById.mockImplementation(() => {
        throw new Error('Erro no banco de dados ao buscar por ID');
      });
      await expect(usuarioRepository.listarPorId(mockUsuarioData._id)).rejects.toThrow(
        'Erro no banco de dados ao buscar por ID'
      );
    });

    it('deve retornar usuário pelo ID com includeTokens=true', async () => {
      const mockSelect = jest.fn().mockResolvedValue(mockUsuarioData);
      MockUsuarioModel.findById.mockReturnValue({ select: mockSelect });
      const usuario = await usuarioRepository.listarPorId(mockUsuarioData._id, true);
      expect(MockUsuarioModel.findById).toHaveBeenCalledWith(mockUsuarioData._id);
      expect(mockSelect).toHaveBeenCalledWith('+refreshtoken +accesstoken');
      expect(usuario).toEqual(mockUsuarioData);
    });
  });

  describe('buscarPorEmail', () => {
    it('deve retornar usuário pelo email', async () => {
      MockUsuarioModel.findOne.mockResolvedValue(mockUsuarioData);
      const usuario = await usuarioRepository.buscarPorEmail(mockUsuarioData.email);
      expect(MockUsuarioModel.findOne).toHaveBeenCalled();
      expect(usuario).toEqual(mockUsuarioData);
    });

    it('deve buscar por email ignorando um id', async () => {
      MockUsuarioModel.findOne.mockResolvedValue(mockUsuarioData);
      await usuarioRepository.buscarPorEmail(mockUsuarioData.email, 'outro-id');
      expect(MockUsuarioModel.findOne).toHaveBeenCalledWith(
        { email: mockUsuarioData.email, _id: { $ne: 'outro-id' } },
        ['+senha', '+tokenUnico', '+exp_tokenUnico_recuperacao']
      );
    });

    it('deve retornar undefined se não encontrar usuário por email', async () => {
      MockUsuarioModel.findOne.mockResolvedValue(undefined);
      const usuario = await usuarioRepository.buscarPorEmail('naoexiste@email.com');
      expect(usuario).toBeUndefined();
    });

    it('deve lançar erro ao buscarPorEmail quando findOne falha', async () => {
      MockUsuarioModel.findOne.mockImplementation(() => {
        throw new Error('Erro no banco de dados ao buscar por email');
      });
      await expect(usuarioRepository.buscarPorEmail(mockUsuarioData.email)).rejects.toThrow(
        'Erro no banco de dados ao buscar por email'
      );
    });
  });

  describe('buscarPorTokenUnico', () => {
    it('deve retornar usuário pelo token único', async () => {
      MockUsuarioModel.findOne.mockResolvedValue(mockUsuarioData);
      const usuario = await usuarioRepository.buscarPorTokenUnico(mockUsuarioData.tokenUnico);
      expect(MockUsuarioModel.findOne).toHaveBeenCalled();
      expect(usuario).toEqual(mockUsuarioData);
    });

    it('deve retornar undefined se não encontrar usuário pelo token único', async () => {
      MockUsuarioModel.findOne.mockResolvedValue(undefined);
      const usuario = await usuarioRepository.buscarPorTokenUnico('token-invalido');
      expect(usuario).toBeUndefined();
    });

    it('deve lançar erro em caso de falha na busca por token único', async () => {
      MockUsuarioModel.findOne.mockImplementation(() => {
        throw new Error('Erro no banco de dados ao buscar por token único');
      });
      await expect(usuarioRepository.buscarPorTokenUnico('token')).rejects.toThrow(
        'Erro no banco de dados ao buscar por token único'
      );
    });
  });

  describe('alterar', () => {
    it('deve alterar campos do usuário com sucesso', async () => {
      MockUsuarioModel.findByIdAndUpdate.mockResolvedValue({ ...mockUsuarioData, nome: 'Alterado' });
      const usuarioAtualizado = await usuarioRepository.alterar(mockUsuarioData._id, { nome: 'Alterado' });
      expect(MockUsuarioModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUsuarioData._id,
        { nome: 'Alterado' },
        { new: true }
      );
      expect(usuarioAtualizado.nome).toBe('Alterado');
    });

    it('deve lançar erro ao tentar alterar usuário inexistente', async () => {
      MockUsuarioModel.findByIdAndUpdate.mockResolvedValue(null);
      await expect(usuarioRepository.alterar(mockUsuarioData._id, { nome: 'Alterado' })).rejects.toThrow(
        'Usuário não encontrado'
      );
    });

    it('deve lançar erro ao alterar usuário quando findByIdAndUpdate falha', async () => {
      MockUsuarioModel.findByIdAndUpdate.mockImplementation(() => {
        throw new Error('Erro no banco de dados ao alterar');
      });
      await expect(usuarioRepository.alterar(mockUsuarioData._id, { nome: 'Teste' })).rejects.toThrow(
        'Erro no banco de dados ao alterar'
      );
    });
  });

  describe('atualizarSenha', () => {
    it('deve atualizar a senha do usuário com sucesso', async () => {
      MockUsuarioModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUsuarioData),
      });
      const usuario = await usuarioRepository.atualizarSenha(mockUsuarioData._id, 'novaSenha123');
      expect(MockUsuarioModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUsuarioData._id,
        {
          $set: { senha: 'novaSenha123' },
          $unset: { tokenUnico: '', exp_tokenUnico_recuperacao: '' }
        },
        { new: true }
      );
      expect(usuario).toEqual(mockUsuarioData);
    });

    it('deve lançar erro se o usuário não for encontrado ao atualizar senha', async () => {
      MockUsuarioModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(usuarioRepository.atualizarSenha(mockUsuarioData._id, 'novaSenha123'))
        .rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('deletar', () => {
    it('deve deletar o usuário com sucesso', async () => {
      MockUsuarioModel.findByIdAndDelete.mockResolvedValue(mockUsuarioData);
      const usuario = await usuarioRepository.deletar(mockUsuarioData._id);
      expect(MockUsuarioModel.findByIdAndDelete).toHaveBeenCalledWith(mockUsuarioData._id);
      expect(usuario).toEqual(mockUsuarioData);
    });

    it('deve retornar null se o usuário não existir ao deletar', async () => {
      MockUsuarioModel.findByIdAndDelete.mockResolvedValue(null);
      const usuario = await usuarioRepository.deletar('id-inexistente');
      expect(usuario).toBeNull();
    });
  });

  describe('buscarPorCodigoRecuperacao', () => {
    it('deve retornar usuário pelo código de recuperação', async () => {
      MockUsuarioModel.findOne.mockResolvedValue(mockUsuarioData);
      const usuario = await usuarioRepository.buscarPorCodigoRecuperacao('codigo123');
      expect(MockUsuarioModel.findOne).toHaveBeenCalledWith({ codigo_recupera_senha: 'codigo123' });
      expect(usuario).toEqual(mockUsuarioData);
    });

    it('deve retornar undefined se não encontrar usuário pelo código', async () => {
      MockUsuarioModel.findOne.mockResolvedValue(undefined);
      const usuario = await usuarioRepository.buscarPorCodigoRecuperacao('codigoInvalido');
      expect(usuario).toBeUndefined();
    });

    it('deve lançar erro ao buscarPorCodigoRecuperacao quando findOne falha', async () => {
      MockUsuarioModel.findOne.mockImplementation(() => {
        throw new Error('Erro no banco de dados ao buscar por código');
      });
      await expect(usuarioRepository.buscarPorCodigoRecuperacao('codigo123')).rejects.toThrow(
        'Erro no banco de dados ao buscar por código'
      );
    });
  });
});