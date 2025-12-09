import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SuperusuarioService, Superusuario } from '../../servicos/superusuario.service';

@Component({
  selector: 'app-superusuario-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './superusuario-crud.component.html',
  styleUrls: ['./superusuario-crud.component.css']
})
export class SuperusuarioCrudComponent implements OnInit {
  superusuario: any = {
    matricula: '',
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  };
  
  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private superusuarioService: SuperusuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const matricula = this.route.snapshot.params['matricula'];
    if (matricula) {
      this.isEditMode = true;
      this.isLoading = true;
      this.superusuarioService.getSuperusuario(matricula).subscribe({
        next: (data: any) => { 
          this.superusuario = data;
          this.isLoading = false;
        },
        error: (err: any) => { 
          this.errorMessage = 'Erro ao carregar dados do superusuário.';
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Validações
    if (!this.superusuario.matricula || !this.superusuario.nome || !this.superusuario.email) {
      this.errorMessage = 'Por favor, preencha Matrícula, Nome e E-mail.';
      this.isLoading = false;
      return;
    }

    // Prepara dados para envio
    const dadosEnvio: any = {
      matricula: this.superusuario.matricula.trim(),
      nome: this.superusuario.nome.trim(),
      email: this.superusuario.email.trim(),
      senha: this.superusuario.senha
    };

    if (this.isEditMode) {
      // MODO EDIÇÃO
      if (this.superusuario.senha) {
        if (this.superusuario.senha !== this.superusuario.confirmarSenha) {
          this.errorMessage = 'As senhas não coincidem.';
          this.isLoading = false;
          return;
        }
        const validacaoSenha = this.superusuarioService.validarSenha(this.superusuario.senha);
        if (!validacaoSenha.valido) {
          this.errorMessage = validacaoSenha.mensagem;
          this.isLoading = false;
          return;
        }
      } else {
        // Se a senha estiver vazia na edição, não a envia
        delete dadosEnvio.senha;
      }
      
      this.superusuarioService.atualizarSuperusuario(this.superusuario.matricula, dadosEnvio).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Superusuário atualizado com sucesso!';
          setTimeout(() => this.voltar(), 2000);
        },
        error: (error: any) => this.handleError(error)
      });

    } else {
      // MODO CRIAÇÃO
      if (!this.superusuario.senha || !this.superusuario.confirmarSenha) {
        this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
        this.isLoading = false;
        return;
      }
      
      if (this.superusuario.senha !== this.superusuario.confirmarSenha) {
        this.errorMessage = 'As senhas não coincidem.';
        this.isLoading = false;
        return;
      }
      
      const validacaoSenha = this.superusuarioService.validarSenha(this.superusuario.senha);
      if (!validacaoSenha.valido) {
        this.errorMessage = validacaoSenha.mensagem;
        this.isLoading = false;
        return;
      }

      this.superusuarioService.criarSuperusuario(dadosEnvio).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Superusuário criado com sucesso!';
          setTimeout(() => this.voltar(), 2000);
        },
        error: (error: any) => this.handleError(error)
      });
    }
  }

  private handleError(error: any): void {
    this.isLoading = false;
    console.error('❌ Erro:', error);
    
    if (error.status === 400) {
      this.errorMessage = 'Dados inválidos. Verifique as informações.';
    } else if (error.status === 409) {
      this.errorMessage = 'Já existe um superusuário com esta Matrícula ou e-mail.';
    } else if (error.status === 401 || error.status === 403) {
      this.errorMessage = 'Você não tem permissão para esta operação.';
    } else {
      this.errorMessage = 'Erro ao salvar. Tente novamente.';
    }
  }

  voltar(): void {
    this.router.navigate(['/superusuarios']);
  }

  // Limpa mensagens quando o usuário começa a digitar
  onInputChange(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
    if (this.successMessage) {
      this.successMessage = '';
    }
  }
}