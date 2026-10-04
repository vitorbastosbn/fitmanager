package com.fitmanager.modules.colaborador.controller;

import com.fitmanager.modules.colaborador.dto.AtualizarColaboradorDTO;
import com.fitmanager.modules.colaborador.dto.ColaboradorResponseDTO;
import com.fitmanager.modules.colaborador.dto.CriarColaboradorDTO;
import com.fitmanager.modules.colaborador.service.ColaboradorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/colaboradores")
public class ColaboradorController {

    private final ColaboradorService colaboradorService;

    public ColaboradorController(ColaboradorService colaboradorService) {
        this.colaboradorService = colaboradorService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ColaboradorResponseDTO> criar(@Valid @RequestBody CriarColaboradorDTO dto) {
        ColaboradorResponseDTO criado = colaboradorService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ColaboradorResponseDTO>> listar(
            @RequestParam(required = false) String busca,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        return ResponseEntity.ok(colaboradorService.listar(busca, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ColaboradorResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(colaboradorService.buscarPorId(id));
    }

    @GetMapping("/instrutores")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCIONISTA', 'INSTRUTOR')")
    public ResponseEntity<List<ColaboradorResponseDTO>> listarInstrutoresAtivos() {
        return ResponseEntity.ok(colaboradorService.listarInstrutoresAtivos());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ColaboradorResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarColaboradorDTO dto) {
        return ResponseEntity.ok(colaboradorService.atualizar(id, dto));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ColaboradorResponseDTO> alterarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload) {
        Boolean novoStatus = payload.getOrDefault("ativo", true);
        return ResponseEntity.ok(colaboradorService.alterarStatus(id, novoStatus));
    }
}
