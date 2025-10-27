// src/app/pages/tabela-eventos/tabela-eventos.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Evento, StatusEvento } from '../../models/evento.model';
import { EventoService } from '../../servicos/evento-service';

@Component({
  selector: 'app-tabela-eventos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './tabela-eventos.html',
  styleUrls: ['./tabela-eventos.css']
})
export class TabelaEventos implements OnInit, OnDestroy {

  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  eventosSelecionados: Set<number> = new Set<number>();
  isLoading: boolean = true;
  isGerandoRelatorio: boolean = false;

  dataInicioFiltro: string | null = null;
  dataFimFiltro: string | null = null;
  tituloFiltro: string = '';
  descricaoFiltro: string = '';
  categoriaFiltro: string = '';

  mensagem: string = '';
  erro: string = '';
  filtroAtivo: boolean = false;

  StatusEvento = StatusEvento;

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
    this.eventosSelecionados.clear();
    this.eventoService.getAllEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.eventosFiltrados = [...this.eventos];
        this.isLoading = false;
        this.filtroAtivo = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar eventos:', error);
        this.erro = 'Erro ao carregar eventos. Tente novamente.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    this.erro = '';

    let eventosFiltrados = [...this.eventos];

    if (this.dataInicioFiltro || this.dataFimFiltro) {
      const inicio = this.dataInicioFiltro ? new Date(this.dataInicioFiltro) : null;
      const fim = this.dataFimFiltro ? new Date(this.dataFimFiltro) : null;

      if (fim) {
        fim.setHours(23, 59, 59, 999);
      }

      eventosFiltrados = eventosFiltrados.filter(evento => {
        const dataEvento = new Date(evento.dataHora);

        let passaInicio = true;
        let passaFim = true;

        if (inicio) {
          passaInicio = dataEvento >= inicio;
        }

        if (fim) {
          passaFim = dataEvento <= fim;
        }

        return passaInicio && passaFim;
      });
    }

    if (this.tituloFiltro.trim()) {
      const termoTitulo = this.tituloFiltro.toLowerCase().trim();
      eventosFiltrados = eventosFiltrados.filter(evento =>
        evento.titulo.toLowerCase().includes(termoTitulo)
      );
    }

    if (this.descricaoFiltro.trim()) {
      const termoDescricao = this.descricaoFiltro.toLowerCase().trim();
      eventosFiltrados = eventosFiltrados.filter(evento =>
        evento.descricao.toLowerCase().includes(termoDescricao)
      );
    }

    if (this.categoriaFiltro.trim()) {
      const termoCategoria = this.categoriaFiltro.toLowerCase().trim();
      eventosFiltrados = eventosFiltrados.filter(evento =>
        evento.categoria.toLowerCase().includes(termoCategoria)
      );
    }

    this.eventosFiltrados = eventosFiltrados;

    this.filtroAtivo = !!(this.dataInicioFiltro || this.dataFimFiltro ||
                          this.tituloFiltro.trim() || this.descricaoFiltro.trim() ||
                          this.categoriaFiltro.trim());
  }

  limparFiltros(): void {
    this.dataInicioFiltro = null;
    this.dataFimFiltro = null;
    this.tituloFiltro = '';
    this.descricaoFiltro = '';
    this.categoriaFiltro = '';
    this.eventosFiltrados = [...this.eventos];
    this.filtroAtivo = false;
    this.eventosSelecionados.clear();
    this.erro = '';
    this.mensagem = 'Filtros limpos. Mostrando todos os eventos.';
    setTimeout(() => this.mensagem = '', 3000);
  }

  toggleSelecaoEvento(eventoId: number): void {
    if (this.eventosSelecionados.has(eventoId)) {
      this.eventosSelecionados.delete(eventoId);
    } else {
      this.eventosSelecionados.add(eventoId);
    }
    this.cd.detectChanges();
  }

  estaSelecionado(eventoId: number | undefined): boolean {
    return eventoId ? this.eventosSelecionados.has(eventoId) : false;
  }

  selecionarTodos(event: any): void {
    const checked = event.target.checked;

    if (checked) {
      this.eventosFiltrados.forEach(evento => {
        if (evento.eventoId) {
          this.eventosSelecionados.add(evento.eventoId);
        }
      });
    } else {
      this.eventosSelecionados.clear();
    }
    this.cd.detectChanges();
  }

  estaTodosSelecionados(): boolean {
    if (this.eventosFiltrados.length === 0) return false;

    return this.eventosFiltrados.every(evento =>
      evento.eventoId && this.eventosSelecionados.has(evento.eventoId)
    );
  }

  editarEvento(evento: Evento): void {
    if (evento.eventoId) {
      this.router.navigate(['/editar-evento', evento.eventoId]);
    }
  }

  removerEvento(evento: Evento): void {
    if (confirm(`Tem certeza que deseja remover o evento "${evento.titulo}"?`)) {
      if (evento.eventoId) {
        this.eventoService.deleteEvento(evento.eventoId).subscribe({
          next: () => {
            this.eventos = this.eventos.filter(e => e.eventoId !== evento.eventoId);
            this.eventosFiltrados = [...this.eventos];
            if (evento.eventoId) {
              this.eventosSelecionados.delete(evento.eventoId);
            }
            this.mensagem = `Evento "${evento.titulo}" removido com sucesso.`;
            setTimeout(() => this.mensagem = '', 3000);
            this.cd.detectChanges();
          },
          error: (error) => {
            console.error('Erro ao remover evento:', error);
            this.erro = 'Erro ao remover evento.';
            setTimeout(() => this.erro = '', 5000);
          }
        });
      }
    }
  }

  encerrarEvento(evento: Evento): void {
    if (confirm(`Tem certeza que deseja encerrar o evento "${evento.titulo}"?`)) {
      if (evento.eventoId) {
        this.eventoService.encerrarEvento(evento.eventoId).subscribe({
          next: (mensagem) => {
            this.mensagem = mensagem;
            setTimeout(() => this.mensagem = '', 3000);
            this.carregarEventos();
          },
          error: (error) => {
            console.error('Erro ao encerrar evento:', error);
            this.erro = 'Erro ao encerrar evento.';
            setTimeout(() => this.erro = '', 5000);
          }
        });
      }
    }
  }

  cadastrarEvento(): void {
    this.router.navigate(['/cadastrar-evento']);
  }

  verDetalhesEvento(eventoId: number | undefined): void {
    if (eventoId) {
      this.router.navigate(['/detalhes-evento', eventoId]);
    }
  }

  formatarData(data: string | Date): string {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  }

  getStatusDescricao(status: StatusEvento | undefined): string {
    if (!status) return 'Não definido';

    switch (status) {
      case StatusEvento.AGENDADO: return 'Agendado';
      case StatusEvento.EM_ANDAMENTO: return 'Em Andamento';
      case StatusEvento.FINALIZADO: return 'Finalizado';
      case StatusEvento.CANCELADO: return 'Cancelado';
      default: return 'Não definido';
    }
  }

  abrirModalExportacao(): void {
    if (this.eventosSelecionados.size === 0) {
      this.erro = 'Selecione pelo menos um evento para exportar.';
      setTimeout(() => this.erro = '', 5000);
      return;
    }

    const modalElement = document.getElementById('modalExportacao');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  exportarJSON(): void {
    this.isGerandoRelatorio = true;

    const modalElement = document.getElementById('modalExportacao');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }

    const eventosParaExportar = this.eventos.filter(evento =>
      evento.eventoId && this.eventosSelecionados.has(evento.eventoId)
    );

    const dadosExportacao = {
      metadata: {
        geradoEm: new Date().toISOString(),
        totalEventos: eventosParaExportar.length,
        formato: 'JSON',
        versao: '1.0'
      },
      eventos: eventosParaExportar
    };

    setTimeout(() => {
      this.downloadJSON(dadosExportacao, 'relatorio-eventos.json');

      this.isGerandoRelatorio = false;
      this.mensagem = `Relatório JSON exportado com sucesso! ${eventosParaExportar.length} evento(s) exportado(s).`;

      this.eventosSelecionados.clear();

      setTimeout(() => this.mensagem = '', 5000);
      this.cd.detectChanges();
    }, 1000);
  }

  private downloadJSON(data: any, filename: string): void {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}