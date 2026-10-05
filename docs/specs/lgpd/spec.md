# Especificação de Domínio: Conformidade LGPD (LGPD)

## 1. Visão Geral e Escopo
A especificação de **Conformidade LGPD** define as diretrizes funcionais e técnicas para adequação do FitManager à Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018).

O sistema processa dados pessoais e dados sensíveis de alunos e colaboradores (nomes, CPFs, e-mails, telefones, fotos, avaliações físicas, histórico biométrico de treinos e registros de pagamentos). Esta especificação estabelece os mecanismos para garantia dos direitos dos titulares (Art. 18 da LGPD), gestão do consentimento, segurança no tratamento, mascaramento de dados e atendimento à obrigação de retenção contábil/fiscal (Art. 16, I).

---

## 2. Requisitos em Notação EARS

### Requisitos Funcionais

- **[EARS-LGPD-001] (Event-driven)**: **QUANDO** um novo usuário acessar o sistema pela primeira vez ou quando houver uma nova versão ativa dos Termos de Uso e Política de Privacidade, **O SISTEMA DEVE** bloquear a navegação com um modal mandatório de consentimento até que o usuário registre o aceite formal.
- **[EARS-LGPD-002] (Ubiquitous)**: **O SISTEMA DEVE** persistir cada registro de aceite com ID do usuário, versão exata do termo aceito, carimbo de data/hora UTC e endereço IP de origem para fins de comprovação regulatória.
- **[EARS-LGPD-003] (Event-driven)**: **QUANDO** o titular dos dados (aluno ou colaborador) solicitar a portabilidade de dados pessoais via painel de privacidade, **O SISTEMA DEVE** gerar e disponibilizar para download imediato um arquivo JSON criptograficamente íntegro contendo todos os seus dados cadastrais, histórico de matrículas, treinos, check-ins e faturas.
- **[EARS-LGPD-004] (Event-driven)**: **QUANDO** o titular solicitar o direito ao esquecimento / exclusão de dados e não houver pendências financeiras ativas ou treinos em curso, **O SISTEMA DEVE** executar a anonimização irreversível dos dados pessoais identificáveis (`nome`, `cpf`, `email`, `telefone`, `endereco`, dados de saúde/treinos), substituindo-os por identificadores anônimos unívocos.
- **[EARS-LGPD-005] (State-driven)**: **ENQUANTO** existirem registros fiscais e cobranças vinculadas ao titular anonimizado, **O SISTEMA DEVE** manter os valores monetários, datas e formas de pagamento desvinculados de qualquer identificador pessoal, cumprindo a retenção legal tributária de 5 anos (Art. 16, I da LGPD c/c Art. 173 do CTN).
- **[EARS-LGPD-006] (Ubiquitous)**: **O SISTEMA DEVE** mascarar CPFs (`***.456.789-**`) e telefones (`(11) 9****-9999`) em tabelas de visualização pública ou relatórios gerais, permitindo a revelação completa somente para perfis com permissão explícita de administração.
- **[EARS-LGPD-007] (Event-driven)**: **QUANDO** qualquer usuário do sistema exportar relatórios ou dados pessoais de terceiros, **O SISTEMA DEVE** registrar uma entrada imutável no log de auditoria LGPD com identificador do operador, ID do titular afetado, tipo de dado e justificativa legal.

### Requisitos Não Funcionais

- **[RNF-LGPD-001]**: A exportação dos dados do titular em formato JSON deve ser concluída em menos de 3 segundos para históricos com até 5 anos de registros.
- **[RNF-LGPD-002]**: O processo de anonimização deve ser criptograficamente irreversível (utilizando algoritmo de hash com salt ou substituição por pseudônimos aleatórios sem chave reversível).
- **[RNF-LGPD-003]**: Logs de auditoria de acesso aos dados devem ser armazenados em tabela imutável (*append-only*), com restrição estrita de deleção via banco de dados.

---

## 3. Critérios de Aceite (Gherkin)

```gherkin
Cenário: Aceite de termos de privacidade no primeiro acesso
  Dado que um novo aluno efetua login pela primeira vez no sistema
  Quando o dashboard for solicitado
  Então o sistema exibe o modal de consentimento com a versão 1.0 da Política de Privacidade
  E o botão de prosseguir fica desabilitado até a seleção da caixa de confirmação de leitura
  E ao confirmar o aceite, o sistema registra data/hora, IP e versão no banco

Cenário: Aluno solicita portabilidade dos seus dados
  Dado que o aluno "Lucas Ferreira" está autenticado no portal do aluno
  Quando ele aciona a opção "Exportar Meus Dados (LGPD)"
  Então o sistema gera o arquivo "meus-dados-fitmanager.json"
  E o arquivo contém seus dados pessoais, suas matrículas, faturas pagas e treinos prescritos

Cenário: Aluno solicita anonimização cadastral (Direito ao Esquecimento)
  Dado que o aluno "Carlos Eduardo" solicita exclusão da sua conta
  E ele não possui nenhuma mensalidade em aberto
  Quando a solicitação de anonimização for confirmada pelo administrador ou pelo próprio aluno com senha
  Então o campo nome é substituído por "Usuário Anonimizado"
  E o CPF é substituído por hash irreversível preservando a unicidade da restrição de chave
  E a conta de usuário é inativada permanentemente
  E o histórico contábil de pagamentos permanece registrado sem vínculos nominais
```
