import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCadastro } from './usuario-cadastro';

describe('UsuarioCadastro', () => {
  let component: UsuarioCadastro;
  let fixture: ComponentFixture<UsuarioCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioCadastro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
