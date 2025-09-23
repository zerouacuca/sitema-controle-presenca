import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Evento, StatusEvento } from '../../models/evento.model';
import { CheckIn, StatusCheckIn } from '../../models/checkin.model';
import { EventoService } from '../../servicos/evento-service';
import { CheckInService } from '../../servicos/checkin-service';
import { BiometricService } from '../../servicos/biometric-service';
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
  isLoadingAction: boolean = false;
  isCapturingBiometry: boolean = false;
  actionMessage: string = '';
  biometryError: string = '';
  
  statusEvento = StatusEvento;
  statusCheckIn = StatusCheckIn;

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

  // === CONTROLES DE STATUS DO EVENTO ===

  iniciarEvento(): void {
    if (this.evento?.eventoId && confirm('Iniciar este evento?')) {
      this.isLoadingAction = true;
      this.actionMessage = 'Iniciando evento...';
      
      this.eventoService.atualizarStatus(this.evento.eventoId, StatusEvento.EM_ANDAMENTO).subscribe({
        next: () => {
          this.actionMessage = 'Evento iniciado com sucesso!';
          this.carregarDetalhesEvento();
          this.isLoadingAction = false;
          this.cd.detectChanges();
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

  pausarEvento(): void {
    if (this.evento?.eventoId && confirm('Pausar este evento?')) {
      this.isLoadingAction = true;
      this.actionMessage = 'Pausando evento...';
      
      this.eventoService.atualizarStatus(this.evento.eventoId, StatusEvento.PAUSADO).subscribe({
        next: () => {
          this.actionMessage = 'Evento pausado com sucesso!';
          this.carregarDetalhesEvento();
          this.isLoadingAction = false;
          this.cd.detectChanges();
        },
        error: (error: any) => {
          console.error('Erro ao pausar evento:', error);
          this.actionMessage = 'Erro ao pausar evento.';
          this.isLoadingAction = false;
          this.cd.detectChanges();
        }
      });
    }
  }

  retomarEvento(): void {
    if (this.evento?.eventoId && confirm('Retomar este evento?')) {
      this.isLoadingAction = true;
      this.actionMessage = 'Retomando evento...';
      
      this.eventoService.atualizarStatus(this.evento.eventoId, StatusEvento.EM_ANDAMENTO).subscribe({
        next: () => {
          this.actionMessage = 'Evento retomado com sucesso!';
          this.carregarDetalhesEvento();
          this.isLoadingAction = false;
          this.cd.detectChanges();
        },
        error: (error: any) => {
          console.error('Erro ao retomar evento:', error);
          this.actionMessage = 'Erro ao retomar evento.';
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

  // === CHECK-IN BIOMÉTRICO ===

  realizarCheckInBiometrico(): void {
    if (!this.evento?.eventoId) return;

    this.isCapturingBiometry = true;
    this.biometryError = '';
    this.actionMessage = 'Aguardando leitura biométrica...';
    this.cd.detectChanges();

    // Primeiro, carrega todos os templates na memória do dispositivo
    this.carregarTemplatesNaMemoria().then(() => {
      // Depois realiza a identificação 1:N
      this.biometricService.identification(5).subscribe({
        next: (response) => {
          this.isCapturingBiometry = false;
          
          if (response.success) {
            this.actionMessage = `Check-in realizado para ID: ${response.id}`;
            this.carregarCheckIns(this.evento!.eventoId!);
          } else {
            this.biometryError = response.message || 'Digital não reconhecida';
            this.actionMessage = '';
          }
          this.cd.detectChanges();
        },
        error: (error) => {
          this.isCapturingBiometry = false;
          this.biometryError = this.getErrorMessage(error);
          this.actionMessage = '';
          this.cd.detectChanges();
        }
      });
    }).catch(error => {
      this.isCapturingBiometry = false;
      this.biometryError = 'Erro ao carregar templates: ' + error.message;
      this.actionMessage = '';
      this.cd.detectChanges();
    });
  }

  private async carregarTemplatesNaMemoria(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Primeiro limpa a memória
      this.biometricService.deleteAllFromMemory().subscribe({
        next: () => {
          // Busca todos os usuários cadastrados
          this.carregarUsuariosETemplates().then(templates => {
            if (templates.length === 0) {
              reject(new Error('Nenhum usuário cadastrado com template biométrico'));
              return;
            }

            // Carrega os templates na memória do dispositivo
            this.biometricService.loadToMemory(templates).subscribe({
              next: (response) => {
                if (response.success) {
                  resolve();
                } else {
                  reject(new Error(response.message || 'Erro ao carregar templates'));
                }
              },
              error: (error) => {
                reject(error);
              }
            });
          }).catch(error => {
            reject(error);
          });
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  private async carregarUsuariosETemplates(): Promise<any[]> {
    // Aqui você precisa implementar a busca dos usuários com seus templates
    // Esta é uma implementação mock - substitua pela sua lógica real
    return new Promise((resolve) => {
      // Mock - substitua por chamada real ao seu serviço de usuários
      const mockTemplates = [
        { id: 1, template: 'template1' },
        { id: 2, template: 'template2' }
      ];
      resolve(mockTemplates);
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

  // === NAVEGAÇÃO E FORMATAÇÃO ===

  voltarParaLista(): void {
    this.router.navigate(['/tabela-eventos']);
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

  formatarCPF(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

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

  getStatusBadgeClass(status: StatusEvento | undefined): string {
    if (!status) return 'bg-secondary';
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