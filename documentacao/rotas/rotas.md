# Documentação de Endpoints – IFRO EVENTS  

**Endpoints com Foco em Casos de Uso**

---

## 1. Cadastro e Login de Usuário

### 1.1 POST /auth/register

#### Caso de Uso
- Criar um novo usuário no sistema.

#### Regras de Negócio Envolvidas
- **Validação de dados:**
   - Nome: Mínimo 3 caracteres.
   - Matricula: Somente números, idêntica a matricula vinculada ao SUAP.
   - Senha: Mínimo 8 caracteres, letras maiúsculas, letras minúsculas, números, caracteres especiais.
   - Confirmação de senha deve ser idêntica.
- **Segurança:** Criptografar senha antes do armazenamento.
- **Contexto:** O cadastro de usuários é restrito para o painel administrativo. O Totem não possui login ou cadastro de usuários.

#### Resultado Esperado
- Registro de usuário criado com sucesso.
- Retorno do objeto de usuário criado com identificador único.
- Em caso de falha, retornar mensagem de erro.

---

## 1.2 POST /auth/login (ou endpoint de autenticação)

#### Caso de Uso
- Permitir que os usuários administrativos (professores, técnicos e alunos autorizados) acessem o sistema administrativo (painel).

### Regras de Negócio Envolvidas
- **Verificação de Credenciais:** Matrícula e senha válidas.

### Resultado Esperado
- Token JWT de autenticação.
- Retornar do objeto de usuário.
- Em caso de falha, retornar mensagem de erro.

---

## 2. Eventos

### 2.1 POST /eventos

#### Caso de Uso
- Cadastrar um novo evento no sistema pelo painel administrativo.

#### Regras de Negócio
- **Campos Obrigatórios:** título, data, local, forma de inscrição, midias.
- **Vinculação ao Usuário:** associar o evento cadastrado ao usuário autenticado.
- **QR Code:** pode ser gerado posteriormente.

#### Resultado
- Retorno do objeto evento criado com ID único.
- Confirmação de cadastro.
- Em caso de falha, retornar mensagem de erro.

---

### 2.2 GET /eventos

#### Caso de Uso
- Listar todos os eventos do sistema, variando a resposta conforme a origem (painel ou totem).

#### Regras de Negócio
- **Totem:** Eventos passados, atuais e futuros, sem campos administrativos.
- **Painel:** todos os eventos (anteriores, atuais e futuros).
<!-- - **Identificação da Origem:** via header (`x-client-type: painel` ou ausência para totem). -->

#### Resultado
- Lista de eventos segmentada.
- Dados visuais com informações para o totem ou completos para o painel.
- Em caso de falha, retornar mensagem de erro.


---

### 2.3 GET /eventos/:id

#### Caso de Uso
- Obter os detalhes de um evento específico.

#### Regras de Negócio
- **Totem:** exibe apenas dados públicos do evento.
- **Painel:** exibe todos os campos (incluindo quem cadastrou, etc.).

#### Resultado
- Objeto completo do evento.
- Mensagem de erro se o ID não for encontrado.

---

### 2.4 PATCH /eventos/:id

#### Caso de Uso
- Editar um evento cadastrado.

#### Regras de Negócio
- **Acesso Restrito:** apenas o usuário criador pode editar ou se o mesmo permitir que outro usuário edite.
- **Validação de Conflito:** permitir atualização de um ou mais campos independentemente.
- **Validação:** verificar a integridade apenas dos campos alterados.


#### Resultado
- Evento atualizado.
- Retorno do objeto evento atualizado.
- Mensagem de sucesso ou erro de permissão.

---

### 2.5 DELETE /eventos/:id

#### Caso de Uso
- Remover um evento existente do sistema.

#### Regras de Negócio
- **Registro em Log:** ação registrada para fins de auditoria.

#### Resultado
- Evento removido com sucesso.
- Em caso de falha, retornar mensagem de erro.
- Log gerado.

---

## 3. Endpoints Adicionais

### 3.1 POST /eventos/:id/midias

#### Caso de Uso
- Cadastrar imagem ou vídeo em um evento.

#### Regras de Negócio
- **Tipos aceitos:** JPG, PNG, MP4.
- **Tamanho máximo:** 25MB.

#### Resultado
- Mídia associada ao evento.
- Retorno com dados da mídia cadastrada.
- Em caso de falha, retornar mensagem de erro.

---

### 3.2 GET /eventos/:id/midias

#### Caso de Uso
- Exibir mídias associadas a um evento.

#### Regras de Negócio
- **Totem:** acesso à visualização das mídias públicas do evento.
- **Painel:** acesso completo.

#### Resultado
- Lista de mídias.
- Em caso de falha, retornar mensagem de erro.

---

### 3.3 GET /eventos/:id/qrcode

#### Caso de Uso
- Obter QR Code com link de inscrição para exibição no totem.

#### Regras de Negócio
- **Totem:** exibe o QR code com link externo.
- **Geração Dinâmica:** no momento do cadastro ou edição é passado o link que será gerado posteriormente.

#### Resultado
- QR Code em base64 ou link da imagem.
- Link de redirecionamento para o formulário externo.
- Em caso de falha, retornar mensagem de erro.

---

### 3.4 GET /eventos/anteriores/slideshow

#### Caso de Uso
- Exibir eventos passados em slideshow contínuo no totem.

#### Regras de Negócio
- **Somente eventos com data < hoje.**
- **Formato otimizado:** campos visuais, incluindo mídias.

#### Resultado
- Lista contínua de eventos passados para exibição automática.
- Em caso de falha, retornar mensagem de erro.

---

## 4. Logs

### POST /logs

#### Caso de Uso
- Registrar ações relevantes realizadas no sistema (painel).

#### Regras de Negócio
- **Ações logáveis:** login, edição, exclusão, criação, etc.
- **Auditoria:** manter histórico com timestamp e usuário.

#### Resultado
- Log registrado com sucesso.

---

## Considerações Finais

- **Totem:** acesso público, sem interações administrativas de manipulação.
- **Painel:** acesso restrito, com autenticação obrigatória.
- **Validação de Dados:** presente em todas as rotas.
- **Registro de Logs:** ações administrativas são auditadas.
- **Documentação e Monitoramento:** Manter uma documentação atualizada dos endpoints e monitorar as requisições para garantir a integridade e disponibilidade do sistema.
