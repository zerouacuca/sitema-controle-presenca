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
  private apiUrl = `${environment.apiUrl}/certificados`;

  constructor(private http: HttpClient) { }

  getAllCertificados(): Observable<Certificado[]> {
    return this.http.get<Certificado[]>(this.apiUrl);
  }

  getCertificadosPorUsuario(cpf: string): Observable<Certificado[]> {
    return this.http.get<Certificado[]>(`${this.apiUrl}/usuario/${cpf}`);
  }

  getCertificadosPorEvento(eventoId: number): Observable<Certificado[]> {
    return this.http.get<Certificado[]>(`${this.apiUrl}/evento/${eventoId}`);
  }

  downloadCertificadoPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }

  downloadCertificadosEventoPdf(eventoId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/evento/${eventoId}/pdf-all`, { responseType: 'blob' });
  }

  enviarCertificadosPorEmail(certificadoIds: number[], email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviar-email`, {
      certificadoIds,
      email
    });
  }
}