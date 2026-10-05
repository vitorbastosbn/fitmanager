package com.fitmanager.modules.financeiro.service;

import com.fitmanager.core.exception.RecursoNaoEncontradoException;
import com.fitmanager.core.exception.RegraNegocioException;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import com.fitmanager.modules.financeiro.domain.Cobranca;
import com.fitmanager.modules.financeiro.domain.Pagamento;
import com.fitmanager.modules.financeiro.domain.StatusCobranca;
import com.fitmanager.modules.financeiro.dto.PagarCobrancaDTO;
import com.fitmanager.modules.financeiro.dto.PagamentoResponseDTO;
import com.fitmanager.modules.financeiro.repository.CobrancaRepository;
import com.fitmanager.modules.financeiro.repository.PagamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PagamentoService {

    private final CobrancaRepository cobrancaRepository;
    private final PagamentoRepository pagamentoRepository;
    private final UsuarioRepository usuarioRepository;

    public PagamentoService(
            CobrancaRepository cobrancaRepository,
            PagamentoRepository pagamentoRepository,
            UsuarioRepository usuarioRepository) {
        this.cobrancaRepository = cobrancaRepository;
        this.pagamentoRepository = pagamentoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PagamentoResponseDTO quitarCobranca(Long cobrancaId, PagarCobrancaDTO dto, String emailOperador) {
        Cobranca cobranca = cobrancaRepository.findById(cobrancaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cobrança não encontrada com ID: " + cobrancaId));

        // Prevenção de pagamento duplo / idempotência
        if (cobranca.getStatus() == StatusCobranca.PAGO) {
            throw new RegraNegocioException("Esta cobrança já se encontra quitada no sistema.");
        }

        if (pagamentoRepository.existsByCobrancaId(cobrancaId)) {
            throw new RegraNegocioException("Já existe um registro de pagamento associado a esta cobrança.");
        }

        Usuario operador = usuarioRepository.findByEmail(emailOperador)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Operador/recebedor não localizado: " + emailOperador));

        Pagamento pagamento = new Pagamento(
                null,
                cobranca,
                operador,
                dto.getValorPago(),
                dto.getFormaPagamento(),
                dto.getIdentificadorTransacao(),
                dto.getObservacao()
        );

        cobranca.setStatus(StatusCobranca.PAGO);
        cobrancaRepository.save(cobranca);

        pagamento = pagamentoRepository.save(pagamento);

        return PagamentoResponseDTO.fromEntity(pagamento);
    }
}
