package com.fitmanager.modules.plano.service;

import com.fitmanager.core.exception.RecursoNaoEncontradoException;
import com.fitmanager.modules.plano.domain.Plano;
import com.fitmanager.modules.plano.dto.PlanoDTO;
import com.fitmanager.modules.plano.repository.PlanoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PlanoService {

    private final PlanoRepository planoRepository;

    public PlanoService(PlanoRepository planoRepository) {
        this.planoRepository = planoRepository;
    }

    @Transactional(readOnly = true)
    public List<PlanoDTO> listar(Boolean apenasAtivos) {
        List<Plano> planos = Boolean.TRUE.equals(apenasAtivos)
                ? planoRepository.findByAtivoTrue()
                : planoRepository.findAll();
        return planos.stream().map(PlanoDTO::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public Plano buscarEntidadePorId(Long id) {
        return planoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Plano não encontrado com ID: " + id));
    }

    @Transactional
    public PlanoDTO criar(PlanoDTO dto) {
        Plano plano = new Plano(
                null,
                dto.getNome(),
                dto.getDescricao(),
                dto.getValorMensalidade(),
                dto.getPeriodicidade(),
                dto.getAtivo()
        );
        plano = planoRepository.save(plano);
        return PlanoDTO.fromEntity(plano);
    }

    @Transactional
    public PlanoDTO atualizar(Long id, PlanoDTO dto) {
        Plano plano = buscarEntidadePorId(id);
        plano.setNome(dto.getNome());
        plano.setDescricao(dto.getDescricao());
        plano.setValorMensalidade(dto.getValorMensalidade());
        plano.setPeriodicidade(dto.getPeriodicidade());
        if (dto.getAtivo() != null) {
            plano.setAtivo(dto.getAtivo());
        }
        plano = planoRepository.save(plano);
        return PlanoDTO.fromEntity(plano);
    }
}
