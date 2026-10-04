package com.fitmanager.modules.dashboard.controller;

import com.fitmanager.modules.dashboard.dto.DashboardAdminDTO;
import com.fitmanager.modules.dashboard.dto.DashboardAlunoDTO;
import com.fitmanager.modules.dashboard.dto.DashboardInstrutorDTO;
import com.fitmanager.modules.dashboard.dto.DashboardRecepcaoDTO;
import com.fitmanager.modules.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardAdminDTO> obterDashboardAdmin() {
        return ResponseEntity.ok(dashboardService.obterDashboardAdmin());
    }

    @GetMapping("/recepcao")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCIONISTA')")
    public ResponseEntity<DashboardRecepcaoDTO> obterDashboardRecepcao() {
        return ResponseEntity.ok(dashboardService.obterDashboardRecepcao());
    }

    @GetMapping("/instrutor")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUTOR')")
    public ResponseEntity<DashboardInstrutorDTO> obterDashboardInstrutor(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : "";
        return ResponseEntity.ok(dashboardService.obterDashboardInstrutor(email));
    }

    @GetMapping("/aluno")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<DashboardAlunoDTO> obterDashboardAluno(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : "";
        return ResponseEntity.ok(dashboardService.obterDashboardAluno(email));
    }
}
