CREATE TABLE tb_exercicio (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    grupo_muscular VARCHAR(20) NOT NULL,
    instrucoes TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_exercicio_grupo CHECK (grupo_muscular IN ('PEITO', 'COSTAS', 'PERNAS', 'OMBROS', 'BRACOS', 'ABDOMEN', 'CARDIO'))
);

CREATE TABLE tb_ficha_treino (
    id BIGSERIAL PRIMARY KEY,
    aluno_id BIGINT NOT NULL REFERENCES tb_aluno(id),
    instrutor_id BIGINT NOT NULL REFERENCES tb_usuario(id),
    objetivo VARCHAR(100) NOT NULL,
    data_inicio DATE NOT NULL,
    data_validade DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVA',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_ficha_status CHECK (status IN ('ATIVA', 'HISTORICO'))
);

CREATE TABLE tb_divisao_treino (
    id BIGSERIAL PRIMARY KEY,
    ficha_id BIGINT NOT NULL REFERENCES tb_ficha_treino(id) ON DELETE CASCADE,
    letra VARCHAR(2) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    ordem INT NOT NULL DEFAULT 1
);

CREATE TABLE tb_item_divisao (
    id BIGSERIAL PRIMARY KEY,
    divisao_id BIGINT NOT NULL REFERENCES tb_divisao_treino(id) ON DELETE CASCADE,
    exercicio_id BIGINT NOT NULL REFERENCES tb_exercicio(id),
    ordem_execucao INT NOT NULL DEFAULT 1,
    series INT NOT NULL CHECK (series > 0),
    repeticoes VARCHAR(20) NOT NULL,
    carga_kg NUMERIC(6,2) NOT NULL DEFAULT 0.0 CHECK (carga_kg >= 0),
    descanso_segundos INT NOT NULL CHECK (descanso_segundos > 0),
    observacoes VARCHAR(255)
);

CREATE TABLE tb_registro_execucao_treino (
    id BIGSERIAL PRIMARY KEY,
    aluno_id BIGINT NOT NULL REFERENCES tb_aluno(id),
    item_divisao_id BIGINT NOT NULL REFERENCES tb_item_divisao(id),
    data_hora_execucao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    carga_utilizada_kg NUMERIC(6,2) NOT NULL CHECK (carga_utilizada_kg >= 0),
    repeticoes_realizadas INT NOT NULL CHECK (repeticoes_realizadas > 0),
    series_concluidas INT NOT NULL CHECK (series_concluidas > 0),
    observacoes VARCHAR(255)
);

CREATE INDEX idx_ficha_aluno_status ON tb_ficha_treino(aluno_id, status);
CREATE INDEX idx_exercicio_grupo ON tb_exercicio(grupo_muscular);
CREATE INDEX idx_item_divisao_ordem ON tb_item_divisao(divisao_id, ordem_execucao);
CREATE INDEX idx_execucao_aluno_item ON tb_registro_execucao_treino(aluno_id, item_divisao_id, data_hora_execucao DESC);
