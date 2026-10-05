package com.fitmanager.modules.treino.repository;

import com.fitmanager.modules.treino.domain.ItemDivisao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemDivisaoRepository extends JpaRepository<ItemDivisao, Long> {
}
