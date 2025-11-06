import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; // <-- FIX: Imported required RxJS operators
import { environment } from '../environments/environment';
import { Usuario, UsuarioListDTO, UsuarioTemplateDTO } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private backendApiUrl = `${environment.backendApiUrl}/admin/usuarios`;

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

  cadastrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.backendApiUrl, usuario);
  }

  buscarTodosUsuarios(): Observable<UsuarioListDTO[]> {
    return this.http.get<UsuarioListDTO[]>(this.backendApiUrl);
  }

  buscarTodosTemplates(): Observable<UsuarioTemplateDTO[]> {
    return this.http.get<UsuarioTemplateDTO[]>(`${this.backendApiUrl}/templates`);
  }

  buscarPorMatricula(matricula: string): Observable<Usuario> {
    const url = `${this.backendApiUrl}/${matricula}`;
    console.log('URL da requisição:', url);

    // FIX: map and catchError imported, response/error parameters explicitly typed
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((response: string) => {
        console.log('Resposta bruta do servidor:', response);

        // Se a resposta estiver vazia
        if (!response) {
          throw new Error('Resposta vazia do servidor');
        }

        try {
          // Tenta fazer parse da resposta como JSON
          const data = JSON.parse(response);
          console.log('JSON parseado com sucesso:', data);
          return data;
        } catch (e) {
          console.error('Erro ao fazer parse do JSON:', e);
          console.log('Conteúdo que falhou no parse:', response);
          // Throwing an error in map() is acceptable, as it's caught by catchError
          throw new Error('Resposta não é um JSON válido');
        }
      }),
      catchError((error: any) => {
        console.error('Erro na requisição:', error);
        // Using throwError() from rxjs to return an Observable error stream
        return throwError(() => error);
      })
    );
  }

  atualizarUsuario(matricula: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.backendApiUrl}/${matricula}`, usuario);
  }

  deletarUsuario(matricula: string): Observable<void> {
    return this.http.delete<void>(`${this.backendApiUrl}/${matricula}`);
  }

  validarBiometria(template: Uint8Array): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.backendApiUrl}/validar-biometria`, template);
  }
}