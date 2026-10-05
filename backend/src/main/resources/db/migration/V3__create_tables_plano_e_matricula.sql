CREATE TABLE tb_plano (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    valor_mensalidade NUMERIC(10,2) NOT NULL CHECK (valor_mensalidade > 0),
    periodicidade VARCHAR(20) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_plano_periodicidade CHECK (periodicidade IN ('MENSAL', 'TRIMESTRAL', 'ANUAL'))
);

CREATE TABLE tb_matricula (
    id BIGSERIAL PRIMARY KEY,
    aluno_id BIGINT NOT NULL REFERENCES tb_aluno(id),
    plano_id BIGINT NOT NULL REFERENCES tb_plano(id),
    data_inicio DATE NOT NULL,
    data_termino DATE NOT NULL,
    valor_mensalidade_contratada NUMERIC(10,2) NOT NULL CHECK (valor_mensalidade_contratada > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVA',
    data_cancelamento TIMESTAMP WITH TIME ZONE,
    motivo_cancelamento TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_datas_matricula CHECK (data_termino >= data_inicio),
    CONSTRAINT ck_matricula_status CHECK (status IN ('ATIVA', 'VENCIDA', 'CANCELADA'))
);

CREATE INDEX idx_matricula_aluno_status ON tb_matricula(aluno_id, status);
CREATE INDEX idx_matricula_vigencia ON tb_matricula(data_inicio, data_termino);

-- Planos Iniciais no Catálogo
INSERT INTO tb_plano (nome, descricao, valor_mensalidade, periodicidade, ativo)
VALUES 
    ('Plano Mensal Livre', 'Acesso total e irrestrito a musculação e aulas coletivas por 30 dias', 120.00, 'MENSAL', TRUE),
    ('Plano Trimestral Fit', 'Fidelidade de 3 meses com mensalidade promocional de R$ 109,90', 109.90, 'TRIMESTRAL', TRUE),
    ('Plano Anual VIP', 'Plano anual com maior economia, acesso completo e avaliação física inclusa', 89.90, 'ANUAL', TRUE);
