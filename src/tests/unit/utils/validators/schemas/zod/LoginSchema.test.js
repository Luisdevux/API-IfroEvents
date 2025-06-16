// src/tests/unit/utils/validators/schemas/zod/LoginSchema.test.js

import { LoginSchema } from '../../../../../../utils/validators/schemas/zod/LoginSchema';

describe('LoginSchema', () => {
    const loginValido = {
        matricula: '2023123456789',
        email: 'usuario@example.com',
        senha: 'Senha123@'
    };

    it('deve validar dados de login válidos', () => {
        const resultado = LoginSchema.safeParse(loginValido);
        expect(resultado.success).toBe(true);
        expect(resultado.data).toEqual(loginValido);
    });

    describe('Validação de matrícula', () => {
        it('deve aceitar matrícula numérica de até 13 dígitos', () => {
            const variantes = [
                '1234567890123',
                '123456789012',
                '1234567890'
            ];

            variantes.forEach(matricula => {
                const resultado = LoginSchema.safeParse({
                    ...loginValido,
                    matricula
                });
                expect(resultado.success).toBe(true);
            });
        });

        it('deve rejeitar matrícula com caracteres não numéricos', () => {
            const matriculasInvalidas = [
                'ABC12345678',
                '123-456-789',
                '123 456 789',
                '123A456789'
            ];

            matriculasInvalidas.forEach(matricula => {
                const resultado = LoginSchema.safeParse({
                    ...loginValido,
                    matricula
                });
                expect(resultado.success).toBe(false);
                expect(resultado.error.issues[0].path).toContain('matricula');
                expect(resultado.error.issues[0].message).toBe('Matrícula inválida!');
            });
        });

        it('deve rejeitar matrícula com mais de 13 dígitos', () => {
            const matricula = '12345678901234';
            
            const resultado = LoginSchema.safeParse({
                ...loginValido,
                matricula
            });
            
            expect(resultado.success).toBe(false);
            expect(resultado.error.issues[0].path).toContain('matricula');
        });
    });

    describe('Validação de email', () => {
        it('deve aceitar emails em formato válido', () => {
            const emailsValidos = [
                'teste@example.com',
                'usuario.nome@dominio.com.br',
                'teste+tag@gmail.com',
                'email_com_underscore@example.org'
            ];

            emailsValidos.forEach(email => {
                const resultado = LoginSchema.safeParse({
                    ...loginValido,
                    email
                });
                expect(resultado.success).toBe(true);
            });
        });

        it('deve rejeitar emails em formato inválido', () => {
            const emailsInvalidos = [
                'teste@',
                '@example.com',
                'teste@dominio',
                'teste.example.com',
                'teste@exemplo.'
            ];

            emailsInvalidos.forEach(email => {
                const resultado = LoginSchema.safeParse({
                    ...loginValido,
                    email
                });
                expect(resultado.success).toBe(false);
                expect(resultado.error.issues[0].path).toContain('email');

                expect(resultado.error.issues[0].message).toBe('Formato de email inválido.');
            });
        });

        it('deve rejeitar email vazio', () => {
            const resultado = LoginSchema.safeParse({
                ...loginValido,
                email: ''
            });
            
            expect(resultado.success).toBe(false);
            expect(resultado.error.issues[0].path).toContain('email');
            expect(resultado.error.issues[0].message).toBe('Formato de email inválido.');
        });
    });

    describe('Validação de senha', () => {
        it('deve aceitar senhas que atendem aos requisitos de complexidade', () => {
            const senhasValidas = [
                'Senha123', // Teste com requisitos mínimos: maiúscula, minúscula, número
                'Teste@123', // Teste com caractere especial
                'AbCdEfGh1', // Teste de senha alternando maiúsculas e minúsculas
                'Senha1234@Complexa' // Teste de senha com mais complexidade
            ];

            senhasValidas.forEach(senha => {
                const resultado = LoginSchema.safeParse({
                    ...loginValido,
                    senha
                });
                expect(resultado.success).toBe(true);
            });
        });

        it('deve rejeitar senhas com menos de 8 caracteres', () => {
            const senha = 'Abc123';
            
            const resultado = LoginSchema.safeParse({
                ...loginValido,
                senha
            });
            
            expect(resultado.success).toBe(false);
            expect(resultado.error.issues[0].path).toContain('senha');
            expect(resultado.error.issues[0].message).toBe('A senha deve ter pelo menos 8 caracteres.');
        });

        it('deve rejeitar senhas sem letras maiúsculas', () => {
            const senha = 'senha123';
            
            const resultado = LoginSchema.safeParse({
                ...loginValido,
                senha
            });
            
            expect(resultado.success).toBe(false);
            expect(resultado.error.issues[0].path).toContain('senha');
            expect(resultado.error.issues[0].message).toContain('A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e no mínimo 8 caracteres.');
        });

        it('deve rejeitar senhas sem letras minúsculas', () => {
            const senha = 'SENHA123';
            
            const resultado = LoginSchema.safeParse({
                ...loginValido,
                senha
            });
            
            expect(resultado.success).toBe(false);
            expect(resultado.error.issues[0].path).toContain('senha');
            expect(resultado.error.issues[0].message).toContain('A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e no mínimo 8 caracteres.');
        });

        it('deve rejeitar senhas sem números', () => {
            const senha = 'SenhaTeste';
            
            const resultado = LoginSchema.safeParse({
                ...loginValido,
                senha
            });
            
            expect(resultado.success).toBe(false);
            expect(resultado.error.issues[0].path).toContain('senha');
            expect(resultado.error.issues[0].message).toContain('A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e no mínimo 8 caracteres.');
        });
    });

    it('deve rejeitar objeto com campos ausentes', () => {
        const camposObrigatorios = ['matricula', 'email', 'senha'];
        
        camposObrigatorios.forEach(campo => {
            const dadosLogin = { ...loginValido };
            delete dadosLogin[campo];
            
            const resultado = LoginSchema.safeParse(dadosLogin);
            expect(resultado.success).toBe(false);
            expect(resultado.error.issues[0].path).toContain(campo);
        });
    });

    it('deve indicar múltiplos erros quando vários campos são inválidos', () => {
        const loginInvalido = {
            matricula: 'ABC123',
            email: 'email-invalido',
            senha: '123'
        };
        
        const resultado = LoginSchema.safeParse(loginInvalido);
        expect(resultado.success).toBe(false);
        expect(resultado.error.issues.length).toBe(4);
        
        const erros = resultado.error.issues.map(issue => issue.path[0]);
        expect(erros).toContain('matricula');
        expect(erros).toContain('email');
        expect(erros).toContain('senha');
    });
});