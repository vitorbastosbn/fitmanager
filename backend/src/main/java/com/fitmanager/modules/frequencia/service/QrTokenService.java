package com.fitmanager.modules.frequencia.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Service
public class QrTokenService {

    private final SecretKey key;
    public static final int VALIDADE_SEGUNDOS = 60;

    public QrTokenService(@Value("${app.jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public record QrTokenData(Long alunoId, String nonce) {}

    public String gerarToken(Long alunoId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + (VALIDADE_SEGUNDOS * 1000L));
        String nonce = UUID.randomUUID().toString().replace("-", "");

        return Jwts.builder()
                .subject(String.valueOf(alunoId))
                .claim("alunoId", alunoId)
                .claim("nonce", nonce)
                .claim("type", "CHECKIN_QR")
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public QrTokenData validarToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String type = claims.get("type", String.class);
            if (!"CHECKIN_QR".equals(type)) {
                throw new IllegalArgumentException("Tipo de token inválido para check-in.");
            }

            Long alunoId = claims.get("alunoId", Long.class);
            if (alunoId == null) {
                alunoId = Long.parseLong(claims.getSubject());
            }
            String nonce = claims.get("nonce", String.class);

            return new QrTokenData(alunoId, nonce);
        } catch (JwtException | IllegalArgumentException e) {
            throw new IllegalArgumentException("QR Code expirado ou inválido: " + e.getMessage(), e);
        }
    }
}
