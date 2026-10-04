package com.fitmanager.modules.treino.controller;

import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.service.AlunoService;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import com.fitmanager.modules.treino.domain.GrupoMuscular;
import com.fitmanager.modules.treino.dto.*;
import com.fitmanager.modules.treino.service.ExercicioService;
import com.fitmanager.modules.treino.service.FichaTreinoService;
import com.fitmanager.modules.treino.service.TreinoExecucaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class TreinoController {

    private final ExercicioService exercicioService;
    private final FichaTreinoService fichaTreinoService;
    private final TreinoExecucaoService treinoExecucaoService;
    private final AlunoService alunoService;
    private final UsuarioRepository usuarioRepository;

    public TreinoController(
            ExercicioService exercicioService,
            FichaTreinoService fichaTreinoService,
            TreinoExecucaoService treinoExecucaoService,
            AlunoService alunoService,
            UsuarioRepository usuarioRepository) {
        this.exercicioService = exercicioService;
        this.fichaTreinoService = fichaTreinoService;
        this.treinoExecucaoService = treinoExecucaoService;
        this.alunoService = alunoService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/exercicios")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ExercicioDTO>> listarExercicios(@RequestParam(required = false) GrupoMuscular grupoMuscular) {
        return ResponseEntity.ok(exercicioService.listarExercicios(grupoMuscular));
    }

    @PostMapping("/fichas-treino")
    @PreAuthorize("hasAnyRole('ROLE_INSTRUTOR', 'ROLE_ADMIN')")
    public ResponseEntity<FichaTreinoDTO> prescreverFicha(@Valid @RequestBody CriarFichaTreinoDTO dto, Principal principal) {
        FichaTreinoDTO ficha = fichaTreinoService.prescreverFicha(dto, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ficha);
    }

    @GetMapping("/alunos/{alunoId}/ficha-ativa")
    @PreAuthorize("hasAnyRole('ROLE_INSTRUTOR', 'ROLE_ADMIN', 'ROLE_RECEPCIONISTA', 'ROLE_ALUNO')")
    public ResponseEntity<FichaTreinoDTO> buscarFichaAtiva(@PathVariable Long alunoId) {
        return ResponseEntity.ok(fichaTreinoService.buscarFichaAtiva(alunoId));
    }

    @GetMapping("/alunos/me/ficha-ativa")
    @PreAuthorize("hasRole('ROLE_ALUNO')")
    public ResponseEntity<FichaTreinoDTO> buscarMinhaFichaAtiva(Principal principal) {
        Usuario usuario = usuarioRepository.findByEmail(principal.getName()).orElseThrow();
        Aluno aluno = alunoService.buscarPorUsuarioId(usuario.getId());
        return ResponseEntity.ok(fichaTreinoService.buscarFichaAtiva(aluno.getId()));
    }

    @PostMapping("/treinos/execucoes")
    @PreAuthorize("hasRole('ROLE_ALUNO')")
    public ResponseEntity<RegistroExecucaoResponseDTO> registrarExecucao(
            @Valid @RequestBody RegistrarExecucaoDTO dto,
            Principal principal) {
        RegistroExecucaoResponseDTO response = treinoExecucaoService.registrarExecucao(dto, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
