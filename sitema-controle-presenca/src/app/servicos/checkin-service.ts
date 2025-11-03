import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { CheckIn } from '../models/checkin.model';
import { StatusCheckIn } from '../models/checkin.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {
  private apiUrl = `${environment.backendApiUrl}/checkin`;

  constructor(private http: HttpClient) { }

  getCheckInsPorEvento(eventoId: number): Observable<CheckIn[]> {
    return this.http.get<CheckIn[]>(`${this.apiUrl}/evento/${eventoId}`).pipe(
        catchError(error => {
        console.error('Erro ao buscar check-ins, retornando array vazio:', error);
        return of([]);
        })
    );
  }

  registrarCheckIn(matricula: string, eventoId: number): Observable<string> {
    const body = {
      matricula: matricula,
      eventoId: eventoId
    };
    return this.http.post(`${this.apiUrl}/registrar`, body, { responseType: 'text' });
  }

  atualizarStatusCheckIn(checkInId: number, status: StatusCheckIn): Observable<CheckIn> {
    return this.http.patch<CheckIn>(`${this.apiUrl}/${checkInId}/status`, { status });
  }
}
