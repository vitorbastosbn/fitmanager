CREATE TABLE tb_termo_consentimento (
    id BIGSERIAL PRIMARY KEY,
    versao VARCHAR(20) NOT NULL UNIQUE,
    titulo VARCHAR(200) NOT NULL,
    conteudo TEXT NOT NULL,
    obrigatorio BOOLEAN NOT NULL DEFAULT TRUE,
    data_publicacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE tb_consentimento_usuario (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES tb_usuario(id) ON DELETE CASCADE,
    termo_id BIGINT NOT NULL REFERENCES tb_termo_consentimento(id),
    aceito BOOLEAN NOT NULL DEFAULT TRUE,
    data_aceite TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ip_origem VARCHAR(45),
    user_agent VARCHAR(255),
    CONSTRAINT uk_usuario_termo UNIQUE (usuario_id, termo_id)
);

CREATE TABLE tb_log_auditoria_lgpd (
    id BIGSERIAL PRIMARY KEY,
    operador_id BIGINT NOT NULL REFERENCES tb_usuario(id),
    titular_id BIGINT REFERENCES tb_usuario(id),
    acao VARCHAR(60) NOT NULL,
    detalhes TEXT,
    ip_origem VARCHAR(45),
    criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consentimento_usuario ON tb_consentimento_usuario(usuario_id);
CREATE INDEX idx_auditoria_lgpd_titular ON tb_log_auditoria_lgpd(titular_id);
CREATE INDEX idx_auditoria_lgpd_acao ON tb_log_auditoria_lgpd(acao);

-- Inserção do Termo Inicial Vigente (v1.0)
INSERT INTO tb_termo_consentimento (versao, titulo, conteudo, obrigatorio, ativo)
VALUES (
    '1.0',
    'Termos de Uso e Política de Privacidade de Dados Pessoais - FitManager',
    'Em conformidade com a Lei Federal nº 13.709/2018 (LGPD), o FitManager coleta e trata seus dados pessoais (nome, CPF, contato, dados de frequência e treino) exclusivamente para finalidades de prestação de serviços esportivos, controle de acesso físico e cumprimento de obrigações fiscais. Seus dados não são comercializados ou compartilhados com terceiros sem seu consentimento expresso. Você pode solicitar a qualquer momento a exportação dos seus dados ou a anonimização cadastral após a rescisão do plano.',
    TRUE,
    TRUE
);
