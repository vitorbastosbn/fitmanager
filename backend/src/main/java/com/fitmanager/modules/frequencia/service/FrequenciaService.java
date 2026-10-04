package com.fitmanager.modules.frequencia.service;

import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.repository.AlunoRepository;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import com.fitmanager.modules.financeiro.domain.Cobranca;
import com.fitmanager.modules.financeiro.repository.CobrancaRepository;
import com.fitmanager.modules.frequencia.domain.CheckIn;
import com.fitmanager.modules.frequencia.domain.StatusAcessoCheckin;
import com.fitmanager.modules.frequencia.dto.CheckInItemDTO;
import com.fitmanager.modules.frequencia.dto.CheckInResponseDTO;
import com.fitmanager.modules.frequencia.dto.QrTokenResponseDTO;
import com.fitmanager.modules.frequencia.repository.CheckInRepository;
import com.fitmanager.modules.plano.domain.Matricula;
import com.fitmanager.modules.plano.domain.StatusMatricula;
import com.fitmanager.modules.plano.repository.MatriculaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@Service
public class FrequenciaService {

    private final CheckInRepository checkInRepository;
    private final AlunoRepository alunoRepository;
    private final UsuarioRepository usuarioRepository;
    private final MatriculaRepository matriculaRepository;
    private final CobrancaRepository cobrancaRepository;
    private final QrTokenService qrTokenService;

    public FrequenciaService(
            CheckInRepository checkInRepository,
            AlunoRepository alunoRepository,
            UsuarioRepository usuarioRepository,
            MatriculaRepository matriculaRepository,
            CobrancaRepository cobrancaRepository,
            QrTokenService qrTokenService) {
        this.checkInRepository = checkInRepository;
        this.alunoRepository = alunoRepository;
        this.usuarioRepository = usuarioRepository;
        this.matriculaRepository = matriculaRepository;
        this.cobrancaRepository = cobrancaRepository;
        this.qrTokenService = qrTokenService;
    }

    public QrTokenResponseDTO gerarTokenCheckin(String userEmail) {
        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        Aluno aluno = alunoRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil de aluno não encontrado."));

        String token = qrTokenService.gerarToken(aluno.getId());
        return new QrTokenResponseDTO(token, QrTokenService.VALIDADE_SEGUNDOS, OffsetDateTime.now(ZoneOffset.UTC));
    }

    public QrTokenResponseDTO gerarTokenCheckinPorAlunoId(Long alunoId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil de aluno não encontrado."));
        String token = qrTokenService.gerarToken(aluno.getId());
        return new QrTokenResponseDTO(token, QrTokenService.VALIDADE_SEGUNDOS, OffsetDateTime.now(ZoneOffset.UTC));
    }

    @Transactional
    public CheckInResponseDTO validarERegistrarCheckIn(String token, String operadorEmail) {
        QrTokenService.QrTokenData tokenData;
        try {
            tokenData = qrTokenService.validarToken(token);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "QR Code expirado ou inválido.");
        }

        if (checkInRepository.existsByTokenNonce(tokenData.nonce())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "QR Code já utilizado.");
        }

        Aluno aluno = alunoRepository.findById(tokenData.alunoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado."));

        Usuario operador = null;
        if (operadorEmail != null) {
            operador = usuarioRepository.findByEmail(operadorEmail).orElse(null);
        }

        OffsetDateTime agora = OffsetDateTime.now();

        // 1. Janela de Tolerância de Repetição: mínimo 30 min entre check-ins liberados
        Optional<CheckIn> ultimoCheckinLiberado = checkInRepository.findFirstByAlunoIdAndStatusOrderByDataHoraDesc(
                aluno.getId(), StatusAcessoCheckin.LIBERADO);
        if (ultimoCheckinLiberado.isPresent()) {
            OffsetDateTime limite30Min = ultimoCheckinLiberado.get().getDataHora().plusMinutes(30);
            if (agora.isBefore(limite30Min)) {
                CheckIn checkIn = new CheckIn(aluno, agora, StatusAcessoCheckin.BLOQUEADO, "INTERVALO_MINIMO_NAO_ATINGIDO", tokenData.nonce(), operador);
                checkInRepository.save(checkIn);
                return CheckInResponseDTO.bloqueado(aluno.getId(), aluno.getNome(), "INTERVALO_MINIMO_NAO_ATINGIDO",
                        "Acesso negado: intervalo mínimo entre check-ins é de 30 minutos.");
            }
        }

        // 2. Verificar Matrícula Ativa Vigente
        Optional<Matricula> matriculaOpt = matriculaRepository.findFirstByAlunoIdAndStatus(aluno.getId(), StatusMatricula.ATIVA);
        LocalDate hoje = LocalDate.now();

        if (matriculaOpt.isEmpty() || matriculaOpt.get().getDataTermino().isBefore(hoje)) {
            CheckIn checkIn = new CheckIn(aluno, agora, StatusAcessoCheckin.BLOQUEADO, "MATRICULA_INEXISTENTE_OU_VENCIDA", tokenData.nonce(), operador);
            checkInRepository.save(checkIn);
            return CheckInResponseDTO.bloqueado(aluno.getId(), aluno.getNome(), "MATRICULA_INEXISTENTE_OU_VENCIDA",
                    "Acesso negado: matrícula vencida ou inativa.");
        }

        Matricula matricula = matriculaOpt.get();

        // 3. Regra de Inadimplência com tolerância de até 5 dias (ADR-010)
        LocalDate dataLimiteTolerancia = hoje.minusDays(5);
        List<Cobranca> cobrancasAtrasadas = cobrancaRepository.findInadimplentesAposTolerancia(aluno.getId(), dataLimiteTolerancia);

        if (!cobrancasAtrasadas.isEmpty()) {
            CheckIn checkIn = new CheckIn(aluno, agora, StatusAcessoCheckin.BLOQUEADO, "INADIMPLENCIA_TOLERANCIA_EXCEDIDA", tokenData.nonce(), operador);
            checkInRepository.save(checkIn);
            return CheckInResponseDTO.bloqueado(aluno.getId(), aluno.getNome(), "INADIMPLENCIA_TOLERANCIA_EXCEDIDA",
                    "Acesso negado: mensalidade em aberto há mais de 5 dias corridos. Por favor, regularize na recepção.");
        }

        // 4. Acesso Liberado
        CheckIn checkIn = new CheckIn(aluno, agora, StatusAcessoCheckin.LIBERADO, null, tokenData.nonce(), operador);
        checkInRepository.save(checkIn);

        return CheckInResponseDTO.liberado(aluno.getId(), aluno.getNome(), agora, matricula.getPlano().getNome());
    }

    @Transactional(readOnly = true)
    public List<CheckInItemDTO> listarCheckInsHoje() {
        LocalDate hoje = LocalDate.now();
        OffsetDateTime inicio = hoje.atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime fim = hoje.plusDays(1).atStartOfDay().minusNanos(1).atOffset(ZoneOffset.UTC);

        return checkInRepository.findByDataHoraBetweenWithAluno(inicio, fim)
                .stream()
                .map(CheckInItemDTO::fromEntity)
                .toList();
    }
}
