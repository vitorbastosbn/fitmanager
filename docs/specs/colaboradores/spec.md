# Especificação de Domínio: Colaboradores (Colaboradores)

## 1. Visão Geral e Escopo
O domínio de **Colaboradores** gerencia o corpo de funcionários e prestadores de serviço da academia, centralizando o controle de Instrutores, Recepcionistas e Administradores. O módulo vincula as informações profissionais e de contato à conta de autenticação do sistema (`Usuario`), permitindo atribuição de papéis, horários de turno e registro de habilitação profissional (ex: CREF para instrutores).

### Atores e Permissões
- **`ADMIN`**: Acesso exclusivo para criar, editar, listar, consultar e inativar colaboradores.
- **`RECEPCIONISTA` / `INSTRUTOR` / `ALUNO`**: Sem permissão de acesso à gestão de colaboradores.

---

## 2. Requisitos em Notação EARS

### Requisitos Funcionais

- **[EARS-COL-001] (Event-driven)**: **QUANDO** o administrador cadastrar um novo colaborador com perfil válido, **O SISTEMA DEVE** persistir o colaborador, criar a conta de usuário associada com a role correspondente (`ROLE_INSTRUTOR`, `ROLE_RECEPCIONISTA`, `ROLE_ADMIN`) e gerar a senha temporária inicial com flag `primeiro_acesso = true`.
- **[EARS-COL-002] (Unwanted behaviour)**: **SE** for submetido o cadastro de um colaborador com perfil `ROLE_INSTRUTOR` sem o preenchimento do registro do CREF, **ENTÃO O SISTEMA DEVE** rejeitar a requisição com HTTP 422 Unprocessable Entity, informando que o CREF é obrigatório para instrutores.
- **[EARS-COL-003] (Unwanted behaviour)**: **SE** for submetido um e-mail ou CPF já vinculado a outro colaborador ou usuário ativo, **ENTÃO O SISTEMA DEVE** impedir a duplicação e retornar HTTP 422 Unprocessable Entity.
- **[EARS-COL-004] (Event-driven)**: **QUANDO** o administrador solicitar a listagem de colaboradores, **O SISTEMA DEVE** disponibilizar filtros por perfil (`ADMIN`, `INSTRUTOR`, `RECEPCIONISTA`), status (`ATIVO`, `INATIVO`) e busca textual por nome/CPF.
- **[EARS-COL-005] (Event-driven)**: **QUANDO** um colaborador for inativado pelo administrador, **O SISTEMA DEVE** alterar seu status para `INATIVO`, revogar o acesso do usuário no login e desvincular atribuições ativas de novos alunos.
- **[EARS-COL-006] (State-driven)**: **ENQUANTO** um colaborador for o único administrador ativo no sistema, **O SISTEMA DEVE** bloquear sua própria inativação ou exclusão para prevenir perda irrevogável de gestão.

### Requisitos Não Funcionais

- **[RNF-COL-001]**: Senha inicial temporária gerada com hash seguro BCrypt (mínimo de 8 caracteres alfanuméricos com caracteres especiais).
- **[RNF-COL-002]**: Resposta da listagem de colaboradores em menos de 200ms.
- **[RNF-COL-003]**: Rastreabilidade total: registro de data de admissão e auditoria de quem criou ou alterou cada colaborador.

---

## 3. Casos de Borda e Regras de Negócio

1. **Validação de CREF**: Registro no formato `000000-G/UF` ou numérico validado para profissionais de Educação Física.
2. **Separação de Papéis**: Um colaborador possui exatamente um perfil primário de atuação no sistema.
3. **Turno de Trabalho**: Valores permitidos: `MANHA`, `TARDE`, `NOITE`, `INTEGRAL`.
4. **Soft Delete**: Inativação lógica com bloqueio imediato do token JWT nas próximas requisições.

---

## 4. Critérios de Aceite (Gherkin)

```gherkin
Cenário: Cadastro de instrutor com CREF válido
  Dado que o usuário autenticado possui perfil "ROLE_ADMIN"
  Quando ele enviar uma requisição POST para "/api/v1/colaboradores" informando nome, CPF, e-mail, perfil "ROLE_INSTRUTOR" e CREF "012345-G/SP"
  Então o sistema persiste o colaborador com status "ATIVO"
  E cria a conta de usuário associada com perfil "ROLE_INSTRUTOR"
  E retorna HTTP 201 Created

Cenário: Tentativa de cadastro de instrutor sem CREF
  Dado que o usuário autenticado é um administrador
  Quando ele tentar cadastrar um colaborador com perfil "ROLE_INSTRUTOR" sem fornecer o CREF
  Então o sistema retorna HTTP 422 Unprocessable Entity
  E detalha a mensagem "CREF é obrigatório para colaboradores com função de Instrutor"

Cenário: Bloqueio de inativação do último administrador
  Dado que existe apenas 1 colaborador com perfil "ROLE_ADMIN" ativo no sistema
  Quando for solicitada a inativação deste administrador
  Então o sistema rejeita a operação com HTTP 400 Bad Request
  E informa "Não é permitido inativar o único administrador do sistema"
```
