// src/app/models/evento.model.ts
export enum StatusEvento {
  AGENDADO = 'AGENDADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO'
}

export interface Evento {
  eventoId?: number;
  titulo: string;
  descricao: string;
  dataHora: Date | string;
  cargaHoraria: number;
  categoria: string;
  status?: StatusEvento;
}