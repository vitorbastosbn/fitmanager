package com.fitmanager.modules.lgpd.controller;

import com.fitmanager.modules.lgpd.dto.ExportacaoDadosLgpdDTO;
import com.fitmanager.modules.lgpd.dto.LogAuditoriaResponseDTO;
import com.fitmanager.modules.lgpd.dto.TermoVigenteDTO;
import com.fitmanager.modules.lgpd.service.LgpdService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import java.security.Principal;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/lgpd")
public class LgpdController {

    private final LgpdService lgpdService;

    public LgpdController(LgpdService lgpdService) {
        this.lgpdService = lgpdService;
    }

    @GetMapping("/termos/vigente")
    public ResponseEntity<TermoVigenteDTO> obterTermoVigente(Principal principal) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(lgpdService.obterTermoVigenteComStatus(email));
    }

    @PostMapping("/termos/{id}/aceite")
    public ResponseEntity<Map<String, String>> registrarAceite(
            @PathVariable Long id,
            Principal principal,
            HttpServletRequest request) {
        String email = principal != null ? principal.getName() : "";
        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");

        lgpdService.registrarAceite(id, email, ip, userAgent);
        return ResponseEntity.ok(Map.of("mensagem", "Consentimento registrado com sucesso."));
    }

    @GetMapping("/meus-dados/exportar")
    public ResponseEntity<ExportacaoDadosLgpdDTO> exportarDados(
            Principal principal,
            HttpServletRequest request) {
        String email = principal != null ? principal.getName() : "";
        String ip = request.getRemoteAddr();

        ExportacaoDadosLgpdDTO exportacao = lgpdService.exportarDados(email, ip);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"meus-dados-fitmanager.json\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(exportacao);
    }

    @PostMapping("/meus-dados/anonimizar")
    public ResponseEntity<Map<String, String>> anonimizar(
            Principal principal,
            HttpServletRequest request) {
        String email = principal != null ? principal.getName() : "";
        String ip = request.getRemoteAddr();

        lgpdService.anonimizarTitular(email, ip);
        return ResponseEntity.ok(Map.of("mensagem", "Seus dados pessoais foram anonimizados irreversivelmente conforme a LGPD."));
    }

    @GetMapping("/auditoria")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<LogAuditoriaResponseDTO>> listarAuditoria(
            @PageableDefault(size = 15) Pageable pageable) {
        return ResponseEntity.ok(lgpdService.listarAuditoria(pageable));
    }
}
