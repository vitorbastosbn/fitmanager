# Especificação de Domínio: Autenticação e Perfis (Auth)

## 1. Visão Geral e Escopo
O domínio de **Autenticação e Perfis** é responsável pelo gerenciamento de credenciais, controle de acesso baseado em papéis (RBAC) e emissão/validação de tokens stateless JWT para todos os atores do sistema FitManager.

### Atores e Papéis
- **`ADMIN`**: Acesso completo ao sistema e gerenciamento de colaboradores.
- **`RECEPCIONISTA`**: Acesso a operações de recepção, alunos, matrículas e pagamentos.
- **`INSTRUTOR`**: Acesso a exercícios e prescrição de treinos.
- **`ALUNO`**: Acesso ao portal do aluno, consulta de treinos, pagamentos e geração de QR Code.

---

## 2. Requisitos em Notação EARS

### Requisitos Funcionais

- **[EARS-AUTH-001] (Event-driven)**: **QUANDO** um usuário submeter credenciais válidas (e-mail e senha) no endpoint de login, **O SISTEMA DEVE** gerar e retornar um token JWT assinado contendo o ID do usuário, e-mail, perfil e tempo de expiração.
- **[EARS-AUTH-002] (Unwanted behaviour)**: **SE** as credenciais informadas forem inválidas ou o usuário estiver inativo, **ENTÃO O SISTEMA DEVE** recusar a autenticação retornando HTTP 401 Unauthorized com mensagem padronizada, sem expor qual campo falhou.
- **[EARS-AUTH-003] (State-driven)**: **ENQUANTO** uma requisição a rotas protegidas for recebida com um token JWT válido e não expirado no cabeçalho `Authorization: Bearer <token>`, **O SISTEMA DEVE** autorizar a execução de acordo com o perfil (`ROLE_*`) exigido no endpoint.
- **[EARS-AUTH-004] (Unwanted behaviour)**: **SE** um usuário autenticado tentar acessar um recurso fora do escopo de seu perfil, **ENTÃO O SISTEMA DEVE** retornar HTTP 403 Forbidden.
- **[EARS-AUTH-005] (Event-driven)**: **QUANDO** um administrador cadastrar um novo colaborador (Recepcionista, Instrutor ou outro Admin), **O SISTEMA DEVE** armazenar a senha criptografada utilizando algoritmo BCrypt com fator de custo mínimo 12.
- **[EARS-AUTH-006] (Event-driven)**: **QUANDO** um aluno for cadastrado no sistema, **O SISTEMA DEVE** criar automaticamente seu acesso com perfil `ROLE_ALUNO`, gerando senha temporária inicial composta pelos 6 primeiros dígitos numéricos do seu CPF e marcando a flag `primeiro_acesso = TRUE`.
- **[EARS-AUTH-007] (State-driven)**: **ENQUANTO** um usuário estiver com a flag `primeiro_acesso = TRUE`, **O SISTEMA DEVE** exigir obrigatoriamente a redefinição de sua senha definitiva antes de liberar acesso às demais funcionalidades da plataforma.

### Requisitos Não Funcionais

- **[RNF-AUTH-001]**: Senhas devem atender aos critérios mínimos: mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.
- **[RNF-AUTH-002]**: O token JWT de acesso deve possuir tempo de expiração configurável (padrão: 8 horas para uso operacional do MVP).
- **[RNF-AUTH-003]**: Nenhuma senha em texto puro deve ser gravada em logs, cache ou banco de dados.

---

## 3. Casos de Borda e Regras de Negócio

1. **E-mail Único**: Não é permitido duplicidade de e-mail no sistema; cada usuário possui chave única por e-mail.
2. **Revogação/Bloqueio**: Usuários com campo `ativo = false` têm sua autenticação rejeitada imediatamente, mesmo que a senha esteja correta.
3. **Imutabilidade de Papel Próprio**: Um usuário não pode alterar o seu próprio perfil de acesso (`role`) para evitar escalada de privilégios.

---

## 4. Critérios de Aceite (Gherkin)

```gherkin
Cenário: Autenticação bem-sucedida
  Dado que existe um usuário com e-mail "recepcao@academia.com" e perfil "ROLE_RECEPCIONISTA" ativo
  Quando for enviado um POST para "/api/v1/auth/login" com e-mail e senha corretos
  Então o sistema retorna status HTTP 200 OK
  E o corpo da resposta contém o token JWT, tempo de expiração e dados básicos do usuário

Cenário: Tentativa de login com senha incorreta
  Dado que existe um usuário cadastrado
  Quando for enviado um POST para "/api/v1/auth/login" com senha incorreta
  Então o sistema retorna status HTTP 401 Unauthorized
  E nenhuma informação de sessão ou token é emitida

Cenário: Tentativa de acesso sem autorização suficiente
  Dado que um usuário autenticado possui o perfil "ROLE_ALUNO"
  Quando ele tentar realizar uma requisição para rota restrita ao "ROLE_ADMIN"
  Então o sistema retorna status HTTP 403 Forbidden
```
