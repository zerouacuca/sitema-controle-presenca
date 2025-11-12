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
import { Certificado } from '../../models/certificado.model';
import { UsuarioTemplateDTO } from '../../models/usuario.model';
import { EventoService } from '../../servicos/evento-service';
import { CheckInService } from '../../servicos/checkin-service';
import { CertificadoService } from '../../servicos/certificado-service';
import { BiometricService, TemplateWithId } from '../../servicos/biometric-service';

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
  certificados: Certificado[] = [];
  isLoading: boolean = true;
  isLoadingAction: boolean = false;
  isCapturingBiometry: boolean = false;
  actionMessage: string = '';
  biometryError: string = '';

  statusEvento = StatusEvento;

  private templatesCarregados: boolean = false;
  private idParaMatriculaMap = new Map<number, string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private checkInService: CheckInService,
    private certificadoService: CertificadoService,
    private biometricService: BiometricService,
    private usuarioService: UsuarioService,
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

        if (evento.status === this.statusEvento.FINALIZADO) {
          this.carregarCertificados(evento.eventoId!);
        } else {
          this.carregarCheckIns(evento.eventoId!);
        }
        
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

  carregarCertificados(eventoId: number): void {
    this.certificadoService.getCertificadosPorEvento(eventoId).subscribe({
      next: (certificados: Certificado[]) => {
        this.certificados = certificados;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error('Erro ao carregar certificados:', error);
        this.certificados = [];
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  baixarCertificado(certificado: Certificado): void {
    this.isLoadingAction = true;
    this.actionMessage = `Baixando certificado de ${certificado.nomeUsuario}...`;
    this.cd.detectChanges();

    this.certificadoService.downloadCertificadoPdf(certificado.id).subscribe({
      next: (blob) => {
        saveAs(blob, `certificado_${certificado.matriculaUsuario}_${certificado.eventoId}.pdf`);
        this.actionMessage = 'Certificado baixado com sucesso!';
        this.isLoadingAction = false;
        this.cd.detectChanges();
        setTimeout(() => this.actionMessage = '', 3000);
      },
      error: (error) => {
        console.error('Erro ao baixar certificado:', error);
        this.handleError(error, 'Erro ao baixar certificado.');
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
          
          this.carregarTemplatesNaMemoria();
        },
        error: (error: any) => {
          this.handleError(error, 'Erro ao iniciar evento.');
        }
      });
    }
  }

  carregarTemplatesNaMemoria(): void {
    this.usuarioService.buscarTodosTemplates().subscribe({
      next: (templatesDTO: UsuarioTemplateDTO[]) => {

        const templatesParaLeitor: TemplateWithId[] = templatesDTO.map((dto, index) => {
            const idNumerico = index + 1; 
            this.idParaMatriculaMap.set(idNumerico, dto.id); 
            
            return {
                id: idNumerico, 
                template: dto.template 
            };
        });

        this.biometricService.deleteAllFromMemory().subscribe({
          next: () => {
            console.log('Memória do leitor limpa.');
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
          this.templatesCarregados = false;
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
          this.templatesCarregados = false;
          this.cd.detectChanges();
        },
        error: (error: any) => {
          this.handleError(error, 'Erro ao cancelar evento.');
        }
      });
    }
  }

  realizarCheckInBiometrico(): void {
    if (!this.evento?.eventoId) return;

    if (!this.templatesCarregados) {
        this.biometryError = "Templates ainda não foram carregados no leitor. Tente novamente em alguns segundos.";
        this.actionMessage = '';
        this.cd.detectChanges();
        this.carregarTemplatesNaMemoria();
        return;
    }

    this.isCapturingBiometry = true;
    this.biometryError = '';
    this.actionMessage = 'Aguardando leitura biométrica...';
    this.cd.detectChanges();

    this.biometricService.identification().subscribe({
      next: (identificationResponse) => {
        this.isCapturingBiometry = false;

        if (identificationResponse.success && identificationResponse.id) {
          const idNumerico = identificationResponse.id; 
          const matricula = this.idParaMatriculaMap.get(idNumerico);

          if (matricula) {
            this.actionMessage = `Digital identificada: ${matricula}. Registrando check-in...`;
            this.registrarCheckInNoBackend(matricula, this.evento!.eventoId!);
          } else {
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
  
  registrarCheckInNoBackend(matricula: string, eventoId: number): void {
    this.isLoadingAction = true;
    this.cd.detectChanges();

    this.checkInService.registrarCheckIn(matricula, eventoId).subscribe({
        next: (response: any) => {
            this.actionMessage = response.toString();
            this.isLoadingAction = false;
            this.carregarCheckIns(eventoId);
            this.cd.detectChanges();
            setTimeout(() => this.actionMessage = '', 3000);
        },
        error: (error: any) => {
             this.handleError(error, 'Erro ao registrar check-in no servidor.');
        }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error && typeof error.error === 'string') {
      return error.error;
    }
    if (error.error?.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    } else {
      return 'Erro desconhecido na captura biométrica';
    }
  }

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
      certificados: this.certificados.map(cert => ({
        id: cert.id,
        nomeUsuario: cert.nomeUsuario,
        matriculaUsuario: cert.matriculaUsuario,
        codigoValidacao: cert.codigoValidacao,
        dataEmissao: cert.dataEmissao
      })),
      resumo: {
        totalCheckIns: this.checkIns.length,
        totalCertificados: this.certificados.length,
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