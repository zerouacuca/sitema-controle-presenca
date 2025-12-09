import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecuperacaoSenhaService {
  private apiUrl = `${environment.backendApiUrl}/auth`;

  constructor(private http: HttpClient) { }

  solicitarRecuperacao(data: { email: string }): Observable<any> {
  const url = `${this.apiUrl}/auth/recuperar-senha`;
  
  console.log('Enviando requisição para:', url);
  console.log('Dados:', data);

  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  //return this.http.post(`${this.apiUrl}/recuperar-senha`, data);
  return this.http.post(`${this.apiUrl}/recuperar-senha`, data, { 
    headers: headers,
    responseType: 'text'
  });
}

  redefinirSenha(data: { token: string, novaSenha: string, confirmacaoSenha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/redefinir-senha`, data);
  }
}