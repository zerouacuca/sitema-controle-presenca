import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  public stringToBase64(str: string): string {
    return btoa(unescape(encodeURIComponent(str)));
  }

  public base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // CREATE: Cadastrar um novo usuário
  cadastrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  // READ: Buscar todos os usuários
  buscarTodosUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // READ: Buscar um usuário por CPF
  buscarPorCpf(cpf: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${cpf}`);
  }

  // UPDATE: Atualizar um usuário existente
  atualizarUsuario(cpf: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${cpf}`, usuario);
  }

  // DELETE: Deletar um usuário por CPF
  deletarUsuario(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cpf}`);
  }

  // Validação de biometria
  validarBiometria(biometriaHash: Uint8Array): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/validar-biometria`, biometriaHash);
  }
}