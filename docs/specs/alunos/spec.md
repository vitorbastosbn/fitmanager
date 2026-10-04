# Especificação de Domínio: Alunos (Alunos)

## 1. Visão Geral e Escopo
O domínio de **Alunos** é responsável pelo ciclo de vida cadastral dos clientes da academia, incluindo dados pessoais (nome, CPF, data de nascimento), dados de contato (telefone, e-mail), endereço residencial e status cadastral (Ativo, Inativo, Trancado).

### Atores e Permissões
- **`ADMIN` e `RECEPCIONISTA`**: Cadastrar, visualizar, editar e alterar status cadastral de qualquer aluno.
- **`INSTRUTOR`**: Consultar lista e perfil de alunos (para acompanhamento e montagem de treinos).
- **`ALUNO`**: Visualizar seus próprios dados cadastrais e solicitar/atualizar contatos.

---

## 2. Requisitos em Notação EARS

### Requisitos Funcionais

- **[EARS-ALU-001] (Event-driven)**: **QUANDO** um recepcionista ou administrador submeter o formulário de cadastro de aluno com dados válidos, **O SISTEMA DEVE** persistir o registro do aluno, vincular ou criar a conta de usuário associada e atribuir o status inicial como `ATIVO`.
- **[EARS-ALU-002] (Unwanted behaviour)**: **SE** for submetido um cadastro com CPF já existente no sistema ou com dígitos verificadores inválidos, **ENTÃO O SISTEMA DEVE** rejeitar a operação com código HTTP 422 Unprocessable Entity, detalhando o erro.
- **[EARS-ALU-003] (State-driven)**: **ENQUANTO** um aluno estiver com status `ATIVO`, **O SISTEMA DEVE** permitir a contratação de planos e a atribuição de fichas de treino.
- **[EARS-ALU-004] (Event-driven)**: **QUANDO** um operador solicitar a busca de alunos, **O SISTEMA DEVE** fornecer paginação e filtros por nome, CPF e status.
- **[EARS-ALU-005] (Event-driven)**: **QUANDO** dados de contato ou endereço forem alterados, **O SISTEMA DEVE** registrar a data de atualização e manter o histórico de auditoria.
- **[EARS-ALU-006] (Unwanted behaviour)**: **SE** um aluno for inativado, **ENTÃO O SISTEMA DEVE** manter seus registros históricos (pagamentos, treinos, frequência), porém impedir novas operações ativas.

### Requisitos Não Funcionais

- **[RNF-ALU-001]**: Validação obrigatória de formato de CPF (algoritmo dos dígitos verificadores oficial da Receita Federal).
- **[RNF-ALU-002]**: Resposta da listagem paginada de alunos em menos de 300ms para bases de até 10.000 alunos.
- **[RNF-ALU-003]**: Adequação à LGPD (Lei Geral de Proteção de Dados): mascaramento de dados sensíveis em listagens públicas e permissão restrita de acesso aos dados cadastrais.

---

## 3. Casos de Borda e Regras de Negócio

1. **CPF Único**: O CPF é a chave de unicidade de pessoa física no sistema (apenas números armazenados no banco, 11 dígitos).
2. **Idade Mínima**: No MVP, alunos menores de 16 anos exigem registro do nome do responsável legal.
3. **Exclusão Lógica (*Soft Delete*)**: Alunos nunca são deletados fisicamente do banco de dados para resguardar integridade fiscal e de histórico. Utiliza-se inativação lógica.

---

## 4. Critérios de Aceite (Gherkin)

```gherkin
Cenário: Cadastro de novo aluno com sucesso
  Dado que o operador autenticado possui perfil "ROLE_RECEPCIONISTA"
  Quando ele enviar uma requisição POST para "/api/v1/alunos" com nome, CPF válido e e-mail não cadastrado
  Então o sistema persiste o aluno com status "ATIVO"
  E retorna HTTP 201 Created com os dados do aluno cadastrado e seu ID gerado

Cenário: Tentativa de cadastro com CPF duplicado
  Dado que já existe um aluno com o CPF "12345678901"
  Quando o operador tentar cadastrar outro aluno com o mesmo CPF
  Então o sistema retorna HTTP 422 Unprocessable Entity
  E detalha a mensagem "CPF já cadastrado para outro aluno"
```
