import { describe, it, expect } from 'vitest'
import { validarCPF, validarCNPJ, documentoValido } from '@/lib/documento'

describe('validarCPF', () => {
  it('aceita CPF válido (com e sem máscara)', () => {
    expect(validarCPF('529.982.247-25')).toBe(true)
    expect(validarCPF('52998224725')).toBe(true)
  })
  it('rejeita dígito verificador errado', () => {
    expect(validarCPF('529.982.247-26')).toBe(false)
    expect(validarCPF('123.456.789-00')).toBe(false)
  })
  it('rejeita todos os dígitos iguais e tamanho errado', () => {
    expect(validarCPF('111.111.111-11')).toBe(false)
    expect(validarCPF('123')).toBe(false)
    expect(validarCPF('')).toBe(false)
  })
})

describe('validarCNPJ', () => {
  it('aceita CNPJ válido (com e sem máscara)', () => {
    expect(validarCNPJ('11.222.333/0001-81')).toBe(true)
    expect(validarCNPJ('11222333000181')).toBe(true)
  })
  it('rejeita dígito verificador errado e tudo igual', () => {
    expect(validarCNPJ('11.222.333/0001-00')).toBe(false)
    expect(validarCNPJ('11.111.111/1111-11')).toBe(false)
    expect(validarCNPJ('')).toBe(false)
  })
})

describe('documentoValido (CPF 11 díg. OU CNPJ 14 díg.)', () => {
  it('aceita CPF e CNPJ válidos', () => {
    expect(documentoValido('529.982.247-25')).toBe(true)
    expect(documentoValido('11.222.333/0001-81')).toBe(true)
  })
  it('rejeita inválidos, vazio e tamanhos fora de 11/14', () => {
    expect(documentoValido('123.456.789-00')).toBe(false)
    expect(documentoValido('123456')).toBe(false)
    expect(documentoValido('')).toBe(false)
  })
})
