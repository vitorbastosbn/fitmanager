package com.fitmanager.modules.aluno.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CpfValidator implements ConstraintValidator<CPF, String> {

    @Override
    public boolean isValid(String cpf, ConstraintValidatorContext context) {
        if (cpf == null) {
            return false;
        }

        // Remove caracteres não numéricos
        String limpo = cpf.replaceAll("\\D", "");

        if (limpo.length() != 11) {
            return false;
        }

        // Rejeita padrões com todos os dígitos iguais (ex: 11111111111)
        if (limpo.matches("(\\d)\\1{10}")) {
            return false;
        }

        try {
            // Primeiro dígito verificador
            int soma = 0;
            for (int i = 0; i < 9; i++) {
                soma += (limpo.charAt(i) - '0') * (10 - i);
            }
            int digito1 = 11 - (soma % 11);
            if (digito1 >= 10) digito1 = 0;

            if (digito1 != (limpo.charAt(9) - '0')) {
                return false;
            }

            // Segundo dígito verificador
            soma = 0;
            for (int i = 0; i < 10; i++) {
                soma += (limpo.charAt(i) - '0') * (11 - i);
            }
            int digito2 = 11 - (soma % 11);
            if (digito2 >= 10) digito2 = 0;

            return digito2 == (limpo.charAt(10) - '0');
        } catch (Exception e) {
            return false;
        }
    }
}
