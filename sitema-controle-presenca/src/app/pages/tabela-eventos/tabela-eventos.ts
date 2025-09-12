import { Component } from '@angular/core'; //Define a clase como componente Angular.
import { CommonModule } from '@angular/common'; // Importa diretivas e pipes como *ngIf, *ngFor.
import { FormsModule } from '@angular/forms'; // Habilita o uso de formulários baseados em template, incluindo [(ngModel)] para two-way binding
import { Evento } from '../../models/evento.model';

@Component({
  selector: 'app-tabela-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tabela-eventos.html',
  styleUrl: './tabela-eventos.css'
})
export class TabelaEventos {

//Teste de eventos
eventos = [
    { id: '00007', data: '21/02/2025', descricao: 'Treinamento Primeiros Socorros', status: 'em andamento' },
    { id: '00006', data: '20/02/2025', descricao: 'Reunião de CIPA', status: 'finalizada' },
    { id: '00005', data: '10/02/2025', descricao: 'Treinamento de Combate a Incêndio e Uso de Extintores', status: 'finalizada' },
    { id: '00004', data: '08/02/2025', descricao: 'Reunião de Diálogo Diário de Segurança', status: 'cancelada' }
  ];

  cadastrarEvento(evento: any) {
    console.log('Cadastrar:', evento);
  }

  editarEvento(evento: any) {
    console.log('Editar:', evento);
  }

  removerEvento(evento: any) {
    console.log('Remover:', evento);
  }

  baixarRelatorio(evento: any) {
    console.log('Baixar relatório:', evento);
  }

dataInicioFiltro: string | null = null;
dataFimFiltro: string | null = null;
eventosFiltrados = [...this.eventos];

filtrarEventos() {
  if (!this.dataInicioFiltro && !this.dataFimFiltro) {
    this.eventosFiltrados = [...this.eventos];
    return;
  }

  const inicio = this.dataInicioFiltro ? new Date(this.dataInicioFiltro) : new Date('1970-01-01');
  const fim = this.dataFimFiltro ? new Date(this.dataFimFiltro) : new Date('9999-12-31');

  // Ajusta para o final do dia para incluir todos os eventos do dia final
  fim.setHours(23, 59, 59, 999);

  // Calcula a diferença em milissegundos
  const diffMs = fim.getTime() - inicio.getTime();
  const diffDias = diffMs / (1000 * 60 * 60 * 24);

  if (diffDias > 30) {
    alert('O intervalo máximo permitido para o filtro é de 30 dias.');
    return;
  }

  this.eventosFiltrados = this.eventos.filter(evento => {
    const dataEvento = new Date(evento.data);
    return dataEvento >= inicio && dataEvento <= fim;
  });
}

}

