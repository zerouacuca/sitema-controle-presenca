import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { Evento } from '../../models/evento.model';
import { EventoService } from '../../servicos/evento-service';
import { Navbar } from '../../componentes/navbar/navbar';

@Component({
  selector: 'app-tabela-eventos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, Navbar, FormsModule],
  templateUrl: './tabela-eventos.html',
  styleUrls: ['./tabela-eventos.css']
})
export class TabelaEventos implements OnInit, OnDestroy {

  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  isLoading: boolean = true;
  dataInicioFiltro: string | null = null;
  dataFimFiltro: string | null = null;
  
  private routerSubscription!: Subscription;

  constructor(
    private eventoService: EventoService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregarEventos();

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Recarrega os eventos quando navegar de volta para esta página
      if (event.url === '/tabela-eventos' || event.url === '/') {
        this.carregarEventos();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  carregarEventos(): void {
    this.isLoading = true;
    this.eventoService.getAllEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.eventosFiltrados = [...this.eventos];
        this.isLoading = false;
        this.cd.detectChanges(); // Força o Angular a atualizar o template
      },
      error: (error) => {
        console.error('Erro ao carregar eventos:', error);
        this.isLoading = false;
        this.cd.detectChanges(); // Força a atualização mesmo em caso de erro
      }
    });
  }

  filtrarEventos(): void {
    if (!this.dataInicioFiltro && !this.dataFimFiltro) {
      this.eventosFiltrados = [...this.eventos];
      return;
    }

    const inicio = this.dataInicioFiltro ? new Date(this.dataInicioFiltro) : new Date('1970-01-01');
    const fim = this.dataFimFiltro ? new Date(this.dataFimFiltro) : new Date('9999-12-31');
    fim.setHours(23, 59, 59, 999);

    const diffMs = fim.getTime() - inicio.getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    if (diffDias > 30) {
      alert('O intervalo máximo permitido para o filtro é de 30 dias.');
      return;
    }

    this.eventosFiltrados = this.eventos.filter(evento => {
      const dataEvento = new Date(evento.dataHora);
      return dataEvento >= inicio && dataEvento <= fim;
    });
  }

  editarEvento(evento: Evento): void {
    this.router.navigate(['/editar-evento', evento.eventoId]);
  }

  removerEvento(evento: Evento): void {
    if (confirm(`Tem certeza que deseja remover o evento "${evento.titulo}"?`)) {
      if (evento.eventoId) {
        this.eventoService.deleteEvento(evento.eventoId).subscribe({
          next: () => {
            this.eventos = this.eventos.filter(e => e.eventoId !== evento.eventoId);
            this.eventosFiltrados = [...this.eventos];
            this.cd.detectChanges();
          },
          error: (error) => {
            console.error('Erro ao remover evento:', error);
            alert('Erro ao remover evento.');
          }
        });
      }
    }
  }

  baixarRelatorio(evento: Evento): void {
    console.log('Baixar relatório:', evento);
    // Implementar lógica de download de relatório
  }

  encerrarEvento(evento: Evento): void {
    if (evento.eventoId) {
      this.eventoService.encerrarEvento(evento.eventoId).subscribe({
        next: (mensagem) => {
          alert(mensagem);
          this.carregarEventos(); // Recarrega os eventos para atualizar o status
        },
        error: (error) => {
          console.error('Erro ao encerrar evento:', error);
          alert('Erro ao encerrar evento.');
        }
      });
    }
  }

  cadastrarEvento(): void {
    this.router.navigate(['/cadastrar-evento']);
  }

  formatarData(data: string | Date): string {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  }

  getStatusClass(status: string | undefined): string {
    switch (status?.toLowerCase()) {
      case 'em andamento':
        return 'status-andamento';
      case 'finalizada':
        return 'status-finalizada';
      case 'cancelada':
        return 'status-cancelada';
      case 'agendado':
        return 'status-agendado';
      default:
        return 'status-padrao';
    }
  }
}