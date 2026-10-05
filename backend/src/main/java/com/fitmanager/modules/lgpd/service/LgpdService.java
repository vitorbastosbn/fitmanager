package com.fitmanager.modules.lgpd.service;

import com.fitmanager.core.exception.RecursoNaoEncontradoException;
import com.fitmanager.core.exception.RegraNegocioException;
import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.domain.StatusAluno;
import com.fitmanager.modules.aluno.repository.AlunoRepository;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import com.fitmanager.modules.financeiro.domain.Cobranca;
import com.fitmanager.modules.financeiro.domain.StatusCobranca;
import com.fitmanager.modules.financeiro.repository.CobrancaRepository;
import com.fitmanager.modules.frequencia.domain.CheckIn;
import com.fitmanager.modules.frequencia.repository.CheckInRepository;
import com.fitmanager.modules.lgpd.domain.ConsentimentoUsuario;
import com.fitmanager.modules.lgpd.domain.LogAuditoriaLgpd;
import com.fitmanager.modules.lgpd.domain.TermoConsentimento;
import com.fitmanager.modules.lgpd.dto.ExportacaoDadosLgpdDTO;
import com.fitmanager.modules.lgpd.dto.LogAuditoriaResponseDTO;
import com.fitmanager.modules.lgpd.dto.TermoVigenteDTO;
import com.fitmanager.modules.lgpd.repository.ConsentimentoUsuarioRepository;
import com.fitmanager.modules.lgpd.repository.LogAuditoriaLgpdRepository;
import com.fitmanager.modules.lgpd.repository.TermoConsentimentoRepository;
import com.fitmanager.modules.plano.domain.Matricula;
import com.fitmanager.modules.plano.repository.MatriculaRepository;
import com.fitmanager.modules.treino.domain.FichaTreino;
import com.fitmanager.modules.treino.repository.FichaTreinoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class LgpdService {

    private final TermoConsentimentoRepository termoRepository;
    private final ConsentimentoUsuarioRepository consentimentoRepository;
    private final LogAuditoriaLgpdRepository auditoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final AlunoRepository alunoRepository;
    private final CobrancaRepository cobrancaRepository;
    private final CheckInRepository checkInRepository;
    private final MatriculaRepository matriculaRepository;
    private final FichaTreinoRepository fichaTreinoRepository;

    public LgpdService(TermoConsentimentoRepository termoRepository,
                       ConsentimentoUsuarioRepository consentimentoRepository,
                       LogAuditoriaLgpdRepository auditoriaRepository,
                       UsuarioRepository usuarioRepository,
                       AlunoRepository alunoRepository,
                       CobrancaRepository cobrancaRepository,
                       CheckInRepository checkInRepository,
                       MatriculaRepository matriculaRepository,
                       FichaTreinoRepository fichaTreinoRepository) {
        this.termoRepository = termoRepository;
        this.consentimentoRepository = consentimentoRepository;
        this.auditoriaRepository = auditoriaRepository;
        this.usuarioRepository = usuarioRepository;
        this.alunoRepository = alunoRepository;
        this.cobrancaRepository = cobrancaRepository;
        this.checkInRepository = checkInRepository;
        this.matriculaRepository = matriculaRepository;
        this.fichaTreinoRepository = fichaTreinoRepository;
    }

    @Transactional(readOnly = true)
    public TermoVigenteDTO obterTermoVigenteComStatus(String email) {
        TermoConsentimento termo = termoRepository.findFirstByAtivoTrueOrderByDataPublicacaoDesc()
                .orElseThrow(() -> new RecursoNaoEncontradoException("Nenhum termo de privacidade ativo foi encontrado."));

        boolean jaAceito = false;
        if (email != null && !email.isBlank()) {
            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
            if (usuarioOpt.isPresent()) {
                jaAceito = consentimentoRepository.existsByUsuarioIdAndTermoIdAndAceitoTrue(usuarioOpt.get().getId(), termo.getId());
            }
        }

        return new TermoVigenteDTO(
                termo.getId(),
                termo.getVersao(),
                termo.getTitulo(),
                termo.getConteudo(),
                termo.isObrigatorio(),
                jaAceito
        );
    }

    @Transactional
    public void registrarAceite(Long termoId, String email, String ipOrigem, String userAgent) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com e-mail: " + email));

        TermoConsentimento termo = termoRepository.findById(termoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Termo de consentimento não encontrado com ID: " + termoId));

        if (!consentimentoRepository.existsByUsuarioIdAndTermoIdAndAceitoTrue(usuario.getId(), termo.getId())) {
            ConsentimentoUsuario consentimento = new ConsentimentoUsuario(
                    null,
                    usuario,
                    termo,
                    true,
                    ipOrigem,
                    userAgent
            );
            consentimentoRepository.save(consentimento);

            LogAuditoriaLgpd log = new LogAuditoriaLgpd(
                    null,
                    usuario,
                    usuario,
                    "ACEITE_TERMO_CONSENTIMENTO",
                    "Aceite formal da versão " + termo.getVersao() + " dos termos de privacidade.",
                    ipOrigem
            );
            auditoriaRepository.save(log);
        }
    }

    @Transactional
    public ExportacaoDadosLgpdDTO exportarDados(String email, String ipOrigem) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com e-mail: " + email));

        Optional<Aluno> alunoOpt = alunoRepository.findByUsuarioId(usuario.getId());

        Map<String, Object> titularMap = new LinkedHashMap<>();
        titularMap.put("usuarioId", usuario.getId());
        titularMap.put("nome", usuario.getNome());
        titularMap.put("email", usuario.getEmail());
        titularMap.put("perfil", usuario.getPerfil().name());

        List<Map<String, Object>> matriculasList = new ArrayList<>();
        List<Map<String, Object>> frequenciasList = new ArrayList<>();
        List<Map<String, Object>> treinosList = new ArrayList<>();
        List<Map<String, Object>> financeiroList = new ArrayList<>();

        if (alunoOpt.isPresent()) {
            Aluno aluno = alunoOpt.get();
            titularMap.put("alunoId", aluno.getId());
            titularMap.put("cpf", aluno.getCpf());
            titularMap.put("telefone", aluno.getTelefone());
            titularMap.put("dataNascimento", aluno.getDataNascimento());
            titularMap.put("status", aluno.getStatus().name());

            // Matrículas
            for (Matricula m : matriculaRepository.findByAlunoId(aluno.getId())) {
                Map<String, Object> mMap = new LinkedHashMap<>();
                mMap.put("matriculaId", m.getId());
                mMap.put("plano", m.getPlano() != null ? m.getPlano().getNome() : "N/A");
                mMap.put("dataInicio", m.getDataInicio());
                mMap.put("dataTermino", m.getDataTermino());
                mMap.put("status", m.getStatus().name());
                matriculasList.add(mMap);
            }

            // Histórico Financeiro
            for (Cobranca c : cobrancaRepository.findByAlunoId(aluno.getId())) {
                Map<String, Object> cMap = new LinkedHashMap<>();
                cMap.put("cobrancaId", c.getId());
                cMap.put("valor", c.getValor());
                cMap.put("dataVencimento", c.getDataVencimento());
                cMap.put("status", c.getStatus().name());
                if (c.getPagamento() != null) {
                    cMap.put("formaPagamento", c.getPagamento().getFormaPagamento().name());
                    cMap.put("dataPagamento", c.getPagamento().getDataHoraPagamento());
                }
                financeiroList.add(cMap);
            }

            // Treinos
            for (FichaTreino f : fichaTreinoRepository.findByAlunoIdOrderByDataInicioDesc(aluno.getId())) {
                Map<String, Object> fMap = new LinkedHashMap<>();
                fMap.put("fichaId", f.getId());
                fMap.put("objetivo", f.getObjetivo());
                fMap.put("dataInicio", f.getDataInicio());
                fMap.put("dataValidade", f.getDataValidade());
                fMap.put("status", f.getStatus().name());
                treinosList.add(fMap);
            }
        }

        // Histórico de Consentimentos
        List<Map<String, Object>> consentimentosList = new ArrayList<>();
        for (ConsentimentoUsuario c : consentimentoRepository.findByUsuarioId(usuario.getId())) {
            Map<String, Object> termMap = new LinkedHashMap<>();
            termMap.put("termoId", c.getTermo().getId());
            termMap.put("versao", c.getTermo().getVersao());
            termMap.put("dataAceite", c.getDataAceite());
            termMap.put("ipOrigem", c.getIpOrigem());
            consentimentosList.add(termMap);
        }

        // Auditoria
        LogAuditoriaLgpd log = new LogAuditoriaLgpd(
                null,
                usuario,
                usuario,
                "PORTABILIDADE_DADOS_PESSOAIS",
                "Exportação estruturada de dados pessoais (Art. 18 LGPD).",
                ipOrigem
        );
        auditoriaRepository.save(log);

        return new ExportacaoDadosLgpdDTO(
                "1.0",
                OffsetDateTime.now(),
                titularMap,
                consentimentosList,
                matriculasList,
                frequenciasList,
                treinosList,
                financeiroList
        );
    }

    @Transactional
    public void anonimizarTitular(String email, String ipOrigem) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com e-mail: " + email));

        Optional<Aluno> alunoOpt = alunoRepository.findByUsuarioId(usuario.getId());

        if (alunoOpt.isPresent()) {
            Aluno aluno = alunoOpt.get();

            // Bloqueio se houver faturas abertas ou atrasadas
            List<Cobranca> faturasAbertas = cobrancaRepository.findByAlunoIdAndStatus(aluno.getId(), StatusCobranca.PENDENTE);
            List<Cobranca> faturasAtrasadas = cobrancaRepository.findByAlunoIdAndStatus(aluno.getId(), StatusCobranca.ATRASADO);
            if (!faturasAbertas.isEmpty() || !faturasAtrasadas.isEmpty()) {
                throw new RegraNegocioException("Não é possível realizar a exclusão/anonimização cadastral enquanto houver mensalidades pendentes ou em atraso.");
            }

            // Anonimização dos dados pessoais do aluno
            aluno.setNome("Usuário Anonimizado");
            aluno.setCpf("AN" + String.format("%09d", aluno.getId()));
            aluno.setEmail("anon_" + aluno.getId() + "@lgpd.fitmanager.local");
            aluno.setTelefone("00000000000");
            aluno.setDataNascimento(LocalDate.of(1970, 1, 1));
            aluno.setStatus(StatusAluno.INATIVO);
            aluno.setEndereco(null);
            alunoRepository.save(aluno);
        }

        // Desativação e ofuscação da conta de login
        usuario.setNome("Usuário Anonimizado");
        usuario.setEmail("anon_" + usuario.getId() + "@lgpd.fitmanager.local");
        usuario.setSenhaHash("$2a$10$ANONYMIZED_USER_ACCOUNT_LOCKED_FOREVER");
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);

        // Registro de auditoria legal
        LogAuditoriaLgpd log = new LogAuditoriaLgpd(
                null,
                usuario,
                usuario,
                "DIREITO_AO_ESQUECIMENTO_ANONIMIZACAO",
                "Execução do direito ao esquecimento e anonimização cadastral (Art. 18, IV da LGPD). Retenção contábil-fiscal aplicada conforme Art. 173 do CTN.",
                ipOrigem
        );
        auditoriaRepository.save(log);
    }

    @Transactional(readOnly = true)
    public Page<LogAuditoriaResponseDTO> listarAuditoria(Pageable pageable) {
        return auditoriaRepository.findAllByOrderByCriadoEmDesc(pageable).map(LogAuditoriaResponseDTO::fromEntity);
    }
}
