export enum StatusEvento {
  AGENDADO = 'AGENDADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO', 
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO',
  PAUSADO = 'PAUSADO'
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