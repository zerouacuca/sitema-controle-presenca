import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Login as LoginModel, AuthResponse } from '../../models/login.model';
import { AuthService } from '../../servicos/auth.service';

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

  // Método para criar admin (desenvolvimento)
  setupAdmin() {
    this.authService.setupAdmin().subscribe({
      next: (response: any) => {
        console.log('Admin configurado:', response);
        alert('Admin configurado com sucesso! Use: admin@admin.com / admin');
      },
      error: (error) => {
        console.error('Erro ao configurar admin:', error);
        alert('Erro ao configurar admin: ' + error.message);
      }
    });
  }
}