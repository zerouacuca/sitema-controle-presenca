// src/app/pages/detalhes-evento/detalhes-evento.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Evento, StatusEvento } from '../../models/evento.model';
import { CheckIn } from '../../models/checkin.model';
import { EventoService } from '../../servicos/evento-service';
import { CheckInService } from '../../servicos/checkin-service';
import { BiometricService } from '../../servicos/biometric-service';

@Component({
  selector: 'app-detalhes-evento',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './detalhes-evento.component.html',
  styleUrls: ['./detalhes-evento.component.css']
})
export class DetalhesEventoComponent implements OnInit {

  evento: Evento | null = null;
  checkIns: CheckIn[] = [];
  isLoading: boolean = true;
  isLoadingAction: boolean = false;
  isCapturingBiometry: boolean = false;
  actionMessage: string = '';
  biometryError: string = '';

  statusEvento = StatusEvento;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private checkInService: CheckInService,
    private biometricService: BiometricService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregarDetalhesEvento();
  }

  carregarDetalhesEvento(): void {
    const eventoId = this.route.snapshot.paramMap.get('id');

    if (!eventoId) {
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }

    this.isLoading = true;
    this.cd.detectChanges();

    this.eventoService.getEventoById(Number(eventoId)).subscribe({
      next: (evento) => {
        this.evento = evento;
        this.carregarCheckIns(evento.eventoId!);
      },
      error: (error: any) => {
        console.error('Erro ao carregar evento:', error);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  carregarCheckIns(eventoId: number): void {
    this.checkInService.getCheckInsPorEvento(eventoId).subscribe({
      next: (checkIns: CheckIn[]) => {
        this.checkIns = checkIns;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error('Erro ao carregar check-ins:', error);
        this.checkIns = [];
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  iniciarEvento(): void {
    if (this.evento?.eventoId && confirm('Iniciar este evento?')) {
      this.isLoadingAction = true;
      this.actionMessage = 'Iniciando evento...';

      this.eventoService.atualizarStatus(this.evento.eventoId, StatusEvento.EM_ANDAMENTO).subscribe({
        next: () => {
          this.actionMessage = 'Evento iniciado com sucesso!';
          this.carregarDetalhesEvento();
        },
        error: (error: any) => {
          console.error('Erro ao iniciar evento:', error);
          this.actionMessage = 'Erro ao iniciar evento.';
          this.isLoadingAction = false;
          this.cd.detectChanges();
        }
      });
    }
  }

  encerrarEvento(): void {
    if (this.evento?.eventoId && confirm('Encerrar este evento?')) {
      this.isLoadingAction = true;
      this.actionMessage = 'Encerrando evento e gerando certificados...';

      this.eventoService.encerrarEvento(this.evento.eventoId).subscribe({
        next: (mensagem: string) => {
          this.actionMessage = mensagem;
          this.carregarDetalhesEvento();
          this.isLoadingAction = false;
          this.cd.detectChanges();
        },
        error: (error: any) => {
          console.error('Erro ao encerrar evento:', error);
          this.actionMessage = 'Erro ao encerrar evento.';
          this.isLoadingAction = false;
          this.cd.detectChanges();
        }
      });
    }
  }

  cancelarEvento(): void {
    if (this.evento?.eventoId && confirm('Cancelar este evento?')) {
      this.isLoadingAction = true;
      this.actionMessage = 'Cancelando evento...';

      this.eventoService.cancelarEvento(this.evento.eventoId).subscribe({
        next: () => {
          this.actionMessage = 'Evento cancelado com sucesso!';
          this.carregarDetalhesEvento();
          this.isLoadingAction = false;
          this.cd.detectChanges();
        },
        error: (error: any) => {
          console.error('Erro ao cancelar evento:', error);
          this.actionMessage = 'Erro ao cancelar evento.';
          this.isLoadingAction = false;
          this.cd.detectChanges();
        }
      });
    }
  }

  realizarCheckInBiometrico(): void {
    if (!this.evento?.eventoId) return;

    this.isCapturingBiometry = true;
    this.biometryError = '';
    this.actionMessage = 'Aguardando leitura biométrica...';
    this.cd.detectChanges();

    this.biometricService.realizarCheckInBiometrico(this.evento.eventoId).subscribe({
      next: (response: any) => {
        this.isCapturingBiometry = false;

        if (response.success) {
          this.actionMessage = 'Check-in realizado com sucesso!';
          this.carregarCheckIns(this.evento!.eventoId!);
        } else {
          this.biometryError = response.message || 'Digital não reconhecida';
          this.actionMessage = '';
        }
        this.cd.detectChanges();
      },
      error: (error: any) => {
        this.isCapturingBiometry = false;
        this.biometryError = this.getErrorMessage(error);
        this.actionMessage = '';
        this.cd.detectChanges();
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    } else {
      return 'Erro desconhecido na captura biométrica';
    }
  }

  voltarParaLista(): void {
    this.router.navigate(['/eventos']);
  }

  editarEvento(): void {
    if (this.evento?.eventoId) {
      this.router.navigate(['/editar-evento', this.evento.eventoId]);
    }
  }

  formatarDataHora(data: string | Date): string {
    if (!data) return 'Data inválida';
    const date = new Date(data);
    return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleString('pt-BR');
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

  getStatusBadgeClass(status: StatusEvento | undefined): string {
    if (!status) return 'bg-secondary';
    switch (status) {
      case StatusEvento.AGENDADO: return 'bg-info';
      case StatusEvento.EM_ANDAMENTO: return 'bg-warning';
      case StatusEvento.FINALIZADO: return 'bg-success';
      case StatusEvento.CANCELADO: return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  abrirModalExportacao(): void {
    if (!this.evento) return;

    const modalElement = document.getElementById('modalExportacaoDetalhes');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  exportarJSON(): void {
    if (!this.evento) return;

    this.isLoadingAction = true;

    const modalElement = document.getElementById('modalExportacaoDetalhes');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }

    const dadosExportacao = {
      metadata: {
        geradoEm: new Date().toISOString(),
        eventoId: this.evento.eventoId,
        formato: 'JSON',
        versao: '1.0'
      },
      evento: {
        ...this.evento,
        statusDescricao: this.getStatusDescricao(this.evento.status)
      },
      checkIns: this.checkIns.map(checkIn => ({
        ...checkIn,
        dataHoraFormatada: this.formatarDataHora(checkIn.dataHoraCheckin)
      })),
      resumo: {
        totalCheckIns: this.checkIns.length,
        cargaHoraria: this.evento.cargaHoraria,
        dataEvento: this.formatarDataHora(this.evento.dataHora)
      }
    };

    setTimeout(() => {
      const eventoId = this.evento?.eventoId || 'unknown';
      const eventoTitulo = this.evento?.titulo || 'Evento';
      this.downloadJSON(dadosExportacao, `evento-${eventoId}-relatorio.json`);

      this.isLoadingAction = false;
      this.actionMessage = `Relatório do evento "${eventoTitulo}" exportado com sucesso!`;

      setTimeout(() => this.actionMessage = '', 5000);
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