# Endpoints com Foco em Casos de Uso

## 3.1 /login (ou endpoint de autenticação)

### Função de Negócio
- Permitir que os usuários administrativos (professores, técnicos, alunos autorizados) acessem o sistema administrativo.

### Regras de Negócio Envolvidas
- **Verificação de Credenciais:** Validação da matrícula e senha.
- **Bloqueio de Usuários:** Impedir o acesso de usuários inativos ou não autorizados.

### Resultado Esperado
- Dados básicos do usuário, como nome, status (ativo/inativo).

## 3.2 / (CRUD Principal)
Endpoints principais responsáveis pelas operações de CRUD (Create, Read, Update, Delete) do recurso central do sistema.

## 3.2.1 POST /eventos

**Caso de Uso** 
-Criar um novo evento no sistema (painel de administração).

**Regras de Negócio**
- **Validação de Atributos Obrigatórios:** Garantir que dados essenciais (título, data, local, forma de inscrição) sejam fornecidos.
- **Vinculação de Cadastro:** O cadastro de um evento é vinculado ao usuario que criou na plataforma.
- **Definição de Status:** Atribuir um status ao evento (ativo, concluído).

## 3.2.2 GET /eventos

**Caso de Uso**  
- Listar todos os eventos disponíveis no sistema, com variações conforme o tipo de acesso (painel administrativo ou totem).

**Regras de Negócio**
- **A Definir**

**Resultado Esperado**
- Lista paginada de eventos conforme a origem da requisição.

## 3.2.3 GET /eventos/:id

**Caso de Uso**  
- Obter os detalhes completos de um evento específico.

**Regras de Negócio**
- **Validação de Existência:** Verificar se o evento existe antes de retornar os dados.

**Resultado Esperado**
- Objeto contendo todos os dados detalhados do evento selecionado, incluindo mídias.

## 3.2.4 PUT /eventos/:id

**Caso de Uso**  
- Editar os dados de um evento existente através do painel administrativo.

**Regras de Negócio**
- **Permissão de Edição:** Somente o usuário criador (ou autorizado) pode alterar.
- **Validação de Conflitos:** Garantir que não existam eventos conflitantes com mesmo nome, local e horário.

**Resultado Esperado**
- Evento atualizado com sucesso e confirmação de modificação.

## 3.2.5 DELETE /eventos/:id

**Caso de Uso**  
- Excluir ou inativar um evento.

**Regras de Negócio**
- **Avaliação de Inscrições:** Caso o evento tenha inscrições, ele deve ser apenas inativado.

**Resultado Esperado**
- Evento removido ou marcado como inativo. Registro gerado em log do sistema.

## 3.3 Endpoints Adicionais

### 3.3.1 GET /eventos/:id/midias

**Caso de Uso**  
- Obter todas as mídias (fotos e vídeos) associadas a um evento.

**Regras de Negócio**
- **Verificação de Existência:** Retornar erro se o evento não for encontrado.
- **Mídias Públicas:** Apenas conteúdos autorizados devem ser exibidos no totem.

**Resultado Esperado**
- Lista de mídias com seus respectivos tipos e URLs.

### 3.3.2 POST /eventos/:id/midias

**Caso de Uso**  
- Cadastrar uma nova mídia vinculada a um evento existente.

**Regras de Negócio**
- **Validação de Tipo:** Apenas imagens e vídeos com formatos aceitos (JPG, PNG, MP4).
- **Tamanho Máximo:** Até 10MB por mídia.

**Resultado Esperado**
- Mídia adicionada com sucesso ao evento.

### 3.3.3 GET /eventos/:id/qrcode

**Caso de Uso**  
- Retornar o QR Code com o link de inscrição do evento (para ser exibido no totem).

**Regras de Negócio**
- **Redirecionamento Externo:** O QR Code leva para um formulário externo.
- **Atualização de Código:** QR Code pode ser alterado posteriormente.

**Resultado Esperado**
- Link ou imagem base64 do QR Code com o endereço do formulário.

### 3.3.4 GET /eventos/anteriores/slideshow

**Caso de Uso**  
- Exibir automaticamente os eventos passados com mídias no modo slideshow no totem.

**Regras de Negócio**
- **Filtragem por Data:** Apenas eventos com data anterior ao dia atual.
- **Formato para Loop:** Os dados devem ser otimizados para exibição contínua (loop).

**Resultado Esperado**
- Lista de eventos com mídias (imagens e vídeos) em ordem decrescente de data.

## 3.4 /inscricoes

### 3.4.1 GET /inscricoes/:eventoId

**Caso de Uso**  
- Listar todos os inscritos em um evento específico (painel administrativo).

**Regras de Negócio**
- **Consulta Segura:** Apenas usuários autenticados podem acessar.

**Resultado Esperado**
- Lista dos participantes inscritos com nome e e-mail.

### 3.4.2 POST /inscricoes

**Caso de Uso**  
- Registrar uma nova inscrição internamente (caso não seja feita via formulário externo).

**Regras de Negócio**
- **Dados Obrigatórios:** Nome, e-mail.

**Resultado Esperado**
- Inscrição registrada com sucesso.

## 3.5 /logs

### POST /logs

**Caso de Uso**  
- Registrar ações de sistema ou de usuários para auditoria e rastreamento.

**Regras de Negócio**
- **Registro de Ações:** Criar, editar, excluir, login, falhas, etc.

**Resultado Esperado**
- Log gravado com dados de ação, data e usuário responsável.

## Considerações Finais

- **Totem:** O totem utiliza apenas rotas públicas (GET).
- **Manipulação de Dados:** Toda gestão de dados é feita via painel autenticado.
- **Segurança:** Logs garantem rastreabilidade e transparência.
- **Documentação e Monitoramento:** Manter uma documentação atualizada dos endpoints e monitorar as requisições para garantir a integridade e disponibilidade do sistema.
