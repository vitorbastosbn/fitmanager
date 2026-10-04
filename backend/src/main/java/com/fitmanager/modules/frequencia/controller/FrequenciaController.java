package com.fitmanager.modules.frequencia.controller;

import com.fitmanager.modules.frequencia.domain.StatusAcessoCheckin;
import com.fitmanager.modules.frequencia.dto.CheckInItemDTO;
import com.fitmanager.modules.frequencia.dto.CheckInRequestDTO;
import com.fitmanager.modules.frequencia.dto.CheckInResponseDTO;
import com.fitmanager.modules.frequencia.dto.QrTokenResponseDTO;
import com.fitmanager.modules.frequencia.service.FrequenciaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/frequencia")
public class FrequenciaController {

    private final FrequenciaService frequenciaService;

    public FrequenciaController(FrequenciaService frequenciaService) {
        this.frequenciaService = frequenciaService;
    }

    @GetMapping("/qrcode-token")
    @PreAuthorize("hasRole('ROLE_ALUNO')")
    public ResponseEntity<QrTokenResponseDTO> gerarToken(Principal principal) {
        return ResponseEntity.ok(frequenciaService.gerarTokenCheckin(principal.getName()));
    }

    @PostMapping("/check-in")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_RECEPCIONISTA')")
    public ResponseEntity<CheckInResponseDTO> registrarCheckIn(
            @Valid @RequestBody CheckInRequestDTO dto,
            Principal principal) {
        CheckInResponseDTO resultado = frequenciaService.validarERegistrarCheckIn(
                dto.getToken(),
                principal != null ? principal.getName() : null
        );

        if (resultado.getStatus() == StatusAcessoCheckin.BLOQUEADO) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(resultado);
        }

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/hoje")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_RECEPCIONISTA')")
    public ResponseEntity<List<CheckInItemDTO>> listarHoje() {
        return ResponseEntity.ok(frequenciaService.listarCheckInsHoje());
    }
}
