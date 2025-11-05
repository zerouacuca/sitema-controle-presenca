import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UsuarioService } from '../../servicos/usuario-service';
import { BiometricService } from '../../servicos/biometric-service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuario-crud',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './usuario-crud.html',
  styleUrls: ['./usuario-crud.css']
})
export class UsuarioCrud implements OnInit {
  usuario: Usuario = {
    nome: '',
    matricula: '',
    setor: '',
    email: '',
    template: '',
    dataNascimento: ''
  };

  isEditMode: boolean = false;
  isLoading: boolean = false;
  isCapturingBiometry: boolean = false;
  mensagem: string = '';
  erro: string = '';
  biometryError: string = '';
  matriculaInvalida: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private biometricService: BiometricService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const matricula = this.route.snapshot.paramMap.get('matricula');

    if (matricula) {
      this.isEditMode = true;
      this.carregarUsuario(matricula);
    }
  }

  carregarUsuario(matricula: string): void {
    this.isLoading = true;
    this.usuarioService.buscarPorMatricula(matricula).subscribe({
      next: (data) => {
        this.usuario = {
          nome: data.nome,
          matricula: data.matricula,
          setor: data.setor || '',
          email: data.email || '',
          template: data.template || '',
          dataNascimento: data.dataNascimento
        };
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar usuário:', err);
        this.erro = 'Erro ao carregar usuário.';
        this.isLoading = false;
        this.cd.detectChanges();
        setTimeout(() => this.navegarParaLista(), 2000);
      }
    });
  }

  salvarUsuario(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.isLoading = true;
    this.mensagem = '';
    this.erro = '';

    if (this.isEditMode) {
      this.usuarioService.atualizarUsuario(this.usuario.matricula, this.usuario).subscribe({
        next: () => {
          this.mensagem = 'Usuário atualizado com sucesso!';
          this.isLoading = false;
          this.cd.detectChanges();
          setTimeout(() => this.navegarParaLista(), 2000);
        },
        error: (err) => {
          console.error('Erro ao atualizar usuário:', err);
          this.erro = this.formatarMensagemErro(err, 'Erro ao atualizar usuário.');
          this.isLoading = false;
          this.cd.detectChanges();
        }
      });
    } else {
      this.usuarioService.cadastrarUsuario(this.usuario).subscribe({
        next: () => {
          this.mensagem = 'Usuário cadastrado com sucesso!';
          this.isLoading = false;
          this.cd.detectChanges();
          setTimeout(() => this.navegarParaLista(), 2000);
        },
        error: (err) => {
          console.error('Erro ao cadastrar usuário:', err);
          this.erro = this.formatarMensagemErro(err, 'Erro ao cadastrar usuário.');
          this.matriculaInvalida = err.status === 409;
          this.isLoading = false;
          this.cd.detectChanges();
        }
      });
    }
  }

  remover(): void {
    if (this.usuario.matricula && confirm('Tem certeza que deseja remover este usuário?')) {
      this.isLoading = true;
      this.usuarioService.deletarUsuario(this.usuario.matricula).subscribe({
        next: () => {
          this.mensagem = 'Usuário removido com sucesso!';
          this.isLoading = false;
          this.cd.detectChanges();
          setTimeout(() => this.navegarParaLista(), 2000);
        },
        error: (err) => {
          console.error('Erro ao remover usuário:', err);
          this.erro = this.formatarMensagemErro(err, 'Erro ao remover usuário.');
          this.isLoading = false;
          this.cd.detectChanges();
        }
      });
    }
  }

  obterBiometria(): void {
    this.isCapturingBiometry = true;
    this.biometryError = '';
    this.cd.detectChanges();

    this.biometricService.captureHash(false).subscribe({
      next: (response: any) => {
        this.isCapturingBiometry = false;

        if (response.success && response.template) {
          
          const templateString = response.template as string;

          this.usuario.template = templateString; 
          
          this.mensagem = 'Biometria capturada com sucesso!';
          this.erro = '';
          this.cd.detectChanges();

        } else {
          this.biometryError = response.message || 'Falha na captura da biometria';
          this.cd.detectChanges();
        }
      },
      error: (error) => {
        this.isCapturingBiometry = false;
        this.biometryError = this.getErrorMessage(error);
        this.cd.detectChanges();
        console.error('Erro ao capturar biometria:', error);
      }
    });
  }

  private validarFormulario(): boolean {
    this.erro = '';
    this.matriculaInvalida = false;

    if (!this.usuario.matricula || !this.usuario.nome || !this.usuario.email || !this.usuario.dataNascimento) {
       this.erro = 'Preencha todos os campos obrigatórios (*)';
       this.cd.detectChanges();
       return false;
    }

     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(this.usuario.email)) {
       this.erro = 'Formato de e-mail inválido.';
       this.cd.detectChanges();
       return false;
     }

    if (!this.isEditMode && !this.usuario.template) {
      this.erro = 'É necessário capturar a biometria antes de salvar!';
      this.cd.detectChanges();
      return false;
    }

    return true;
  }

   private formatarMensagemErro(err: any, mensagemPadrao: string): string {
    if (err.error && typeof err.error === 'string') {
      return err.error;
    } else if (err.error && err.error.message) {
      return err.error.message;
    } else if (err.status === 409) {
      return 'Matrícula ou E-mail já cadastrado.';
    }
    return mensagemPadrao;
  }

  private getErrorMessage(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    } else if (error.status === 0) {
      return 'Erro de conexão: Serviço de biometria não está respondendo';
    } else {
      return 'Erro desconhecido ao capturar biometria';
    }
  }

  cancelarCapturaBiometria(): void {
    this.isCapturingBiometry = false;
    this.biometryError = '';
    this.cd.detectChanges();
  }

  navegarParaLista(): void {
    this.router.navigate(['/tabela-usuarios']);
  }

  cancelar(): void {
    this.navegarParaLista();
  }
}