// src/app/pages/detalhes-evento/detalhes-evento.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../servicos/usuario-service';
import { saveAs } from 'file-saver';

import { Evento, StatusEvento } from '../../models/evento.model';
import { CheckIn } from '../../models/checkin.model';
import { UsuarioTemplateDTO } from '../../models/usuario.model'; // Importe o DTO
import { EventoService } from '../../servicos/evento-service';
import { CheckInService } from '../../servicos/checkin-service';
import { BiometricService, TemplateWithId } from '../../servicos/biometric-service'; // Importe TemplateWithId

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

  private templatesCarregados: boolean = false;
  // NOVO: Mapa para traduzir ID numérico (leitor) para Matrícula (backend)
  private idParaMatriculaMap = new Map<number, string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private checkInService: CheckInService,
    private biometricService: BiometricService,
    private usuarioService: UsuarioService, // Injeção adicionada
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
        
        // Se o evento já estiver em andamento, carrega os templates
        if (evento.status === this.statusEvento.EM_ANDAMENTO && !this.templatesCarregados) {
          this.carregarTemplatesNaMemoria();
        }
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
          this.carregarDetalhesEvento(); // Recarrega o evento (que agora está EM_ANDAMENTO)
          
          // Carrega os templates na memória do leitor
          this.carregarTemplatesNaMemoria();
        },
        error: (error: any) => {
          this.handleError(error, 'Erro ao iniciar evento.');
        }
      });
    }
  }

  carregarTemplatesNaMemoria(): void {
    // 1. Busca templates do backend Java
    this.usuarioService.buscarTodosTemplates().subscribe({
      next: (templatesDTO: UsuarioTemplateDTO[]) => {

        // 2. Mapeia DTO (id: string) para o formato do leitor (id: number)
        const templatesParaLeitor: TemplateWithId[] = templatesDTO.map((dto, index) => {
            const idNumerico = index + 1; 
            this.idParaMatriculaMap.set(idNumerico, dto.id); 
            
            return {
                id: idNumerico, 
                template: dto.template 
            };
        });

        // 5. Limpa a memória do leitor
        this.biometricService.deleteAllFromMemory().subscribe({
          next: () => {
            console.log('Memória do leitor limpa.');
            // 6. Carrega os novos templates (com ID numérico)
            this.biometricService.loadToMemory(templatesParaLeitor).subscribe({
              next: (loadResponse) => {
                this.templatesCarregados = true;
                this.isLoadingAction = false;
                this.actionMessage = 'Leitor pronto para check-in.';
                console.log('Templates carregados no leitor:', loadResponse.message);
                this.cd.detectChanges();
                setTimeout(() => this.actionMessage = '', 3000);
              },
              error: (err) => this.handleError(err, 'Falha ao carregar templates no leitor (ERRO 500).')
            });
          },
          error: (err) => this.handleError(err, 'Falha ao limpar memória do leitor.')
        });
      },
      error: (err) => this.handleError(err, 'Falha ao buscar templates do servidor backend.')
    });
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
          this.templatesCarregados = false; // Limpa o estado
          this.cd.detectChanges();
        },
        error: (error: any) => {
          this.handleError(error, 'Erro ao encerrar evento.');
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
          this.templatesCarregados = false; // Limpa o estado
          this.cd.detectChanges();
        },
        error: (error: any) => {
          this.handleError(error, 'Erro ao cancelar evento.');
        }
      });
    }
  }

  // ATUALIZADO: Lógica de check-in 1:N com tradução de ID
  realizarCheckInBiometrico(): void {
    if (!this.evento?.eventoId) return;

    if (!this.templatesCarregados) {
        this.biometryError = "Templates ainda não foram carregados no leitor. Tente novamente em alguns segundos.";
        this.actionMessage = '';
        this.cd.detectChanges();
        // Tenta carregar novamente
        this.carregarTemplatesNaMemoria();
        return;
    }

    this.isCapturingBiometry = true;
    this.biometryError = '';
    this.actionMessage = 'Aguardando leitura biométrica...';
    this.cd.detectChanges();

    // 1. CHAMA O MÉTODO DE IDENTIFICAÇÃO (1:N)
    this.biometricService.identification().subscribe({
      next: (identificationResponse) => {
        this.isCapturingBiometry = false;

        if (identificationResponse.success && identificationResponse.id) {
          // 2. SUCESSO! O Leitor retorna um ID NUMÉRICO (ex: 1)
          const idNumerico = identificationResponse.id; 
          
          // 3. Traduz o ID numérico de volta para a MATRÍCULA (string)
          const matricula = this.idParaMatriculaMap.get(idNumerico); // ex: "2023001"

          if (matricula) {
            this.actionMessage = `Digital identificada: ${matricula}. Registrando check-in...`;
            // 4. ENVIA A MATRÍCULA (string) PARA O BACKEND JAVA
            this.registrarCheckInNoBackend(matricula, this.evento!.eventoId!);
          } else {
            // Isso não deve acontecer se o mapa foi carregado corretamente
            this.biometryError = `ID ${idNumerico} retornado pelo leitor, mas não encontrado no mapa de matrículas.`;
            this.actionMessage = '';
            this.cd.detectChanges();
          }

        } else {
          this.biometryError = identificationResponse.message || 'Digital não reconhecida na base de dados.';
          this.actionMessage = '';
          this.cd.detectChanges();
        }
      },
      error: (error) => {
        this.handleError(error, 'Erro na captura biométrica.');
      }
    });
  }
  
  // NOVO MÉTODO: Envia o resultado para o backend
  registrarCheckInNoBackend(matricula: string, eventoId: number): void {
    this.isLoadingAction = true;
    this.cd.detectChanges();

    this.checkInService.registrarCheckIn(matricula, eventoId).subscribe({
        next: (response: any) => {
            this.actionMessage = response.toString(); // Resposta de sucesso
            this.isLoadingAction = false;
            this.carregarCheckIns(eventoId); // Recarrega a lista
            this.cd.detectChanges();
            setTimeout(() => this.actionMessage = '', 3000);
        },
        error: (error: any) => {
             this.handleError(error, 'Erro ao registrar check-in no servidor.');
        }
    });
  }

  // ATUALIZADO para incluir mensagens de erro do backend
  private getErrorMessage(error: any): string {
    if (error.error && typeof error.error === 'string') {
      return error.error; // Erro do backend (string simples)
    }
    if (error.error?.message) {
      return error.error.message; // Erro do biometric-service (JSON)
    } else if (error.message) {
      return error.message; // Erro geral do Angular
    } else {
      return 'Erro desconhecido na captura biométrica';
    }
  }

  // NOVO MÉTODO: Helper para centralizar erros
  private handleError(error: any, defaultMessage: string): void {
    this.isLoadingAction = false;
    this.isCapturingBiometry = false;
    this.biometryError = this.getErrorMessage(error) || defaultMessage;
    this.actionMessage = '';
    this.cd.detectChanges();
    setTimeout(() => this.biometryError = '', 5000);
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

  exportarRelatorio(formato: 'json' | 'csv'): void {
    if (!this.evento || !this.evento.eventoId) return;

    this.isLoadingAction = true;

    // Fecha o modal
    const modalElement = document.getElementById('modalExportacaoDetalhes');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }

    const eventoId = this.evento.eventoId;
    const eventoTitulo = this.evento.titulo || 'Evento';

    if (formato === 'json') {
      this.exportarJSONUnico(eventoId, eventoTitulo);
    } else if (formato === 'csv') {
      this.exportarCSVUnico(eventoId, eventoTitulo);
    }
  }

  private exportarJSONUnico(eventoId: number, eventoTitulo: string): void {
    const dadosExportacao = {
      metadata: {
        geradoEm: new Date().toISOString(),
        eventoId: eventoId,
        formato: 'JSON',
        versao: '1.0'
      },
      evento: {
        ...this.evento,
        statusDescricao: this.getStatusDescricao(this.evento?.status)
      },
      checkIns: this.checkIns.map(checkIn => ({
        ...checkIn,
        dataHoraFormatada: this.formatarDataHora(checkIn.dataHoraCheckin)
      })),
      resumo: {
        totalCheckIns: this.checkIns.length,
        cargaHoraria: this.evento?.cargaHoraria,
        dataEvento: this.formatarDataHora(this.evento!.dataHora)
      }
    };

    setTimeout(() => {
      this.downloadJSON(dadosExportacao, `evento-${eventoId}-relatorio.json`);
      this.finalizarExportacao(`Relatório JSON do evento "${eventoTitulo}" exportado com sucesso!`);
    }, 1000);
  }

  private exportarCSVUnico(eventoId: number, eventoTitulo: string): void {
    this.eventoService.exportarEventosCSV([eventoId]).subscribe({
      next: (blob) => {
        saveAs(blob, `evento-${eventoId}-relatorio.csv`);
        this.finalizarExportacao(`Relatório CSV do evento "${eventoTitulo}" exportado com sucesso!`);
      },
      error: (error) => {
        console.error('Erro ao exportar CSV:', error);
        this.handleError(error, 'Erro ao gerar relatório CSV.');
      }
    });
  }

  private finalizarExportacao(mensagem: string): void {
    this.isLoadingAction = false;
    this.actionMessage = mensagem;
    setTimeout(() => this.actionMessage = '', 5000);
    this.cd.detectChanges();
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