import { TestBed } from '@angular/core/testing';

import { CpfValidatorService } from './cpf-validator';

describe('CpfValidatorService', () => {
  let service: CpfValidatorService;

  beforeEach(() => {
    service = new CpfValidatorService();
  });

  it('deve validar um CPF correto', () => {
    expect(service.validarCPF('12136717952')).toBeTrue();
    expect(service.validarCPF('52998224725')).toBeTrue();
  });

  it('deve invalidar um CPF com dígitos repetidos', () => {
    expect(service.validarCPF('11111111111')).toBeFalse();
    expect(service.validarCPF('00000000000')).toBeFalse();
  });

  it('deve invalidar um CPF com tamanho incorreto', () => {
    expect(service.validarCPF('123')).toBeFalse();
    expect(service.validarCPF('123456789123')).toBeFalse();
  });

  it('deve invalidar um CPF com dígitos verificadores errados', () => {
    expect(service.validarCPF('12136717951')).toBeFalse();
    expect(service.validarCPF('52998224724')).toBeFalse();
  });

  it('deve aceitar CPF com caracteres não numéricos removendo-os', () => {
    expect(service.validarCPF('529.982.247-25')).toBeTrue();
    });
});