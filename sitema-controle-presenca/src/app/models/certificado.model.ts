export interface Certificado {
  id: number;
  nomeUsuario: string;
  matriculaUsuario: string;
  nomeSuperusuario: string;
  codigoValidacao: string;
  dataEmissao: string;
  texto: string;
  eventoId: number;
  eventoTitulo: string;
  eventoCargaHoraria: number;
  selected: boolean;
}