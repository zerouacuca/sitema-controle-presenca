// src/app/models/checkin.model.ts
import { Evento } from './evento.model';
import { Usuario } from './usuario.model';

export enum StatusCheckIn {
  PRESENTE = 'PRESENTE',
  AUSENTE = 'AUSENTE', 
  PENDENTE = 'PENDENTE',
  CANCELADO = 'CANCELADO'
}

export interface CheckIn {
  id?: number;
  eventoId: number;
  eventoTitulo: string;
  usuarioCpf: string;
  usuarioNome: string;
  dataHoraCheckin: Date | string;
  status: StatusCheckIn;
}