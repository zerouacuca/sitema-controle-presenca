// src/app/services/certificado.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certificado } from '../models/certificado.model';
import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CertificadoService {
  private backendApiUrl = `${environment.backendApiUrl}/certificados`;

  constructor(private http: HttpClient) { }

  getAllCertificados(): Observable<Certificado[]> {
    return this.http.get<Certificado[]>(this.backendApiUrl);
  }

  getCertificadosPorUsuario(cpf: string): Observable<Certificado[]> {
    return this.http.get<Certificado[]>(`${this.backendApiUrl}/usuario/${cpf}`);
  }

  getCertificadosPorEvento(eventoId: number): Observable<Certificado[]> {
    return this.http.get<Certificado[]>(`${this.backendApiUrl}/evento/${eventoId}`);
  }

  downloadCertificadoPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.backendApiUrl}/${id}/pdf`, { responseType: 'blob' });
  }

  downloadCertificadosEventoPdf(eventoId: number): Observable<Blob> {
    return this.http.get(`${this.backendApiUrl}/evento/${eventoId}/pdf-all`, { responseType: 'blob' });
  }

  enviarCertificadosPorEmail(certificadoIds: number[], email: string): Observable<any> {
    return this.http.post(`${this.backendApiUrl}/enviar-email`, {
      certificadoIds,
      email
    });
  }
}