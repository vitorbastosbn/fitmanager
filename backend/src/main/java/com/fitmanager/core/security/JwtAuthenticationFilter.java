package com.fitmanager.core.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URI;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final ObjectMapper objectMapper;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, ObjectMapper objectMapper) {
        this.tokenProvider = tokenProvider;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String token = getTokenFromRequest(request);

        if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {
            Claims claims = tokenProvider.getClaims(token);
            String email = claims.getSubject();
            String role = claims.get("role", String.class);
            Boolean primeiroAcesso = claims.get("primeiroAcesso", Boolean.class);

            // Edge Case 1: Bloqueio estrito no SecurityFilterChain para primeiro acesso (ADR-008)
            String path = request.getRequestURI();
            boolean isAllowedOnFirstAccess = path.startsWith("/api/v1/auth/alterar-senha-primeiro-acesso")
                    || path.startsWith("/api/v1/auth/me")
                    || path.startsWith("/api/v1/auth/logout");

            if (Boolean.TRUE.equals(primeiroAcesso) && !isAllowedOnFirstAccess) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                        HttpStatus.FORBIDDEN,
                        "Acesso restrito: redefinição obrigatória de senha no primeiro acesso."
                );
                problem.setType(URI.create("https://api.fitmanager.com/erros/primeiro-acesso-pendente"));
                problem.setTitle("Primeiro Acesso Pendente");
                problem.setInstance(URI.create(path));
                response.getWriter().write(objectMapper.writeValueAsString(problem));
                return;
            }

            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);
            org.springframework.security.core.userdetails.User userPrincipal =
                    new org.springframework.security.core.userdetails.User(email, "", Collections.singletonList(authority));
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userPrincipal,
                    null,
                    Collections.singletonList(authority)
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
