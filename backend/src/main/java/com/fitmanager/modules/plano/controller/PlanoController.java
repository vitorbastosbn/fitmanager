package com.fitmanager.modules.plano.controller;

import com.fitmanager.modules.plano.dto.PlanoDTO;
import com.fitmanager.modules.plano.service.PlanoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/planos")
public class PlanoController {

    private final PlanoService planoService;

    public PlanoController(PlanoService planoService) {
        this.planoService = planoService;
    }

    @GetMapping
    public ResponseEntity<List<PlanoDTO>> listar(@RequestParam(required = false, defaultValue = "false") Boolean apenasAtivos) {
        return ResponseEntity.ok(planoService.listar(apenasAtivos));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlanoDTO> criar(@Valid @RequestBody PlanoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planoService.criar(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlanoDTO> atualizar(@PathVariable Long id, @Valid @RequestBody PlanoDTO dto) {
        return ResponseEntity.ok(planoService.atualizar(id, dto));
    }
}
