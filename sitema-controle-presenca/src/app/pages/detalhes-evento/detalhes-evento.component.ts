import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Evento, StatusEvento } from '../../models/evento.model';
import { CheckIn, StatusCheckIn } from '../../models/checkin.model';
import { EventoService } from '../../servicos/evento-service';
import { CheckInService } from '../../servicos/checkin-service';
import { Navbar } from '../../componentes/navbar/navbar';

@Component({
  selector: 'app-detalhes-evento',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule, Navbar],
  templateUrl: './detalhes-evento.component.html',
  styleUrls: ['./detalhes-evento.component.css']
})
export class DetalhesEventoComponent implements OnInit {

  evento: Evento | null = null;
  checkIns: CheckIn[] = [];
  isLoading: boolean = true;
  
  // Disponibilizar os enums para o template
  statusEvento = StatusEvento;
  statusCheckIn = StatusCheckIn;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private checkInService: CheckInService,
    private cd: ChangeDetectorRef // Adicionado ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregarDetalhesEvento();
  }

  carregarDetalhesEvento(): void {
    const eventoId = this.route.snapshot.paramMap.get('id');
    
    if (!eventoId) {
      this.isLoading = false;
      this.cd.detectChanges(); // Força detecção de mudanças
      return;
    }

    this.isLoading = true;
    this.cd.detectChanges(); // Força atualização do loading
    
    // Carregar dados do evento
    this.eventoService.getEventoById(Number(eventoId)).subscribe({
      next: (evento) => {
        this.evento = evento;
        this.carregarCheckIns(evento.eventoId!);
      },
      error: (error: any) => {
        console.error('Erro ao carregar evento:', error);
        this.isLoading = false;
        this.cd.detectChanges(); // Força detecção de mudanças
      }
    });
  }

  carregarCheckIns(eventoId: number): void {
    this.checkInService.getCheckInsPorEvento(eventoId).subscribe({
      next: (checkIns: CheckIn[]) => {
        this.checkIns = checkIns;
        this.isLoading = false;
        this.cd.detectChanges(); // Força detecção de mudanças após carregar tudo
      },
      error: (error: any) => {
        console.error('Erro ao carregar check-ins:', error);
        this.isLoading = false;
        this.cd.detectChanges(); // Força detecção de mudanças mesmo em erro
      }
    });
  }

  // Getters para estatísticas
  get totalPresentes(): number {
    return this.checkIns.filter(c => c.status === StatusCheckIn.PRESENTE).length;
  }

  get totalPendentes(): number {
    return this.checkIns.filter(c => c.status === StatusCheckIn.PENDENTE).length;
  }

  get totalAusentes(): number {
    return this.checkIns.filter(c => c.status === StatusCheckIn.AUSENTE).length;
  }

  get totalCancelados(): number {
    return this.checkIns.filter(c => c.status === StatusCheckIn.CANCELADO).length;
  }

  // Navegação
  voltarParaLista(): void {
    this.router.navigate(['/tabela-eventos']);
  }

  editarEvento(): void {
    if (this.evento?.eventoId) {
      this.router.navigate(['/editar-evento', this.evento.eventoId]);
    }
  }

  encerrarEvento(): void {
    if (this.evento?.eventoId && confirm('Tem certeza que deseja encerrar este evento?')) {
      this.eventoService.encerrarEvento(this.evento.eventoId).subscribe({
        next: (mensagem: string) => {
          alert(mensagem);
          this.carregarDetalhesEvento(); // Recarrega os dados
        },
        error: (error: any) => {
          console.error('Erro ao encerrar evento:', error);
          alert('Erro ao encerrar evento.');
        }
      });
    }
  }

  // Formatação
  formatarDataHora(data: string | Date): string {
    if (!data) return 'Data inválida';
    const date = new Date(data);
    return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleString('pt-BR');
  }

  formatarCPF(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  getStatusDescricao(status: StatusEvento): string {
    switch (status) {
      case StatusEvento.AGENDADO: return 'Agendado';
      case StatusEvento.EM_ANDAMENTO: return 'Em Andamento';
      case StatusEvento.FINALIZADO: return 'Finalizado';
      case StatusEvento.CANCELADO: return 'Cancelado';
      case StatusEvento.PAUSADO: return 'Pausado';
      default: return 'Não definido';
    }
  }

  getStatusBadgeClass(status: StatusEvento): string {
    switch (status) {
      case StatusEvento.AGENDADO: return 'bg-info';
      case StatusEvento.EM_ANDAMENTO: return 'bg-warning';
      case StatusEvento.FINALIZADO: return 'bg-success';
      case StatusEvento.CANCELADO: return 'bg-danger';
      case StatusEvento.PAUSADO: return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  getStatusCheckInDescricao(status: StatusCheckIn): string {
    switch (status) {
      case StatusCheckIn.PRESENTE: return 'Presente';
      case StatusCheckIn.AUSENTE: return 'Ausente';
      case StatusCheckIn.PENDENTE: return 'Pendente';
      case StatusCheckIn.CANCELADO: return 'Cancelado';
      default: return 'Não definido';
    }
  }
}