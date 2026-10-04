package com.fitmanager.modules.colaborador.service;

import com.fitmanager.core.exception.RecursoNaoEncontradoException;
import com.fitmanager.core.exception.RegraNegocioException;
import com.fitmanager.modules.auth.domain.TipoPerfil;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import com.fitmanager.modules.colaborador.domain.CargoPerfil;
import com.fitmanager.modules.colaborador.domain.Colaborador;
import com.fitmanager.modules.colaborador.domain.TurnoTrabalho;
import com.fitmanager.modules.colaborador.dto.AtualizarColaboradorDTO;
import com.fitmanager.modules.colaborador.dto.ColaboradorResponseDTO;
import com.fitmanager.modules.colaborador.dto.CriarColaboradorDTO;
import com.fitmanager.modules.colaborador.repository.ColaboradorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.List;

@Service
public class ColaboradorService {

    private final ColaboradorRepository colaboradorRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public ColaboradorService(ColaboradorRepository colaboradorRepository,
                              UsuarioRepository usuarioRepository,
                              PasswordEncoder passwordEncoder) {
        this.colaboradorRepository = colaboradorRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public ColaboradorResponseDTO criar(CriarColaboradorDTO dto) {
        String cpfLimpo = dto.cpf().replaceAll("\\D", "");

        if (colaboradorRepository.existsByCpf(cpfLimpo)) {
            throw new RegraNegocioException("Já existe um colaborador cadastrado com este CPF.");
        }

        if (usuarioRepository.existsByEmail(dto.email()) || colaboradorRepository.existsByEmail(dto.email())) {
            throw new RegraNegocioException("Já existe um usuário/colaborador cadastrado com este e-mail.");
        }

        // Validação de CREF obrigatório para instrutor
        if (dto.cargoPerfil() == CargoPerfil.ROLE_INSTRUTOR) {
            if (!StringUtils.hasText(dto.cref())) {
                throw new RegraNegocioException("O número de registro no CREF é obrigatório para instrutores.");
            }
        }

        // Mapear TipoPerfil correspondente
        TipoPerfil perfilUsuario = TipoPerfil.valueOf(dto.cargoPerfil().name());

        // Senha inicial composta pelos 6 primeiros dígitos do CPF
        String senhaInicial = cpfLimpo.substring(0, Math.min(6, cpfLimpo.length()));
        Usuario usuario = new Usuario(
                null,
                dto.nome(),
                dto.email(),
                passwordEncoder.encode(senhaInicial),
                perfilUsuario,
                true,
                true
        );
        usuario = usuarioRepository.save(usuario);

        Colaborador colaborador = new Colaborador(
                null,
                usuario.getId(),
                dto.nome(),
                cpfLimpo,
                dto.email(),
                dto.telefone(),
                dto.cargoPerfil(),
                dto.cargoPerfil() == CargoPerfil.ROLE_INSTRUTOR ? dto.cref().trim() : null,
                dto.turno() != null ? dto.turno() : TurnoTrabalho.INTEGRAL,
                dto.dataAdmissao() != null ? dto.dataAdmissao() : LocalDate.now(),
                true
        );

        colaborador = colaboradorRepository.save(colaborador);
        return ColaboradorResponseDTO.fromEntity(colaborador);
    }

    @Transactional(readOnly = true)
    public Page<ColaboradorResponseDTO> listar(String termo, Pageable pageable) {
        if (StringUtils.hasText(termo)) {
            String termoLimpo = termo.trim();
            return colaboradorRepository
                    .findByNomeContainingIgnoreCaseOrCpfContaining(termoLimpo, termoLimpo, pageable)
                    .map(ColaboradorResponseDTO::fromEntity);
        }
        return colaboradorRepository.findAll(pageable).map(ColaboradorResponseDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public ColaboradorResponseDTO buscarPorId(Long id) {
        Colaborador colaborador = colaboradorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Colaborador não encontrado com ID: " + id));
        return ColaboradorResponseDTO.fromEntity(colaborador);
    }

    @Transactional(readOnly = true)
    public List<ColaboradorResponseDTO> listarInstrutoresAtivos() {
        return colaboradorRepository.findByCargoPerfilAndAtivoTrue(CargoPerfil.ROLE_INSTRUTOR)
                .stream()
                .map(ColaboradorResponseDTO::fromEntity)
                .toList();
    }

    @Transactional
    public ColaboradorResponseDTO atualizar(Long id, AtualizarColaboradorDTO dto) {
        Colaborador colaborador = colaboradorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Colaborador não encontrado com ID: " + id));

        if (colaboradorRepository.existsByEmailAndIdNot(dto.email(), id)) {
            throw new RegraNegocioException("E-mail já está em uso por outro colaborador.");
        }

        // Validação de CREF para instrutor
        if (dto.cargoPerfil() == CargoPerfil.ROLE_INSTRUTOR && !StringUtils.hasText(dto.cref())) {
            throw new RegraNegocioException("O número de registro no CREF é obrigatório para instrutores.");
        }

        // Trava para não remover o último administrador ativo
        if (colaborador.getCargoPerfil() == CargoPerfil.ROLE_ADMIN && dto.cargoPerfil() != CargoPerfil.ROLE_ADMIN) {
            long totalAdmins = colaboradorRepository.countByCargoPerfilAndAtivoTrue(CargoPerfil.ROLE_ADMIN);
            if (totalAdmins <= 1) {
                throw new RegraNegocioException("Não é permitido alterar o cargo do único administrador ativo do sistema.");
            }
        }

        colaborador.setNome(dto.nome());
        colaborador.setEmail(dto.email());
        colaborador.setTelefone(dto.telefone());
        colaborador.setCargoPerfil(dto.cargoPerfil());
        colaborador.setCref(dto.cargoPerfil() == CargoPerfil.ROLE_INSTRUTOR ? dto.cref().trim() : null);
        if (dto.turno() != null) {
            colaborador.setTurno(dto.turno());
        }

        // Atualizar usuário vinculado
        usuarioRepository.findById(colaborador.getUsuarioId()).ifPresent(u -> {
            u.setNome(dto.nome());
            u.setEmail(dto.email());
            u.setPerfil(TipoPerfil.valueOf(dto.cargoPerfil().name()));
            usuarioRepository.save(u);
        });

        colaborador = colaboradorRepository.save(colaborador);
        return ColaboradorResponseDTO.fromEntity(colaborador);
    }

    @Transactional
    public ColaboradorResponseDTO alterarStatus(Long id, boolean novoStatus) {
        Colaborador colaborador = colaboradorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Colaborador não encontrado com ID: " + id));

        // Trava do último admin ativo
        if (!novoStatus && colaborador.getCargoPerfil() == CargoPerfil.ROLE_ADMIN) {
            long totalAdmins = colaboradorRepository.countByCargoPerfilAndAtivoTrue(CargoPerfil.ROLE_ADMIN);
            if (totalAdmins <= 1) {
                throw new RegraNegocioException("Não é permitido desativar o único administrador ativo do sistema.");
            }
        }

        colaborador.setAtivo(novoStatus);

        // Atualiza status do usuário vinculado
        usuarioRepository.findById(colaborador.getUsuarioId()).ifPresent(u -> {
            u.setAtivo(novoStatus);
            usuarioRepository.save(u);
        });

        colaborador = colaboradorRepository.save(colaborador);
        return ColaboradorResponseDTO.fromEntity(colaborador);
    }
}
