package com.fitmanager.modules.lgpd.repository;

import com.fitmanager.modules.lgpd.domain.LogAuditoriaLgpd;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogAuditoriaLgpdRepository extends JpaRepository<LogAuditoriaLgpd, Long> {
    Page<LogAuditoriaLgpd> findAllByOrderByCriadoEmDesc(Pageable pageable);
    List<LogAuditoriaLgpd> findTop50ByOrderByCriadoEmDesc();
}
