package com.fitmanager.modules.plano.controller;

import com.fitmanager.modules.plano.dto.CancelarMatriculaDTO;
import com.fitmanager.modules.plano.dto.MatriculaCreateDTO;
import com.fitmanager.modules.plano.dto.MatriculaResponseDTO;
import com.fitmanager.modules.plano.service.MatriculaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/matriculas")
public class MatriculaController {

    private final MatriculaService matriculaService;

    public MatriculaController(MatriculaService matriculaService) {
        this.matriculaService = matriculaService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_RECEPCIONISTA')")
    public ResponseEntity<MatriculaResponseDTO> matricular(@Valid @RequestBody MatriculaCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(matriculaService.matricular(dto));
    }

    @GetMapping("/aluno/{alunoId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_RECEPCIONISTA', 'ROLE_INSTRUTOR', 'ROLE_ALUNO')")
    public ResponseEntity<List<MatriculaResponseDTO>> listarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(matriculaService.listarPorAluno(alunoId));
    }

    @PostMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_RECEPCIONISTA')")
    public ResponseEntity<MatriculaResponseDTO> cancelar(
            @PathVariable Long id,
            @Valid @RequestBody CancelarMatriculaDTO dto) {
        return ResponseEntity.ok(matriculaService.cancelar(id, dto));
    }
}
