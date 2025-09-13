import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { ActivatedRoute, Router } from '@angular/router';

import { CpfValidatorService } from '../../servicos/cpf-validator';
import { UsuarioService } from '../../servicos/usuario-service';
import { Usuario } from '../../models/usuario.model'; 

@Component({
  selector: 'app-usuario-crud',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective
  ],
  templateUrl: './usuario-crud.html',
  styleUrls: ['./usuario-crud.css']
})
export class UsuarioCrud implements OnInit {
  usuario: Usuario = new Usuario();
  isEditMode: boolean = false;

  constructor(
    private cpfValidator: CpfValidatorService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const cpf = this.route.snapshot.paramMap.get('cpf');

    if (cpf) {
      this.isEditMode = true;
      this.usuarioService.buscarPorCpf(cpf).subscribe({
        next: (data) => {
          // Garante que o biometriaHash é uma string, mesmo que null do backend
          const biometriaHash = data.biometriaHash || '';
          this.usuario = new Usuario(
            data.cpf,
            data.nome,
            data.matricula,
            data.setor,
            data.tipo,
            biometriaHash,
            data.dataNascimento
          );
          console.log('Dados do usuário carregados para edição:', this.usuario);
        },
        error: (err) => {
          console.error('Erro ao buscar usuário:', err);
          this.router.navigate(['/']);
        }
      });
    }
  }

  salvarUsuario() {
    if (!this.cpfValidator.validarCPF(this.usuario.cpf)) {
      console.error('CPF inválido:', this.usuario.cpf);
      return;
    }

    if (!this.isEditMode) {
      const biometriaMockString = "mock-biometric-hash-for-new-user-123";
      this.usuario.biometriaHash = this.usuarioService.stringToBase64(biometriaMockString);
    }
    
    if (this.usuario.biometriaHash === null || this.usuario.biometriaHash === undefined) {
      console.error('Erro: biometriaHash não pode ser nulo.');
      return;
    }

    if (this.isEditMode) {
      this.usuarioService.atualizarUsuario(this.usuario.cpf, this.usuario).subscribe({
        next: () => {
          console.log('Usuário atualizado com sucesso!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erro ao atualizar usuário:', err);
        }
      });
    } else {
      // Adiciona uma mensagem de log para exibir os dados antes de enviá-los
      console.log('Enviando dados do novo usuário:', this.usuario);
      this.usuarioService.cadastrarUsuario(this.usuario).subscribe({
        next: () => {
          console.log('Usuário cadastrado com sucesso!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erro ao cadastrar usuário:', err);
        }
      });
    }
  }

  remover() {
    if (this.usuario.cpf) {
      this.usuarioService.deletarUsuario(this.usuario.cpf).subscribe({
        next: () => {
          console.log('Usuário removido com sucesso!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erro ao remover usuário:', err);
        }
      });
    }
  }

  obterBiometria() {
    const biometriaBase64 = "mock-biometric-hash-for-new-user-123";
    const biometriaBytes = this.usuarioService.base64ToUint8Array(biometriaBase64);

    this.usuarioService.validarBiometria(biometriaBytes).subscribe({
      next: (usuario) => {
        console.log('Biometria validada com sucesso para:', usuario.nome);
      },
      error: (err) => {
        console.error('Erro ao validar biometria:', err);
      }
    });
  }
}
