// src/tests/unit/utils/Validator.test.js

import Validator from '../../../utils/Validator';

describe('Validator', () => {
  let validator;

  beforeEach(() => {
    validator = new Validator();
  });

  describe('validarCampoObrigatorio', () => {
    it('deve validar campos não vazios', () => {
      expect(validator.validarCampoObrigatorio('texto', 'Nome').erro).toBe(null);
      expect(validator.validarCampoObrigatorio(123, 'Número').erro).toBe(null);
      expect(validator.validarCampoObrigatorio(true, 'Boolean').erro).toBe(null);
    });

    it('deve retornar erro para campos vazios', () => {
      expect(validator.validarCampoObrigatorio('', 'Nome').erro).toContain('Nome');
      expect(validator.validarCampoObrigatorio(null, 'Email').erro).toContain('Email');
      expect(validator.validarCampoObrigatorio(undefined, 'Senha').erro).toContain('Senha');
    });

    it('deve permitir encadeamento de métodos', () => {
      const result = validator
        .validarCampoObrigatorio('Teste', 'Nome')
        .validarCampoObrigatorio('email@example.com', 'Email');
      
      expect(result).toBe(validator);
      expect(result.erro).toBe(null);
    });
  });

  describe('validarComprimento', () => {
    it('deve validar texto com comprimento dentro dos limites', () => {
      expect(validator.validarComprimento('abc', 2, 5, 'Nome').erro).toBe(null);
      expect(validator.validarComprimento('12345', 1, 5, 'Código').erro).toBe(null);
    });

    it('deve retornar erro para texto muito curto', () => {
      expect(validator.validarComprimento('a', 2, 5, 'Nome').erro).toContain('Nome');
      expect(validator.validarComprimento('', 1, 5, 'Código').erro).toContain('Código');
    });

    it('deve retornar erro para texto muito longo', () => {
      expect(validator.validarComprimento('abcdef', 2, 5, 'Nome').erro).toContain('Nome');
      expect(validator.validarComprimento('123456', 1, 5, 'Código').erro).toContain('Código');
    });

    it('deve permitir encadeamento após validação de comprimento', () => {
      const result = validator
        .validarComprimento('abc', 2, 5, 'Nome')
        .validarCampoObrigatorio('email@example.com', 'Email');
      
      expect(result).toBe(validator);
      expect(result.erro).toBe(null);
    });
  });

  describe('validarNomeProprio', () => {
    it('deve validar nomes próprios válidos', () => {
      expect(validator.validarNomeProprio('João Silva', 'Nome').erro).toBe(null);
      expect(validator.validarNomeProprio('Maria da Silva', 'Nome Completo').erro).toBe(null);
    });

    it('deve retornar erro para nomes com caracteres inválidos', () => {
      expect(validator.validarNomeProprio('João123', 'Nome').erro).toContain('Nome');
      expect(validator.validarNomeProprio('Maria@Silva', 'Nome Completo').erro).toContain('Nome Completo');
    });

    it('deve permitir encadeamento após validação de nome próprio', () => {
      const result = validator
        .validarNomeProprio('João Silva', 'Nome')
        .validarCampoObrigatorio('email@example.com', 'Email');
      
      expect(result).toBe(validator);
      expect(result.erro).toBe(null);
    });
  });

  describe('validarMatricula', () => {
    it('deve validar matrículas válidas', () => {
      expect(validator.validarMatricula('2023123456', 'Matrícula').erro).toBe(null);
      expect(validator.validarMatricula('20231234567890', 'Matrícula IFRO').erro).toBe(null);
    });

    it('deve retornar erro para matrículas inválidas', () => {
      expect(validator.validarMatricula('202312', 'Matrícula').erro).toContain('Matrícula');
      expect(validator.validarMatricula('2023ABC456', 'Matrícula IFRO').erro).toContain('Matrícula IFRO');
    });

    it('deve permitir encadeamento após validação de matrícula', () => {
      const result = validator
        .validarMatricula('2023123456', 'Matrícula')
        .validarCampoObrigatorio('email@example.com', 'Email');
      
      expect(result).toBe(validator);
      expect(result.erro).toBe(null);
    });
  });

  describe('validarURL', () => {
    it('deve validar URLs válidas', () => {
      expect(validator.validarURL('https://example.com', 'Site').erro).toBe(null);
      expect(validator.validarURL('http://sub.example.com/page', 'Link').erro).toBe(null);
    });

    it('deve retornar erro para URLs inválidas', () => {
      expect(validator.validarURL('example.com', 'Site').erro).toContain('Site');
      expect(validator.validarURL('not a url', 'Link').erro).toContain('Link');
    });

    it('deve permitir encadeamento após validação de URL', () => {
      const result = validator
        .validarURL('https://example.com', 'Site')
        .validarCampoObrigatorio('email@example.com', 'Email');
      
      expect(result).toBe(validator);
      expect(result.erro).toBe(null);
    });
  });

  describe('validarDataFutura', () => {
    it('deve validar datas futuras', () => {
      const hoje = new Date();
      const amanha = new Date(hoje);
      amanha.setDate(hoje.getDate() + 1);
      
      expect(validator.validarDataFutura(amanha, 'Data Evento').erro).toBe(null);
    });

    it('deve retornar erro para datas passadas', () => {
      const hoje = new Date();
      const ontem = new Date(hoje);
      ontem.setDate(hoje.getDate() - 1);
      
      expect(validator.validarDataFutura(ontem, 'Data Evento').erro).toContain('Data Evento');
    });

    it('deve permitir encadeamento após validação de data', () => {
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      
      const result = validator
        .validarDataFutura(amanha, 'Data Evento')
        .validarCampoObrigatorio('Local', 'Local Evento');
      
      expect(result).toBe(validator);
      expect(result.erro).toBe(null);
    });
  });

  describe('Complexidade de erro', () => {
    it('deve parar na primeira validação que falhar', () => {
      const result = validator
        .validarCampoObrigatorio('', 'Nome')
        .validarCampoObrigatorio('', 'Email');
      
      expect(result.erro).toContain('Nome');
      expect(result.erro).not.toContain('Email');
    });

    it('deve manter o erro até que seja redefinido', () => {
      validator.validarCampoObrigatorio('', 'Nome');
      expect(validator.erro).toContain('Nome');
      
      // Nova instância sem erro
      const novoValidator = new Validator();
      expect(novoValidator.erro).toBe(null);
    });
  });
});