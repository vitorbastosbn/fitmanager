package com.fitmanager.modules.financeiro.controller;

import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.service.AlunoService;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import com.fitmanager.modules.financeiro.dto.CobrancaDTO;
import com.fitmanager.modules.financeiro.dto.PagarCobrancaDTO;
import com.fitmanager.modules.financeiro.dto.PagamentoResponseDTO;
import com.fitmanager.modules.financeiro.service.CobrancaService;
import com.fitmanager.modules.financeiro.service.PagamentoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class FinanceiroController {

    private final CobrancaService cobrancaService;
    private final PagamentoService pagamentoService;
    private final AlunoService alunoService;
    private final UsuarioRepository usuarioRepository;

    public FinanceiroController(
            CobrancaService cobrancaService,
            PagamentoService pagamentoService,
            AlunoService alunoService,
            UsuarioRepository usuarioRepository) {
        this.cobrancaService = cobrancaService;
        this.pagamentoService = pagamentoService;
        this.alunoService = alunoService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/cobrancas")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCIONISTA')")
    public ResponseEntity<List<CobrancaDTO>> listarCobrancas(
            @RequestParam(required = false) Long matriculaId,
            @RequestParam(required = false) Long alunoId) {
        List<CobrancaDTO> cobrancas;
        if (matriculaId != null) {
            cobrancas = cobrancaService.listarPorMatricula(matriculaId).stream().map(CobrancaDTO::fromEntity).toList();
        } else if (alunoId != null) {
            cobrancas = cobrancaService.listarPorAluno(alunoId).stream().map(CobrancaDTO::fromEntity).toList();
        } else {
            cobrancas = List.of();
        }
        return ResponseEntity.ok(cobrancas);
    }

    @PostMapping("/cobrancas/{id}/pagar")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCIONISTA')")
    public ResponseEntity<PagamentoResponseDTO> quitarCobranca(
            @PathVariable Long id,
            @Valid @RequestBody PagarCobrancaDTO dto,
            Principal principal) {
        return ResponseEntity.ok(pagamentoService.quitarCobranca(id, dto, principal.getName()));
    }

    @GetMapping("/alunos/me/cobrancas")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<CobrancaDTO>> extratoAluno(Principal principal) {
        Usuario usuario = usuarioRepository.findByEmail(principal.getName()).orElseThrow();
        Aluno aluno = alunoService.buscarPorUsuarioId(usuario.getId());
        List<CobrancaDTO> cobrancas = cobrancaService.listarPorAluno(aluno.getId())
                .stream()
                .map(CobrancaDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(cobrancas);
    }
}
