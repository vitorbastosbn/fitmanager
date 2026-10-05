package com.fitmanager.modules.aluno.service;

import com.fitmanager.core.exception.RecursoNaoEncontradoException;
import com.fitmanager.core.exception.RegraNegocioException;
import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.domain.StatusAluno;
import com.fitmanager.modules.aluno.dto.AlunoCreateDTO;
import com.fitmanager.modules.aluno.dto.AlunoResponseDTO;
import com.fitmanager.modules.aluno.dto.AlunoUpdateDTO;
import com.fitmanager.modules.aluno.repository.AlunoRepository;
import com.fitmanager.modules.auth.domain.TipoPerfil;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AlunoService(AlunoRepository alunoRepository, UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.alunoRepository = alunoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AlunoResponseDTO cadastrarAluno(AlunoCreateDTO dto) {
        String cpfLimpo = dto.getCpf().replaceAll("\\D", "");

        if (alunoRepository.existsByCpf(cpfLimpo)) {
            throw new RegraNegocioException("Já existe um aluno cadastrado com este CPF.");
        }

        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RegraNegocioException("Já existe um usuário cadastrado com este e-mail.");
        }

        // ADR-008: Senha inicial composta pelos 6 primeiros dígitos do CPF com primeiroAcesso = true
        String senhaInicial = cpfLimpo.substring(0, 6);
        Usuario usuario = new Usuario(
                null,
                dto.getNome(),
                dto.getEmail(),
                passwordEncoder.encode(senhaInicial),
                TipoPerfil.ROLE_ALUNO,
                true,
                true
        );
        usuario = usuarioRepository.save(usuario);

        Aluno aluno = new Aluno(
                null,
                usuario.getId(),
                dto.getNome(),
                cpfLimpo,
                dto.getDataNascimento(),
                dto.getTelefone(),
                dto.getEmail(),
                StatusAluno.ATIVO,
                dto.getEndereco()
        );

        aluno = alunoRepository.save(aluno);
        return AlunoResponseDTO.fromEntity(aluno);
    }

    @Transactional(readOnly = true)
    public Page<AlunoResponseDTO> buscarPaginado(String nome, String status, String cpf, Pageable pageable) {
        Specification<Aluno> spec = Specification.where(null);

        if (StringUtils.hasText(nome)) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%"));
        }

        if (StringUtils.hasText(status)) {
            try {
                StatusAluno statusEnum = StatusAluno.valueOf(status.toUpperCase());
                spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), statusEnum));
            } catch (IllegalArgumentException ignored) {}
        }

        if (StringUtils.hasText(cpf)) {
            String cpfLimpo = cpf.replaceAll("\\D", "");
            spec = spec.and((root, query, cb) -> cb.like(root.get("cpf"), "%" + cpfLimpo + "%"));
        }

        return alunoRepository.findAll(spec, pageable).map(AlunoResponseDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public AlunoResponseDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado com ID: " + id));
        return AlunoResponseDTO.fromEntity(aluno);
    }

    @Transactional(readOnly = true)
    public Aluno buscarEntidadePorId(Long id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado com ID: " + id));
    }

    @Transactional(readOnly = true)
    public Aluno buscarPorUsuarioId(Long usuarioId) {
        return alunoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Nenhum cadastro de aluno vinculado ao usuário ID: " + usuarioId));
    }

    @Transactional
    public AlunoResponseDTO atualizarAluno(Long id, AlunoUpdateDTO dto) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado com ID: " + id));

        aluno.setNome(dto.getNome());
        aluno.setDataNascimento(dto.getDataNascimento());
        aluno.setTelefone(dto.getTelefone());
        aluno.setEmail(dto.getEmail());
        if (dto.getStatus() != null) {
            aluno.setStatus(dto.getStatus());
        }
        if (dto.getEndereco() != null) {
            aluno.setEndereco(dto.getEndereco());
        }

        aluno = alunoRepository.save(aluno);
        return AlunoResponseDTO.fromEntity(aluno);
    }

    @Transactional
    public void inativarAluno(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado com ID: " + id));
        aluno.setStatus(StatusAluno.INATIVO);
        alunoRepository.save(aluno);
    }
}
