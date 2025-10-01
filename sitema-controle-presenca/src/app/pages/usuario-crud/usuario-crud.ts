import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { ActivatedRoute, Router } from '@angular/router';

import { CpfValidatorService } from '../../servicos/cpf-validator';
import { UsuarioService } from '../../servicos/usuario-service';
import { BiometricService } from '../../servicos/biometric-service';
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
  isCapturingBiometry: boolean = false;
  biometryError: string = '';

  constructor(
    private cpfValidator: CpfValidatorService,
    private usuarioService: UsuarioService,
    private biometricService: BiometricService,
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

    if (!this.usuario.template) {
      alert('É necessário capturar a biometria antes de salvar!');
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
    this.isCapturingBiometry = true;
    this.biometryError = '';
    this.cd.detectChanges(); // Força a atualização da view

    this.biometricService.captureHash(false).subscribe({
      next: (response) => {
        this.isCapturingBiometry = false;

        if (response.success) {
          this.usuario.template = response.template;
          this.cd.detectChanges();
          alert('Biometria capturada com sucesso!');
        } else {
          this.biometryError = response.message || 'Falha na captura da biometria';
          alert('Falha na captura da biometria: ' + this.biometryError);
        }
      },
      error: (error) => {
        this.isCapturingBiometry = false;
        this.biometryError = this.getErrorMessage(error);
        this.cd.detectChanges(); // Força a atualização da view

        console.error('Erro ao capturar biometria:', error);

        // Aguarda um pouco antes de mostrar o alerta para garantir que a UI foi atualizada
        setTimeout(() => {
          if (error.message && error.message.includes('Error on Capture')) {
            alert('Erro no dispositivo biométrico. Verifique se o dispositivo está conectado e tente novamente.');
          } else if (error.message && error.message.includes('Http failure response')) {
            alert('Erro de comunicação com o serviço de biometria. Verifique se o serviço está rodando na porta 5000.');
          } else {
            alert('Erro ao capturar biometria: ' + error.message);
          }
        }, 100);
      }
    });
  }

  // Método auxiliar para obter mensagem de erro
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

  // Método para cancelar a captura de biometria
  cancelarCapturaBiometria(): void {
    this.isCapturingBiometry = false;
    this.biometryError = '';
    this.cd.detectChanges();
  }

  // Método para cadastro completo com biometria
  cadastrarComBiometria(): void {
    if (!this.cpfValidator.validarCPF(this.usuario.cpf)) {
      alert('CPF inválido!');
      return;
    }

    if (!this.usuario.nome || !this.usuario.matricula || !this.usuario.dataNascimento) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    this.isLoading = true;

    this.biometricService.cadastrarUsuarioComBiometria({
      cpf: this.usuario.cpf,
      nome: this.usuario.nome,
      matricula: this.usuario.matricula,
      setor: this.usuario.setor
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Usuário cadastrado com sucesso!', response);
        alert('Usuário cadastrado com sucesso!');
        this.navegarParaLista();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao cadastrar usuário: ' + error.message);
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

  // Verifica se o formulário está válido para cadastro
  isFormValid(): boolean {
    return !!this.usuario.cpf &&
           !!this.usuario.nome &&
           !!this.usuario.matricula &&
           !!this.usuario.dataNascimento &&
           !!this.usuario.template;
  }
}
