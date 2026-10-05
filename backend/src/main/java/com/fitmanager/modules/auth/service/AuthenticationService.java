package com.fitmanager.modules.auth.service;

import com.fitmanager.core.exception.RegraNegocioException;
import com.fitmanager.core.security.JwtTokenProvider;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.dto.AlterarSenhaPrimeiroAcessoDTO;
import com.fitmanager.modules.auth.dto.LoginRequestDTO;
import com.fitmanager.modules.auth.dto.TokenResponseDTO;
import com.fitmanager.modules.auth.dto.UsuarioDTO;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthenticationService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional(readOnly = true)
    public TokenResponseDTO autenticar(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        if (Boolean.FALSE.equals(usuario.getAtivo())) {
            throw new RegraNegocioException("Usuário inativo. Contate o administrador do sistema.");
        }

        if (!passwordEncoder.matches(dto.getSenha(), usuario.getSenhaHash())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }

        String token = tokenProvider.generateToken(usuario);

        return new TokenResponseDTO(
                token,
                "Bearer",
                tokenProvider.getExpirationMs(),
                UsuarioDTO.fromEntity(usuario)
        );
    }

    @Transactional(readOnly = true)
    public UsuarioDTO obterUsuarioAutenticado(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Usuário não encontrado."));
        return UsuarioDTO.fromEntity(usuario);
    }

    @Transactional
    public void alterarSenhaPrimeiroAcesso(String email, AlterarSenhaPrimeiroAcessoDTO dto) {
        if (!dto.getNovaSenha().equals(dto.getConfirmacaoNovaSenha())) {
            throw new RegraNegocioException("A confirmação da senha não confere com a nova senha digitada.");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Usuário não encontrado."));

        usuario.setSenhaHash(passwordEncoder.encode(dto.getNovaSenha()));
        usuario.setPrimeiroAcesso(false);
        usuarioRepository.save(usuario);
    }
}
