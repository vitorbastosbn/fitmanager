CREATE TABLE tb_usuario (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    primeiro_acesso BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_usuario_perfil CHECK (perfil IN ('ROLE_ADMIN', 'ROLE_RECEPCIONISTA', 'ROLE_INSTRUTOR', 'ROLE_ALUNO'))
);

CREATE INDEX idx_usuario_email ON tb_usuario(email);

-- Usuario Administrador Inicial para primeiro login (Senha: Admin@123)
-- BCrypt para 'Admin@123' gerado pelo Spring Security PasswordEncoder
INSERT INTO tb_usuario (nome, email, senha_hash, perfil, ativo, primeiro_acesso)
VALUES (
    'Administrador do Sistema',
    'admin@fitmanager.com',
    '$2a$10$G2dbjtoED0uEDcuRKoFk8uySuM1V6oWd7ImOCzJom7koPfO9ybWie',
    'ROLE_ADMIN',
    TRUE,
    FALSE
);
