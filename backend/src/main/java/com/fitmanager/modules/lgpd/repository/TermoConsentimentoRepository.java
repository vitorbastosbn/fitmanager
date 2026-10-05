package com.fitmanager.modules.lgpd.repository;

import com.fitmanager.modules.lgpd.domain.TermoConsentimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TermoConsentimentoRepository extends JpaRepository<TermoConsentimento, Long> {
    Optional<TermoConsentimento> findFirstByAtivoTrueOrderByDataPublicacaoDesc();
    Optional<TermoConsentimento> findByVersao(String versao);
}
