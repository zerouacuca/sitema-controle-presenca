import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private backendApiUrl = `${environment.backendApiUrl}/eventos`;

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
}