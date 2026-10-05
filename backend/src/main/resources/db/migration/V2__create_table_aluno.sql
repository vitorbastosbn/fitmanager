CREATE TABLE tb_aluno (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT UNIQUE REFERENCES tb_usuario(id),
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    logradouro VARCHAR(150),
    numero VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(8),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_aluno_status CHECK (status IN ('ATIVO', 'INATIVO', 'TRANCADO'))
);

CREATE INDEX idx_aluno_cpf ON tb_aluno(cpf);
CREATE INDEX idx_aluno_nome ON tb_aluno(nome);
CREATE INDEX idx_aluno_status ON tb_aluno(status);
