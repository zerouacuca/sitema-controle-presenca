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

  // GET - mantém como JSON
  getAllEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.backendApiUrl);
  }

  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.backendApiUrl}/${id}`);
  }

  getMeusEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.backendApiUrl);
  }

  // POST/PUT/DELETE/PATCH - todos retornam string
  createEvento(evento: any): Observable<string> {
    return this.http.post(this.backendApiUrl, evento, { 
      responseType: 'text'
    });
  }

  updateEvento(id: number, evento: any): Observable<string> {
    return this.http.put(`${this.backendApiUrl}/${id}`, evento, { 
      responseType: 'text'
    });
  }

  deleteEvento(id: number): Observable<string> {
    return this.http.delete(`${this.backendApiUrl}/${id}`, { 
      responseType: 'text'
    });
  }

  encerrarEvento(eventoId: number): Observable<string> {
    return this.http.post(`${this.backendApiUrl}/${eventoId}/encerrar`, {}, { 
      responseType: 'text'
    });
  }

  cancelarEvento(eventoId: number): Observable<string> {
    return this.http.post(`${this.backendApiUrl}/${eventoId}/cancelar`, {}, { 
      responseType: 'text'
    });
  }

  atualizarStatus(eventoId: number, status: StatusEvento): Observable<string> {
    const params = new HttpParams().set('status', status);
    return this.http.patch(`${this.backendApiUrl}/${eventoId}/status`, null, { 
      params,
      responseType: 'text'
    });
  }
}