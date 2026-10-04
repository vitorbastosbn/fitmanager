package com.fitmanager.modules.aluno.controller;

import com.fitmanager.modules.aluno.dto.AlunoCreateDTO;
import com.fitmanager.modules.aluno.dto.AlunoResponseDTO;
import com.fitmanager.modules.aluno.dto.AlunoUpdateDTO;
import com.fitmanager.modules.aluno.service.AlunoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/alunos")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_RECEPCIONISTA')")
    public ResponseEntity<AlunoResponseDTO> cadastrar(@Valid @RequestBody AlunoCreateDTO dto) {
        AlunoResponseDTO response = alunoService.cadastrarAluno(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_RECEPCIONISTA', 'ROLE_INSTRUTOR')")
    public ResponseEntity<Page<AlunoResponseDTO>> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String cpf,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(alunoService.buscarPaginado(nome, status, cpf, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_RECEPCIONISTA', 'ROLE_INSTRUTOR', 'ROLE_ALUNO')")
    public ResponseEntity<AlunoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_RECEPCIONISTA')")
    public ResponseEntity<AlunoResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AlunoUpdateDTO dto) {
        return ResponseEntity.ok(alunoService.atualizarAluno(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_RECEPCIONISTA')")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        alunoService.inativarAluno(id);
        return ResponseEntity.noContent().build();
    }
}
