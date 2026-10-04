CREATE TABLE tb_checkin (
    id BIGSERIAL PRIMARY KEY,
    aluno_id BIGINT NOT NULL REFERENCES tb_aluno(id),
    data_hora TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    motivo_bloqueio VARCHAR(100),
    token_nonce VARCHAR(64) UNIQUE,
    operador_id BIGINT REFERENCES tb_usuario(id),
    CONSTRAINT ck_checkin_status CHECK (status IN ('LIBERADO', 'BLOQUEADO'))
);

CREATE INDEX idx_checkin_aluno_data ON tb_checkin(aluno_id, data_hora DESC);
CREATE INDEX idx_checkin_data ON tb_checkin(data_hora);
