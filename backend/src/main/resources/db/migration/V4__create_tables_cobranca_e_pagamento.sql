CREATE TABLE tb_cobranca (
    id BIGSERIAL PRIMARY KEY,
    matricula_id BIGINT NOT NULL REFERENCES tb_matricula(id),
    valor NUMERIC(10,2) NOT NULL CHECK (valor > 0),
    data_vencimento DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_cobranca_status CHECK (status IN ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO'))
);

CREATE TABLE tb_pagamento (
    id BIGSERIAL PRIMARY KEY,
    cobranca_id BIGINT NOT NULL UNIQUE REFERENCES tb_cobranca(id),
    usuario_recebedor_id BIGINT NOT NULL REFERENCES tb_usuario(id),
    valor_pago NUMERIC(10,2) NOT NULL CHECK (valor_pago > 0),
    forma_pagamento VARCHAR(20) NOT NULL,
    identificador_transacao VARCHAR(100),
    data_hora_pagamento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT,
    CONSTRAINT ck_pagamento_forma CHECK (forma_pagamento IN ('PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO'))
);

CREATE INDEX idx_cobranca_matricula ON tb_cobranca(matricula_id);
CREATE INDEX idx_cobranca_vencimento_status ON tb_cobranca(data_vencimento, status);
CREATE INDEX idx_pagamento_cobranca ON tb_pagamento(cobranca_id);
