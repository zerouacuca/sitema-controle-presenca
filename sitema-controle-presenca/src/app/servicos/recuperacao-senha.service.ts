import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecuperacaoSenhaService {
  private apiUrl = `${environment.backendApiUrl}/auth`;

  constructor(private http: HttpClient) { }

  solicitarRecuperacao(data: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar-senha`, data);
  }

  redefinirSenha(data: { token: string, novaSenha: string, confirmacaoSenha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/redefinir-senha`, data);
  }
}