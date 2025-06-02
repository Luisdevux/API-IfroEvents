# Documentação de Endpoints – IFRO EVENTS

## Endpoints com Foco em Casos de Uso

---

## 1. Cadastro e Login de Usuário

### 1.1 POST /auth/register

#### Caso de Uso
Criar um novo usuário no sistema.

#### Regras de Negócio Envolvidas
- **Validação de dados:**
  - Nome: mínimo 3 caracteres.
  - Matrícula: somente números, idêntica à matrícula vinculada ao SUAP.
  - Senha: mínimo 8 caracteres, contendo letras maiúsculas, minúsculas, números e caracteres especiais.
  - Confirmação de senha: deve ser idêntica à senha original.
- **Segurança:** Criptografar a senha antes do armazenamento.
- **Contexto:** O cadastro de usuários é restrito ao painel administrativo. O Totem não possui login ou cadastro de usuários.

#### Resultado Esperado
- Usuário criado com sucesso.
- Retorno do objeto de usuário com identificador único.
- Em caso de falha, retornar mensagem de erro apropriada.

---

### 1.2 POST /auth/login

#### Caso de Uso
Login de usuário administrativo no sistema (painel).

#### Regras de Negócio Envolvidas
- Verificação de credenciais: matrícula e senha válidas.

#### Resultado Esperado
- Token JWT de autenticação.
- Retorno do objeto de usuário autenticado.
- Em caso de falha, retornar mensagem de erro.

---

## 2. Eventos

### 2.1 POST /eventos

#### Caso de Uso
Cadastrar um novo evento pelo painel administrativo.

#### Regras de Negócio
- **Campos obrigatórios:** título, descrição, local, data, forma de inscrição, mídias.
- **Vinculação ao usuário:** evento é associado ao usuário autenticado.
- **QR Code:** pode ser gerado a partir do link de inscrição.

#### Resultado
- Evento criado com ID único.
- Retorno do objeto completo.
- Mensagem de erro em caso de falha de validação ou persistência.

---

### 2.2 GET /eventos

#### Caso de Uso
Listar todos os eventos.

#### Regras de Negócio
- **Totem:** lista eventos passados, atuais e futuros com dados visuais apenas.
- **Painel:** lista todos os eventos com detalhes administrativos.

#### Resultado
- Array de eventos com dados filtrados por origem (painel ou totem).
- Em caso de falha, retornar mensagem de erro.

---

### 2.3 GET /eventos/:id

#### Caso de Uso
Obter os detalhes de um evento específico.

#### Regras de Negócio
- **Totem:** exibe apenas dados públicos do evento.
- **Painel:** exibe todos os campos administrativos.

#### Resultado
- Objeto do evento retornado com base no ID.
- Se ID for inválido, retorna erro de validação (400).
- Se não encontrado, retorna erro 404.

---

### 2.4 PATCH /eventos/:id

#### Caso de Uso
Editar os dados de um evento.

#### Regras de Negócio
- **Acesso restrito:** somente o usuário criador pode editar.
- **Permissão compartilhada (futuro):** permitir edição colaborativa.
- **Validação parcial:** apenas campos alterados são validados.

#### Resultado
- Evento atualizado e retornado.
- Em caso de erro de permissão ou ID inválido, retorna erro.

---

### 2.5 DELETE /eventos/:id

#### Caso de Uso
Remover um evento do sistema.

#### Regras de Negócio
- Ação registrada para fins de auditoria (log).
- Apenas o criador do evento pode removê-lo.

#### Resultado
- Evento removido com sucesso.
- Log gerado.
- Em caso de erro, retorna status e mensagem apropriada.

---

## 3. Endpoints Adicionais

### 3.1 POST /eventos/:id/midia/:tipo

#### Caso de Uso
Adicionar uma mídia ao evento (capa, carrossel ou vídeo).

#### Regras de Negócio
- **Tipos aceitos:** JPG, PNG (imagens), MP4 (vídeo).
- **Tamanho máximo:** 25MB.
- **Padrões visuais obrigatórios:**
  - Imagem de capa: 1280x720px (16:9),
  - Vídeo: resolução mínima 1280x720px,
  - Carrossel: 1024x768px (4:3 ou 3:2).
- **Tipo deve ser informado na URL como `capa`, `carrossel`, ou `video`.**
- Mídias com dimensões inválidas são rejeitadas automaticamente.

#### Resultado
- Mídia armazenada e vinculada ao evento.
- Retorno com dados da mídia.
- Mensagem de erro em caso de falha ou rejeição.

---

### 3.2 GET /eventos/:id/midias

#### Caso de Uso
Listar as mídias associadas a um evento.

#### Regras de Negócio
- **Totem:** acesso visual somente.
- **Painel:** exibe todas as mídias registradas com detalhes.

#### Resultado
- Array com as mídias agrupadas por tipo.
- Em caso de erro, retornar mensagem apropriada.

---

### 3.3 GET /eventos/:id/qrcode

#### Caso de Uso
Gerar um QR Code com o link de inscrição do evento.

#### Regras de Negócio
- QR Code gerado a partir do campo `linkInscricao`.
- Formato base64 pronto para ser exibido em tela ou baixado.
- Exclusivo para exibição no totem.

#### Resultado
- Imagem do QR Code (base64).
- Link externo incluso na resposta.
- Em caso de erro, retornar mensagem apropriada.

---

### 3.4 GET /eventos/anteriores/slideshow

#### Caso de Uso
Exibir uma lista visual contínua de eventos passados no modo de descanso do totem.

#### Regras de Negócio
- Somente eventos com `dataEvento < hoje`.
- **Campos otimizados:** apenas título, descrição e imagem de capa.
- Padrão de visualização passiva, sem interação.

#### Resultado
- Lista simplificada de eventos passados.
- Ideal para exibição contínua (slideshow).
- Em caso de falha, retornar mensagem de erro.

---

## Considerações Técnicas e Finais

- **Totem:** acesso público e restrito à visualização.
- **Painel Administrativo:** exige login com JWT.
- **Validações:** feitas com Zod e schemas robustos.
- **Logs:** todas ações importantes são rastreadas.
- **Responsividade:** sistema pronto para ser consumido por painéis administrativos, totens e apps móveis.
