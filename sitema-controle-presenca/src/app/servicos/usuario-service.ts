import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  // CREATE: Cadastrar um novo usuário
  cadastrarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  // READ: Buscar todos os usuários
  buscarTodosUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // READ: Buscar um usuário por CPF
  buscarPorCpf(cpf: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${cpf}`);
  }

  // UPDATE: Atualizar um usuário existente
  atualizarUsuario(cpf: string, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${cpf}`, usuario);
  }

  // DELETE: Deletar um usuário por CPF
  deletarUsuario(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cpf}`);
  }

  // Validação de biometria
  validarBiometria(biometriaHash: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validar-biometria`, biometriaHash);
  }
}