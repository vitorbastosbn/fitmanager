package com.fitmanager.modules.plano.repository;

import com.fitmanager.modules.plano.domain.Plano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanoRepository extends JpaRepository<Plano, Long> {
    List<Plano> findByAtivoTrue();
}
