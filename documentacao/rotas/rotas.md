# Documentação de Endpoints – IFRO EVENTS  

**Endpoints com Foco em Casos de Uso**

---

## 3.1 /login (ou endpoint de autenticação)

### Função de Negócio
Permitir que os usuários administrativos (professores, técnicos e alunos autorizados) acessem o sistema administrativo (painel) com suas credenciais vinculadas ao SUAP IFRO.

### Regras de Negócio Envolvidas
- **Verificação de Credenciais:** Matrícula e senha válidas.
- **Perfil do Usuário via SUAP:** As informações sobre os usuários são extraídas diretamente do SUAP.
- **Bloqueio de Usuários:** Negar acesso a usuários inativos ou não autenticados ao SUAP.

### Resultado Esperado
- Token JWT de autenticação.
- Dados básicos do usuário: nome, tipo (professor, técnico, aluno), status.

---

## 3.2 /eventos (CRUD Principal)

### 3.2.1 POST /eventos

#### Caso de Uso
Cadastrar um novo evento no sistema pelo painel administrativo.

#### Regras de Negócio
- **Campos obrigatórios:** título, data, local, forma de inscrição.
- **Vinculação ao Usuário:** associar o evento ao usuário autenticado.
- **QR Code:** pode ser gerado posteriormente.
- **Status Inicial:** evento ativo por padrão.

#### Resultado
- Evento criado com ID único.
- Confirmação de cadastro.

---

### 3.2.2 GET /eventos

#### Caso de Uso
Listar todos os eventos do sistema, variando a resposta conforme a origem (painel ou totem).

#### Regras de Negócio
- **Totem:** Eventos passados, atuais e futuros, sem campos administrativos.
- **Painel:** todos os eventos (anteriores, atuais e futuros), com filtros e paginação.
<!-- - **Identificação da Origem:** via header (`x-client-type: painel` ou ausência para totem). -->

#### Resultado
- Lista de eventos segmentada.
- Dados visuais com informações para o totem ou completos para o painel.

---

### 3.2.3 GET /eventos/:id

#### Caso de Uso
Obter os detalhes de um evento específico.

#### Regras de Negócio
- **Totem:** exibe apenas dados públicos do evento.
- **Painel:** exibe todos os campos (incluindo quem cadastrou, status, etc.).

#### Resultado
- Objeto completo do evento.
- Mensagem de erro se o ID não for encontrado.

---

### 3.2.4 PUT /eventos/:id

#### Caso de Uso
Editar um evento cadastrado.

#### Regras de Negócio
- **Acesso Restrito:** apenas o usuário criador pode editar ou se o mesmo permitir que outro usuário edite.
- **Validação de Conflito:** não permitir sobreposição de data e local.

#### Resultado
- Evento atualizado.
- Mensagem de sucesso ou erro de permissão.

---

### 3.2.5 DELETE /eventos/:id

#### Caso de Uso
Excluir ou inativar um evento existente.

#### Regras de Negócio
- **Verificação de Inscrições:** se houver, tornar inativo.
- **Sem vínculos:** permitir exclusão direta.
- **Registro em Log:** ação registrada para fins de auditoria.

#### Resultado
- Evento removido ou marcado como inativo.
- Log gerado.

---

## 3.3 Endpoints Adicionais

### 3.3.1 POST /eventos/:id/midias

#### Caso de Uso
Cadastrar imagem ou vídeo em um evento.

#### Regras de Negócio
- **Tipos aceitos:** JPG, PNG, MP4.
- **Tamanho máximo:** 25MB.
- **Metadados:** data, tipo e descrição da mídia.

#### Resultado
- Mídia associada ao evento.
- Retorno com dados da mídia cadastrada.

---

### 3.3.2 GET /eventos/:id/midias

#### Caso de Uso
Exibir mídias associadas a um evento.

#### Regras de Negócio
- **Totem:** acesso à visualização das mídias públicas do evento.
- **Painel:** acesso completo.

#### Resultado
- Lista de mídias (com tipo e URL).

---

### 3.3.3 GET /eventos/:id/qrcode

#### Caso de Uso
Obter QR Code com link de inscrição para exibição no totem.

#### Regras de Negócio
- **Totem:** exibe o QR code com link externo.
- **Geração Dinâmica:** no momento do cadastro ou edição.

#### Resultado
- QR Code em base64 ou link da imagem.
- Link de redirecionamento para o formulário externo.

---

### 3.3.4 GET /eventos/anteriores/slideshow

#### Caso de Uso
Exibir eventos passados em slideshow contínuo no totem.

#### Regras de Negócio
- **Somente eventos com data < hoje.**
- **Formato otimizado:** campos visuais, incluindo mídias.

#### Resultado
- Lista contínua de eventos passados para exibição automática.

---

## 3.4 /logs

### POST /logs

#### Caso de Uso
Registrar ações relevantes realizadas no sistema (painel).

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
- **Não há sistema de permissões interno.** O tipo de usuário é determinado pela matrícula, validada via SUAP IFRO.
