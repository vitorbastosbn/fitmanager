CREATE TABLE tb_colaborador (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT UNIQUE NOT NULL REFERENCES tb_usuario(id),
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    cargo_perfil VARCHAR(50) NOT NULL,
    cref VARCHAR(30),
    turno VARCHAR(30) NOT NULL DEFAULT 'INTEGRAL',
    data_admissao DATE NOT NULL DEFAULT CURRENT_DATE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_colaborador_cargo CHECK (cargo_perfil IN ('ROLE_ADMIN', 'ROLE_INSTRUTOR', 'ROLE_RECEPCIONISTA')),
    CONSTRAINT ck_colaborador_turno CHECK (turno IN ('MANHA', 'TARDE', 'NOITE', 'INTEGRAL'))
);

CREATE INDEX idx_colaborador_cpf ON tb_colaborador(cpf);
CREATE INDEX idx_colaborador_email ON tb_colaborador(email);
CREATE INDEX idx_colaborador_cargo ON tb_colaborador(cargo_perfil);
