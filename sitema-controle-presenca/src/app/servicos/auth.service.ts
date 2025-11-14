import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Login, AuthResponse } from '../models/login.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.backendApiUrl}/auth`;
  private tokenKey = 'auth_token';
  private currentUserSubject = new BehaviorSubject<string | null>(this.getCurrentUserEmail());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(login: Login): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, login)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.email);
        })
      );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  
  logout(): void {
    // Remove o token do localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentUser');
    
    // Atualiza o BehaviorSubject
    this.currentUserSubject.next(null);
    
  }

  getCurrentUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub; // O email está no subject do token
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  // Método para criar admin (útil para desenvolvimento)
  setupAdmin(): Observable<any> {
    return this.http.get(`${this.apiUrl}/setup-admin`);
  }
}