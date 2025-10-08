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
  
  // Novas propriedades para mensagens e controle de filtros
  mensagem: string = '';
  erro: string = '';
  filtroAtivo: boolean = false;

  // Disponibilize o enum para o template
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
    this.eventosSelecionados.clear(); // Limpa seleção ao recarregar
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

  // === SELEÇÃO DE EVENTOS ===

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
      // Seleciona todos os eventos visíveis
      this.eventosFiltrados.forEach(evento => {
        if (evento.eventoId) {
          this.eventosSelecionados.add(evento.eventoId);
        }
      });
    } else {
      // Remove todos os eventos da seleção
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

  // === RELATÓRIOS MÚLTIPLOS ===

  gerarRelatorioMultiplo(): void {
    if (this.eventosSelecionados.size === 0) {
      this.erro = 'Selecione pelo menos um evento para gerar o relatório.';
      setTimeout(() => this.erro = '', 5000);
      return;
    }

    this.isGerandoRelatorio = true;
    const eventosIds = Array.from(this.eventosSelecionados);
    
    // TODO: Implementar chamada real para o serviço de relatórios
    console.log('Gerando relatório para eventos:', eventosIds);
    
    // Simulação de geração de relatório
    setTimeout(() => {
      this.isGerandoRelatorio = false;
      const quantidade = this.eventosSelecionados.size;
      this.mensagem = `Relatório gerado com sucesso para ${quantidade} evento(s)!`;
      
      // Limpa seleção após gerar relatório
      this.eventosSelecionados.clear();
      
      setTimeout(() => this.mensagem = '', 5000);
      this.cd.detectChanges();
    }, 2000);
  }

  // === FILTROS ===

  filtrarEventos(): void {
    if (!this.dataInicioFiltro && !this.dataFimFiltro) {
      this.eventosFiltrados = [...this.eventos];
      this.filtroAtivo = false;
      this.mensagem = 'Filtro removido. Mostrando todos os eventos.';
      setTimeout(() => this.mensagem = '', 3000);
      return;
    }

    const inicio = this.dataInicioFiltro ? new Date(this.dataInicioFiltro) : new Date('1970-01-01');
    const fim = this.dataFimFiltro ? new Date(this.dataFimFiltro) : new Date('9999-12-31');
    fim.setHours(23, 59, 59, 999);

    const diffMs = fim.getTime() - inicio.getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    if (diffDias > 30) {
      this.erro = 'O intervalo máximo permitido para o filtro é de 30 dias.';
      setTimeout(() => this.erro = '', 5000);
      return;
    }

    this.eventosFiltrados = this.eventos.filter(evento => {
      const dataEvento = new Date(evento.dataHora);
      return dataEvento >= inicio && dataEvento <= fim;
    });

    this.filtroAtivo = true;
    this.mensagem = `Filtro aplicado. ${this.eventosFiltrados.length} evento(s) encontrado(s).`;
    setTimeout(() => this.mensagem = '', 3000);
  }

  limparFiltros(): void {
    this.dataInicioFiltro = null;
    this.dataFimFiltro = null;
    this.eventosFiltrados = [...this.eventos];
    this.filtroAtivo = false;
    this.eventosSelecionados.clear(); // Limpa seleção ao limpar filtros
    this.mensagem = 'Filtros limpos. Mostrando todos os eventos.';
    setTimeout(() => this.mensagem = '', 3000);
  }

  // === AÇÕES INDIVIDUAIS ===

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
            // Remove da seleção se estava selecionado
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

  baixarRelatorio(evento: Evento): void {
    console.log('Baixar relatório individual:', evento);
    // TODO: Implementar download do relatório individual
    this.mensagem = `Relatório do evento "${evento.titulo}" será baixado em breve.`;
    setTimeout(() => this.mensagem = '', 3000);
  }

  encerrarEvento(evento: Evento): void {
    if (confirm(`Tem certeza que deseja encerrar o evento "${evento.titulo}"?`)) {
      if (evento.eventoId) {
        this.eventoService.encerrarEvento(evento.eventoId).subscribe({
          next: (mensagem) => {
            this.mensagem = mensagem;
            setTimeout(() => this.mensagem = '', 3000);
            this.carregarEventos(); // Recarrega os eventos para atualizar o status
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

  // Método para obter a descrição do status
  getStatusDescricao(status: StatusEvento | undefined): string {
    if (!status) return 'Não definido';

    switch (status) {
      case StatusEvento.AGENDADO: return 'Agendado';
      case StatusEvento.EM_ANDAMENTO: return 'Em Andamento';
      case StatusEvento.FINALIZADO: return 'Finalizado';
      case StatusEvento.CANCELADO: return 'Cancelado';
      case StatusEvento.PAUSADO: return 'Pausado';
      default: return 'Não definido';
    }
  }

  // Método para obter a classe CSS baseada no status
  getStatusClass(status: StatusEvento | undefined): string {
    if (!status) return 'status-padrao';

    switch (status) {
      case StatusEvento.EM_ANDAMENTO: return 'status-andamento';
      case StatusEvento.FINALIZADO: return 'status-finalizada';
      case StatusEvento.CANCELADO: return 'status-cancelada';
      case StatusEvento.AGENDADO: return 'status-agendado';
      case StatusEvento.PAUSADO: return 'status-pausado';
      default: return 'status-padrao';
    }
  }

  // === MODAL E EXPORTAÇÃO ===

  abrirModalExportacao(): void {
    if (this.eventosSelecionados.size === 0) {
      this.erro = 'Selecione pelo menos um evento para exportar.';
      setTimeout(() => this.erro = '', 5000);
      return;
    }

    // Abre o modal usando Bootstrap JavaScript
    const modalElement = document.getElementById('modalExportacao');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  exportarJSON(): void {
    this.isGerandoRelatorio = true;
    
    // Fecha o modal
    const modalElement = document.getElementById('modalExportacao');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }

    // Obtém os eventos selecionados
    const eventosParaExportar = this.eventos.filter(evento => 
      evento.eventoId && this.eventosSelecionados.has(evento.eventoId)
    );

    // Cria o objeto de exportação
    const dadosExportacao = {
      metadata: {
        geradoEm: new Date().toISOString(),
        totalEventos: eventosParaExportar.length,
        formato: 'JSON',
        versao: '1.0'
      },
      eventos: eventosParaExportar
    };

    // Simulação de processamento
    setTimeout(() => {
      // Cria e dispara o download do arquivo JSON
      this.downloadJSON(dadosExportacao, 'relatorio-eventos.json');
      
      this.isGerandoRelatorio = false;
      this.mensagem = `Relatório JSON exportado com sucesso! ${eventosParaExportar.length} evento(s) exportado(s).`;
      
      // Limpa seleção após exportar
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