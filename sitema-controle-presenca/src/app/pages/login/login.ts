import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Login as LoginModel, AuthResponse } from '../../models/login.model';
import { AuthService } from '../../servicos/auth.service';
import { RecuperarSenhaComponent } from '../recuperar-senha/recuperar-senha.component';
import { RedefinirSenhaComponent } from '../redefinir-senha/redefinir-senha.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  login: LoginModel = new LoginModel();
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  recuperarSenha() {
    // Lógica para navegar para o componente de recuperação de senha
    this.router.navigate(['/recuperar-senha']);
  }

  onSubmit() {
    if (!this.login.email || !this.login.senha) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.login).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading = false;
        console.log('Login realizado com sucesso:', response);
        this.router.navigate(['/eventos']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro no login:', error);
        if (error.status === 400) {
          this.errorMessage = 'Credenciais inválidas. Tente novamente.';
        } else {
          this.errorMessage = 'Erro de conexão. Tente novamente.';
        }
      }
    });
  }
}