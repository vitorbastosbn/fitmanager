package com.fitmanager.modules.auth.controller;

import com.fitmanager.modules.auth.dto.AlterarSenhaPrimeiroAcessoDTO;
import com.fitmanager.modules.auth.dto.LoginRequestDTO;
import com.fitmanager.modules.auth.dto.TokenResponseDTO;
import com.fitmanager.modules.auth.dto.UsuarioDTO;
import com.fitmanager.modules.auth.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authenticationService.autenticar(dto));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> me(Principal principal) {
        return ResponseEntity.ok(authenticationService.obterUsuarioAutenticado(principal.getName()));
    }

    @PostMapping("/alterar-senha-primeiro-acesso")
    public ResponseEntity<Map<String, String>> alterarSenhaPrimeiroAcesso(
            Principal principal,
            @Valid @RequestBody AlterarSenhaPrimeiroAcessoDTO dto) {
        authenticationService.alterarSenhaPrimeiroAcesso(principal.getName(), dto);
        return ResponseEntity.ok(Map.of("mensagem", "Senha alterada com sucesso. Acesso liberado."));
    }
}
