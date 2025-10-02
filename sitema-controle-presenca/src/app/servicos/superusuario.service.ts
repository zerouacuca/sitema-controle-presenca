import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Superusuario {
  cpf: string;
  nome: string;
  email: string;
  senha: string;
}

export interface ValidacaoSenha {
  valido: boolean;
  mensagem: string;
}

@Injectable({
  providedIn: 'root'
})
export class SuperusuarioService {
  private apiUrl = `${environment.backendApiUrl}/admin/superusuarios`;

  constructor(private http: HttpClient) {}

  /**
   * Cria um novo superusuário
   */
  criarSuperusuario(superusuario: Superusuario): Observable<any> {
    console.log('📤 Enviando para:', this.apiUrl);
    console.log('📦 Dados:', superusuario);
    
    return this.http.post(this.apiUrl, superusuario, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  validarCPF(cpf: string): boolean {
    // Sua lógica de validação de CPF
    return cpf.length === 11 && /^\d+$/.test(cpf);
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validarSenha(senha: string): ValidacaoSenha {
    if (senha.length < 3) {
      return { valido: false, mensagem: 'A senha deve ter pelo menos 3 caracteres.' };
    }
    return { valido: true, mensagem: '' };
  }

  removerFormatacaoCPF(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  formatarCPF(cpf: string): string {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length <= 3) {
      return cpf;
    } else if (cpf.length <= 6) {
      return cpf.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    } else if (cpf.length <= 9) {
      return cpf.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    }
  }
}