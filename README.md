# FitManager 🏋️‍♂️

> Sistema completo e moderno de gestão para academias, estúdios e centros esportivos.

FitManager é uma plataforma robusta desenvolvida com arquitetura limpa e desacoplada, utilizando **Spring Boot 3.4** no backend e **Angular 22** com **Tailwind CSS v4** no frontend. O sistema abrange todo o ciclo operacional de uma academia moderna: controle de acessos em tempo real com QR Code dinâmico, prescrição e acompanhamento de treinos, gestão financeira automatizada, planos e matrículas, e autenticação baseada em perfis de acesso.

---

## 🚀 Tecnologias

### Backend
- **Java 21+** (compatível com JDK 26)
- **Spring Boot 3.4.3** (Spring Data JPA, Spring Security, Spring Validation)
- **PostgreSQL 16** com migrações automatizadas via **Flyway**
- **JWT (JSON Web Token)** com validação de primeiro acesso (ADR-008)
- **HMAC-SHA512** com Nonce único para QR Codes de acesso temporário (60s)
- **H2 Database** para suíte de testes de integração automatizados

### Frontend
- **Angular 22** (Standalone Components, Signals, Router Guards, HTTP Interceptors)
- **Tailwind CSS v4** (Design System responsivo em Dark Mode, Glassmorphism)
- **Heroicons / SVG Icons**
- **Geração nativa de SVG para QR Code**

### Infraestrutura
- **Docker** & **Docker Compose** (PostgreSQL 16)
- **Maven Wrapper** & **NPM**

---

## 🏛️ Módulos do Sistema

O sistema é dividido em 6 domínios de negócio bem delimitados:

1. **Autenticação e Segurança (`/auth`)**
   - Controle de acesso baseado em papéis (`ADMIN`, `RECEPCIONISTA`, `INSTRUTOR`, `ALUNO`).
   - Bloqueio estrito de primeiro acesso com obrigatoriedade de redefinição de senha segura.
   - Auditoria de dados do usuário autenticado (`/auth/me`).

2. **Gestão de Alunos (`/alunos`)**
   - Cadastro completo de alunos com validação de CPF (Módulo 11) e unicidade.
   - Geração automática de credenciais de acesso para novos alunos (6 primeiros dígitos do CPF).
   - Busca textual por nome/CPF e filtros por status (`ATIVO`, `INATIVO`, `BLOQUEADO`).

3. **Planos e Matrículas (`/planos`, `/matriculas`)**
   - Catálogo de planos com periodicidades (Mensal, Trimestral, Anual).
   - Matrícula com cálculo automático de vigência e regras de transição de status.
   - Regra de negócio: garantia de no máximo 1 matrícula ativa simultânea por aluno.

4. **Financeiro (`/financeiro`)**
   - Geração de cobranças com base nas assinaturas e planos contratados.
   - Registro e conciliação de pagamentos (PIX, Cartão de Crédito, Cartão de Débito, Dinheiro).
   - Idempotência no recebimento de pagamentos e rastreabilidade total.

5. **Frequência e Acesso (`/frequencia`)**
   - **QR Code Dinâmico**: Token efêmero de 60 segundos com HMAC-SHA512 e nonce UUID único (ADR-009).
   - Validação em tempo real de inadimplência: bloqueio automático caso haja faturas em aberto há mais de 5 dias (ADR-010).
   - Prevenção de duplicidade: bloqueio de acessos repetidos no intervalo de 30 minutos.
   - Terminal de Catraca/Scanner com feedback sonoro e visual instantâneo (Acesso Permitido / Bloqueado).

6. **Treinos e Exercícios (`/treinos`, `/exercicios`)**
   - Catálogo com mais de 35 exercícios pré-configurados distribuídos por grupos musculares.
   - Prescrição de fichas de treino personalizadas divididas por rotinas (A, B, C, D, etc.).
   - Histórico e versionamento automático de fichas anteriores ao ativar uma nova prescrição.
   - Registro de execução de cargas e repetições pelo próprio aluno (ADR-011).

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
- **Docker** e **Docker Compose**
- **Java 21+** (JDK)
- **Node.js 20+** e **npm**

### 1. Iniciar o Banco de Dados (PostgreSQL)
Na raiz do projeto:
```bash
docker compose up -d
```
O banco PostgreSQL estará ativo na porta `5432` com as credenciais padrão:
- **Database**: `fitmanager_db`
- **User**: `fitmanager`
- **Password**: `fitmanager_pwd`

### 2. Iniciar o Backend (Spring Boot)
No diretório `backend`:
```bash
./mvnw spring-boot:run
```
*(No Windows PowerShell: `.\mvnw.cmd spring-boot:run`)*

A API estará disponível em: `http://localhost:8080`

### 3. Iniciar o Frontend (Angular)
No diretório `frontend`:
```bash
npm install
npm start
```
A aplicação web estará acessível em: `http://localhost:4200`

---

## 👤 Credenciais Padrão de Acesso

Ao iniciar a aplicação pela primeira vez, as migrações Flyway populam o usuário administrador inicial:

- **E-mail:** `admin@fitmanager.com`
- **Senha:** `Admin@123`
- **Perfil:** `ADMIN`

---

## 🧪 Suíte de Testes Automatizados

Para executar os testes de integração e regras de negócio do backend:
```bash
cd backend
./mvnw test
```

Para validar a integridade de compilação do frontend:
```bash
cd frontend
npm run build
```

---

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e de demonstração tecnológica. Distribuído sob a licença MIT.
