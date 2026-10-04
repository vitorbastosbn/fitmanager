INSERT INTO tb_exercicio (nome, grupo_muscular, instrucoes, ativo)
VALUES
    -- PEITO
    ('Supino Reto com Barra', 'PEITO', 'Deitado no banco horizontal, pés apoiados no chão. Descer a barra controladamente até o peitoral e empurrar até a extensão quase completa dos cotovelos.', TRUE),
    ('Supino Inclinado com Halteres', 'PEITO', 'Banco a 30-45 graus. Descer os halteres na linha do peitoral superior com os cotovelos a 45 graus do tronco e empurrar para cima.', TRUE),
    ('Crossover Polia Alta', 'PEITO', 'Em pé no centro do cross, tronco levemente inclinado à frente. Puxar os cabos para baixo e para o centro em arco, contraindo o peitoral.', TRUE),
    ('Crucifixo Reto com Halteres', 'PEITO', 'Deitado no banco reto, abrir os braços com cotovelos levemente flexionados até sentir o alongamento peitoral e retornar ao centro.', TRUE),
    ('Flexão de Braços', 'PEITO', 'Apoio no solo com as mãos na largura dos ombros, manter o core firme e descer o peito próximo ao chão.', TRUE),

    -- COSTAS
    ('Puxada Frontal no Pulley', 'COSTAS', 'Sentado no aparelho, pegada pronada aberta. Puxar a barra em direção à parte superior do peito mantendo a coluna ereta.', TRUE),
    ('Remada Curvada com Barra', 'COSTAS', 'Tronco inclinado a 45 graus, coluna neutra. Puxar a barra em direção ao umbigo fechando as escápulas.', TRUE),
    ('Remada Baixa no Triângulo', 'COSTAS', 'Sentado no banco, pernas semiflexionadas. Puxar o pegador triangular em direção ao abdômen com peito aberto.', TRUE),
    ('Levantamento Terra', 'COSTAS', 'Pés na largura do quadril, coluna neutra e peito aberto. Erguer a barra do chão estendendo quadril e joelhos em sincronia.', TRUE),
    ('Barra Fixa Pronada', 'COSTAS', 'Suspenso na barra com pegada aberta pronada. Puxar o corpo para cima até o queixo ultrapassar a linha da barra.', TRUE),

    -- PERNAS
    ('Agachamento Livre com Barra', 'PERNAS', 'Barra apoiada no trapézio, pés na largura dos ombros. Flexionar quadril e joelhos mantendo o tronco firme até atingir 90 graus ou mais.', TRUE),
    ('Leg Press 45º', 'PERNAS', 'Pés apoiados na plataforma na largura do quadril. Descer o carrinho controladamente sem arredondar a lombar e empurrar com os calcanhares.', TRUE),
    ('Cadeira Extensora', 'PERNAS', 'Sentado com as costas firmes no encosto. Estender os joelhos completamente, contrair os quadríceps e descer com controle.', TRUE),
    ('Mesa Flexora', 'PERNAS', 'Deitado de bruços, almofada acima dos calcanhares. Flexionar as pernas aproximando os calcanhares dos glúteos.', TRUE),
    ('Elevação Pélvica', 'PERNAS', 'Costas apoiadas no banco, pés firmes no solo. Elevar o quadril contraindo ao máximo os glúteos no topo do movimento.', TRUE),
    ('Panturrilha no Smith', 'PERNAS', 'Pontas dos pés sobre o degrau/step. Descer os calcanhares para máximo alongamento e elevar na ponta dos pés com contração máxima.', TRUE),
    ('Passada / Avanço com Halteres', 'PERNAS', 'Dar um passo largo à frente, flexionar o joelho de trás em direção ao chão e retornar impulsionando pela perna da frente.', TRUE),

    -- OMBROS
    ('Desenvolvimento com Halteres', 'OMBROS', 'Sentado no banco a 90 graus, empurrar os halteres para cima acima da cabeça até quase estender os cotovelos.', TRUE),
    ('Elevação Lateral', 'OMBROS', 'Em pé, tronco firme. Elevar os halteres lateralmente até a altura dos ombros, mantendo ligeira flexão dos cotovelos.', TRUE),
    ('Elevação Frontal com Halteres', 'OMBROS', 'Em pé, elevar os halteres à frente do corpo até a linha dos olhos com movimento controlado.', TRUE),
    ('Crucifixo Invertido com Halteres', 'OMBROS', 'Tronco inclinado para frente, abrir os braços para os lados focando na contração do deltoide posterior.', TRUE),
    ('Encolhimento de Ombros com Barra', 'OMBROS', 'Em pé segurando a barra, elevar os ombros em direção às orelhas sem girar as articulações.', TRUE),

    -- BRAÇOS
    ('Rosca Direta com Barra W', 'BRACOS', 'Em pé, cotovelos colados ao tronco. Flexionar os antebraços erguendo a barra em direção aos ombros.', TRUE),
    ('Rosca Martelo com Halteres', 'BRACOS', 'Pegada neutra com halteres. Flexionar os cotovelos mantendo os polegares voltados para cima.', TRUE),
    ('Rosca Scott', 'BRACOS', 'Braços apoiados no banco Scott. Isolar a flexão do bíceps sem movimentar o tronco.', TRUE),
    ('Tríceps Pulley Corda', 'BRACOS', 'Em pé no cabo, abrir a corda no final do movimento para baixo para contração total da cabeça lateral do tríceps.', TRUE),
    ('Tríceps Testa com Barra W', 'BRACOS', 'Deitado no banco, descer a barra controladamente em direção à testa mantendo os cotovelos fixos.', TRUE),
    ('Tríceps Francês com Halter', 'BRACOS', 'Sentado, segurar o halter com as duas mãos atrás da cabeça e estender os cotovelos para cima.', TRUE),
    ('Mergulho em Paralelas', 'BRACOS', 'Corpo suspenso nas barras paralelas, flexionar os cotovelos até 90 graus e empurrar de volta ao topo.', TRUE),

    -- ABDÔMEN
    ('Abdominal Crunch no Solo', 'ABDOMEN', 'Deitado de costas, pernas flexionadas. Elevar as escápulas do chão enrolando o tronco em direção aos joelhos.', TRUE),
    ('Prancha Abdominal Estática', 'ABDOMEN', 'Apoio sobre antebraços e pontas dos pés. Manter o corpo alinhado e abdômen fortemente contraído por tempo determinado.', TRUE),
    ('Abdominal Infra na Paralela', 'ABDOMEN', 'Apoiado nos antebraços no aparelho, elevar os joelhos ou pernas estendidas em direção ao tórax.', TRUE),
    ('Roda Abdominal', 'ABDOMEN', 'De joelhos, rolar a roda para a frente mantendo a curvatura natural e retornar pela força do abdômen.', TRUE),

    -- CARDIO
    ('Esteira Ergométrica', 'CARDIO', 'Caminhada acelerada ou corrida contínua com ajuste de velocidade e inclinação para condicionamento cardiovascular.', TRUE),
    ('Bicicleta Ergométrica', 'CARDIO', 'Pedalada contínua com ajuste de carga/resistência magnética para queima calórica e resistência aeróbica.', TRUE),
    ('Elíptico / Transport', 'CARDIO', 'Movimento sincronizado de braços e pernas com baixo impacto articular para treino cardiovascular.', TRUE),
    ('Remo Indoor', 'CARDIO', 'Remada em aparelho de resistência ao ar, combinando condicionamento cardiovascular e ativação muscular global.', TRUE);
