import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Superusuario {
  matricula: string;
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

  /**
   * Atualiza um superusuário existente
   */
  atualizarSuperusuario(matricula: string, superusuario: Superusuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/${matricula}`, superusuario);
  }

  /**
   * Busca um superusuário pela matrícula
   */
  getSuperusuario(matricula: string): Observable<Superusuario> {
    return this.http.get<Superusuario>(`${this.apiUrl}/${matricula}`);
  }

  /**
   * Lista todos os superusuários
   */
  listarSuperusuarios(): Observable<Superusuario[]> {
    return this.http.get<Superusuario[]>(this.apiUrl);
  }

  /**
   * Exclui um superusuário
   */
  excluirSuperusuario(matricula: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${matricula}`);
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
}