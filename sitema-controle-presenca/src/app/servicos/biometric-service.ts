// biometric.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface CaptureHashResponse {
  "fingers-registered": number;
  template: string;
  images?: string[];
  success: boolean;
  message?: string;
}

export interface CaptureForVerifyResponse {
  template: string;
  image?: string;
  success: boolean;
  message?: string;
}

export interface MatchOneOnOneResponse {
  message: string;
  image?: string;
  success: boolean;
}

export interface IdentificationResponse {
  message: string;
  id: number;
  success: boolean;
}

export interface LoadToMemoryResponse {
  message: string;
  success: boolean;
}

export interface DeleteAllFromMemoryResponse {
  message: string;
  success: boolean;
}

export interface TotalInMemoryResponse {
  total: number;
  success: boolean;
}

export interface DeviceUniqueIdResponse {
  serial: string;
  success: boolean;
}

export interface JoinTemplatesResponse {
  template: string;
  message: string;
  success: boolean;
}

export interface TemplateWithId {
  id: number;
  template: string;
}

export interface Template {
  template: string;
}

export interface ErrorResponse {
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BiometricService {
  private biometricApiUrl = environment.biometricApiUrl;
  private backendApiUrl = environment.backendApiUrl;

  constructor(private http: HttpClient) { }

  // ========== MÉTODOS DA API BIOMÉTRICA ==========

  // Captura hash biométrico para cadastro
  captureHash(includeImage: boolean = false): Observable<CaptureHashResponse> {
    return this.http.get<CaptureHashResponse>(
      `${this.biometricApiUrl}/capture-hash?img=${includeImage}`
    ).pipe(
      catchError(error => {
        return throwError(() => this.handleBiometricError(error));
      })
    );
  }

  // Captura para verificação
  captureForVerify(windowStyle: number = 0): Observable<CaptureForVerifyResponse> {
    return this.http.get<CaptureForVerifyResponse>(
      `${this.biometricApiUrl}/capture-for-verify?window=${windowStyle}`
    ).pipe(
      catchError(error => {
        return throwError(() => this.handleBiometricError(error));
      })
    );
  }

  // Comparação 1:1
  matchOneOnOne(template: string, includeImage: boolean = false): Observable<MatchOneOnOneResponse> {
    const body = { template };
    return this.http.post<MatchOneOnOneResponse>(
      `${this.biometricApiUrl}/match-one-on-one?img=${includeImage}`,
      body
    ).pipe(
      catchError(error => {
        return throwError(() => this.handleBiometricError(error));
      })
    );
  }

  // Identificação (1:N)
  identification(securityLevel: number = 5): Observable<IdentificationResponse> {
    return this.http.get<IdentificationResponse>(
      `${this.biometricApiUrl}/identification?secuLevel=${securityLevel}`
    ).pipe(
      catchError(error => {
        return throwError(() => this.handleBiometricError(error));
      })
    );
  }

  // Carregar templates na memória
  loadToMemory(templates: TemplateWithId[]): Observable<LoadToMemoryResponse> {
    return this.http.post<LoadToMemoryResponse>(
      `${this.biometricApiUrl}/load-to-memory`,
      templates
    ).pipe(
      catchError(error => {
        return throwError(() => this.handleBiometricError(error));
      })
    );
  }

  // Limpar todos os templates da memória
  deleteAllFromMemory(): Observable<DeleteAllFromMemoryResponse> {
    return this.http.get<DeleteAllFromMemoryResponse>(
      `${this.biometricApiUrl}/delete-all-from-memory`
    ).pipe(
      catchError(error => {
        return throwError(() => this.handleBiometricError(error));
      })
    );
  }

  // Total de templates na memória
  getTotalInMemory(): Observable<TotalInMemoryResponse> {
    return this.http.get<TotalInMemoryResponse>(
      `${this.biometricApiUrl}/total-in-memory`
    ).pipe(
      catchError(error => {
        return throwError(() => this.handleBiometricError(error));
      })
    );
  }

  // ID único do dispositivo
  getDeviceUniqueId(): Observable<DeviceUniqueIdResponse> {
    return this.http.get<DeviceUniqueIdResponse>(
      `${this.biometricApiUrl}/device-unique-id`
    ).pipe(
      catchError(error => {
        return throwError(() => this.handleBiometricError(error));
      })
    );
  }

  // Juntar templates
  joinTemplates(templates: Template[]): Observable<JoinTemplatesResponse> {
    return this.http.post<JoinTemplatesResponse>(
      `${this.biometricApiUrl}/join-templates`,
      templates
    ).pipe(
      catchError(error => {
        return throwError(() => this.handleBiometricError(error));
      })
    );
  }

  // ========== MÉTODOS DE INTEGRAÇÃO COM BACKEND ==========

  // a) Cadastrar novo usuário
  cadastrarUsuario(usuarioData: {
    cpf: string;
    nome: string;
    matricula: string;
    setor: string;
    template: string;
  }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.post<any>(
      `${this.backendApiUrl}/usuarios`,
      usuarioData,
      { headers }
    ).pipe(
      catchError(error => {
        return throwError(() => this.handleBackendError(error));
      })
    );
  }

  // b) Comparar digital para check-in biométrico
  compararDigitalCheckin(template: string, eventoId: number): Observable<any> {
    const checkinRequest = {
      template: template,
      eventoId: eventoId
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.post<any>(
      `${this.backendApiUrl}/checkin/biometrico`,
      checkinRequest,
      { headers }
    ).pipe(
      catchError(error => {
        return throwError(() => this.handleBackendError(error));
      })
    );
  }

  // Método completo para cadastro de usuário com captura biométrica
  cadastrarUsuarioComBiometria(usuarioData: {
    cpf: string;
    nome: string;
    matricula: string;
    setor: string;
  }): Observable<any> {
    return new Observable(observer => {
      // Primeiro, captura a biometria
      this.captureHash(false).subscribe({
        next: (biometricResponse) => {
          if (biometricResponse.success) {
            // Se a captura foi bem-sucedida, cadastra o usuário
            const usuarioCompleto = {
              ...usuarioData,
              template: biometricResponse.template
            };

            this.cadastrarUsuario(usuarioCompleto).subscribe({
              next: (usuarioResponse) => {
                observer.next(usuarioResponse);
                observer.complete();
              },
              error: (error) => {
                observer.error(error);
              }
            });
          } else {
            // Usa a mensagem se disponível, caso contrário uma mensagem padrão
            const errorMessage = biometricResponse.message || 'Falha na captura biométrica';
            observer.error(new Error(errorMessage));
          }
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  // Método completo para check-in biométrico
  realizarCheckInBiometrico(eventoId: number): Observable<any> {
    return new Observable(observer => {
      // Captura a biometria para verificação
      this.captureForVerify(0).subscribe({
        next: (biometricResponse) => {
          if (biometricResponse.success) {
            // Compara com o backend
            this.compararDigitalCheckin(biometricResponse.template, eventoId).subscribe({
              next: (checkinResponse) => {
                observer.next(checkinResponse);
                observer.complete();
              },
              error: (error) => {
                observer.error(error);
              }
            });
          } else {
            // Usa a mensagem se disponível, caso contrário uma mensagem padrão
            const errorMessage = biometricResponse.message || 'Falha na captura biométrica';
            observer.error(new Error(errorMessage));
          }
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  // ========== TRATAMENTO DE ERROS ==========

  private handleBiometricError(error: any): Error {
    if (error.error && error.error.message) {
      return new Error(error.error.message);
    } else if (error.message) {
      return new Error(error.message);
    } else {
      return new Error('Erro desconhecido na comunicação com o dispositivo biométrico');
    }
  }

  private handleBackendError(error: any): Error {
    if (error.error && typeof error.error === 'string') {
      return new Error(error.error);
    } else if (error.error && error.error.message) {
      return new Error(error.error.message);
    } else if (error.message) {
      return new Error(error.message);
    } else {
      return new Error('Erro desconhecido na comunicação com o servidor');
    }
  }
}