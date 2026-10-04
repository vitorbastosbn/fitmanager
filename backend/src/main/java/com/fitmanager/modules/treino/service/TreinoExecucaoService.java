package com.fitmanager.modules.treino.service;

import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.repository.AlunoRepository;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import com.fitmanager.modules.treino.domain.ItemDivisao;
import com.fitmanager.modules.treino.domain.RegistroExecucaoTreino;
import com.fitmanager.modules.treino.dto.RegistrarExecucaoDTO;
import com.fitmanager.modules.treino.dto.RegistroExecucaoResponseDTO;
import com.fitmanager.modules.treino.repository.ItemDivisaoRepository;
import com.fitmanager.modules.treino.repository.RegistroExecucaoTreinoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TreinoExecucaoService {

    private final RegistroExecucaoTreinoRepository registroRepository;
    private final AlunoRepository alunoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ItemDivisaoRepository itemDivisaoRepository;

    public TreinoExecucaoService(
            RegistroExecucaoTreinoRepository registroRepository,
            AlunoRepository alunoRepository,
            UsuarioRepository usuarioRepository,
            ItemDivisaoRepository itemDivisaoRepository) {
        this.registroRepository = registroRepository;
        this.alunoRepository = alunoRepository;
        this.usuarioRepository = usuarioRepository;
        this.itemDivisaoRepository = itemDivisaoRepository;
    }

    @Transactional
    public RegistroExecucaoResponseDTO registrarExecucao(RegistrarExecucaoDTO dto, String alunoEmail) {
        Usuario usuario = usuarioRepository.findByEmail(alunoEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        Aluno aluno = alunoRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil de aluno não encontrado."));

        ItemDivisao item = itemDivisaoRepository.findById(dto.getItemDivisaoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item de treino não encontrado."));

        RegistroExecucaoTreino registro = new RegistroExecucaoTreino(
                null,
                aluno,
                item,
                dto.getCargaUtilizadaKg(),
                dto.getRepeticoesRealizadas(),
                dto.getSeriesConcluidas(),
                dto.getObservacoes()
        );

        RegistroExecucaoTreino salvo = registroRepository.save(registro);
        return RegistroExecucaoResponseDTO.fromEntity(salvo);
    }
}
