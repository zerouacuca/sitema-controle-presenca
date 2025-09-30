import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';
import { environment } from '../environments/environment';
import { StatusEvento } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private backendApiUrl = `${environment.backendApiUrl}/admin/eventos`;

  constructor(private http: HttpClient) { }

  getAllEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.backendApiUrl);
  }

  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.backendApiUrl}/${id}`);
  }

  createEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.backendApiUrl, evento);
  }

  updateEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.backendApiUrl}/${id}`, evento);
  }

  deleteEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.backendApiUrl}/${id}`);
  }

  encerrarEvento(eventoId: number): Observable<string> {
    return this.http.post<string>(`${this.backendApiUrl}/${eventoId}/encerrar`, {});
  }

  atualizarStatus(eventoId: number, status: StatusEvento): Observable<void> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<void>(`${this.backendApiUrl}/${eventoId}/status`, null, { params });
  }

  cancelarEvento(eventoId: number): Observable<string> {
    return this.http.post<string>(`${this.backendApiUrl}/${eventoId}/cancelar`, {});
  }

  // Método para buscar eventos por superusuário (já é automático pelo token)
  getMeusEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.backendApiUrl);
  }
}