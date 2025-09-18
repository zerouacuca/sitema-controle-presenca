import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { ActivatedRoute, Router } from '@angular/router';
import { Navbar } from '../../componentes/navbar/navbar';

import { CpfValidatorService } from '../../servicos/cpf-validator';
import { UsuarioService } from '../../servicos/usuario-service';
import { Usuario } from '../../models/usuario.model'; 

@Component({
  selector: 'app-usuario-crud',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    Navbar
  ],
  templateUrl: './usuario-crud.html',
  styleUrls: ['./usuario-crud.css']
})
export class UsuarioCrud implements OnInit {
  usuario: Usuario = {
    cpf: '',
    nome: '',
    matricula: '',
    setor: '',
    template: '',
    dataNascimento: ''
  };
  
  isEditMode: boolean = false;
  isLoading: boolean = false;

  constructor(
    private cpfValidator: CpfValidatorService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const cpf = this.route.snapshot.paramMap.get('cpf');

    if (cpf) {
      this.isEditMode = true;
      this.carregarUsuario(cpf);
    }
  }

  carregarUsuario(cpf: string): void {
    this.isLoading = true;
    this.usuarioService.buscarPorCpf(cpf).subscribe({
      next: (data) => {
        this.usuario = {
          cpf: data.cpf,
          nome: data.nome,
          matricula: data.matricula,
          setor: data.setor || '',
          template: data.template || '',
          dataNascimento: data.dataNascimento
        };
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar usuário:', err);
        this.isLoading = false;
        this.navegarParaLista();
      }
    });
  }

  salvarUsuario(): void {
    if (!this.cpfValidator.validarCPF(this.usuario.cpf)) {
      alert('CPF inválido!');
      return;
    }

    if (!this.isEditMode) {
      const biometriaMockString = "mock-biometric-hash-for-new-user-123";
      this.usuario.template = this.usuarioService.stringToBase64(biometriaMockString);
    }
    
    if (!this.usuario.template) {
      alert('Erro: template de biometria não pode estar vazio.');
      return;
    }

    this.isLoading = true;

    if (this.isEditMode) {
      this.usuarioService.atualizarUsuario(this.usuario.cpf, this.usuario).subscribe({
        next: () => {
          console.log('Usuário atualizado com sucesso!');
          this.isLoading = false;
          this.navegarParaLista();
        },
        error: (err) => {
          console.error('Erro ao atualizar usuário:', err);
          this.isLoading = false;
          alert('Erro ao atualizar usuário. Verifique o console para detalhes.');
        }
      });
    } else {
      this.usuarioService.cadastrarUsuario(this.usuario).subscribe({
        next: () => {
          console.log('Usuário cadastrado com sucesso!');
          this.isLoading = false;
          this.navegarParaLista();
        },
        error: (err) => {
          console.error('Erro ao cadastrar usuário:', err);
          this.isLoading = false;
          alert('Erro ao cadastrar usuário. Verifique o console para detalhes.');
        }
      });
    }
  }

  remover(): void {
    if (this.usuario.cpf && confirm('Tem certeza que deseja remover este usuário?')) {
      this.isLoading = true;
      this.usuarioService.deletarUsuario(this.usuario.cpf).subscribe({
        next: () => {
          console.log('Usuário removido com sucesso!');
          this.isLoading = false;
          this.navegarParaLista();
        },
        error: (err) => {
          console.error('Erro ao remover usuário:', err);
          this.isLoading = false;
          alert('Erro ao remover usuário.');
        }
      });
    }
  }

  obterBiometria(): void {
    this.isLoading = true;
    const biometriaBase64 = "mock-biometric-hash-for-new-user-123";
    const biometriaBytes = this.usuarioService.base64ToUint8Array(biometriaBase64);

    this.usuarioService.validarBiometria(biometriaBytes).subscribe({
      next: (usuario) => {
        console.log('Biometria validada com sucesso para:', usuario.nome);
        this.usuario.template = biometriaBase64;
        this.isLoading = false;
        alert('Biometria obtida com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao validar biometria:', err);
        this.isLoading = false;
        alert('Erro ao obter biometria.');
      }
    });
  }

  // Métodos públicos para navegação
  navegarParaLista(): void {
    this.router.navigate(['/usuarios']);
  }

  cancelar(): void {
    this.navegarParaLista();
  }
}