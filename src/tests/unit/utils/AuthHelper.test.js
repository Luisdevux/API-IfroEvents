// src/tests/unit/utils/AuthHelper.test.js

import AuthHelper from '../../../utils/AuthHelper';
import bcrypt from 'bcrypt';

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn()
}));

describe('AuthHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('deve gerar hash de senha com salt 10', async () => {
      const senha = 'senha123';
      const senhaHash = 'senha_hasheada';
      
      bcrypt.hash.mockResolvedValue(senhaHash);
      
      const result = await AuthHelper.hashPassword(senha);
      
      expect(result).toBe(senhaHash);
      expect(bcrypt.hash).toHaveBeenCalledWith(senha, 12);
    });

    it('deve propagar erro se bcrypt falhar', async () => {
      const erro = new Error('Falha ao gerar hash');
      bcrypt.hash.mockRejectedValue(erro);
      
      await expect(AuthHelper.hashPassword('senha123')).rejects.toThrow('Falha ao gerar hash');
    });
  });
});