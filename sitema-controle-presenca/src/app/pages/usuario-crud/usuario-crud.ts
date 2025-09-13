import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Adicione ChangeDetectorRef
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
  usuario: Usuario = new Usuario();
  isEditMode: boolean = false;

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
      this.usuarioService.buscarPorCpf(cpf).subscribe({
        next: (data) => {
          // Garante que o template é uma string, mesmo que null do backend
          const template = data.template || '';
          this.usuario = new Usuario(
            data.cpf,
            data.nome,
            data.matricula,
            data.setor,
            template,
            data.dataNascimento
          );
          console.log('Dados do usuário carregados para edição:', this.usuario);
          this.cd.detectChanges();
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
      this.usuario.template = this.usuarioService.stringToBase64(biometriaMockString);
    }
    
    if (this.usuario.template === null || this.usuario.template === undefined) {
      console.error('Erro: template não pode ser nulo.');
      return;
    }

    if (this.isEditMode) {
      this.usuarioService.atualizarUsuario(this.usuario.cpf, this.usuario).subscribe({
        next: () => {
          console.log('Usuário atualizado com sucesso!');
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          console.error('Erro ao atualizar usuário:', err);
        }
      });
    } else {
      console.log('Enviando dados do novo usuário:', this.usuario);
      this.usuarioService.cadastrarUsuario(this.usuario).subscribe({
        next: () => {
          console.log('Usuário cadastrado com sucesso!');
          this.router.navigate(['/usuarios']);
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
          this.router.navigate(['/usuarios']);
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