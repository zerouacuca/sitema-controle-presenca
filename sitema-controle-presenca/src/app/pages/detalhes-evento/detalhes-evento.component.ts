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
  isLoading: boolean = true;
  isLoadingAction: boolean = false;
  isCapturingBiometry: boolean = false;
  actionMessage: string = '';
  biometryError: string = '';

  statusEvento = StatusEvento;

  private templatesCarregados: boolean = false;
  // NOVO: Mapa para traduzir ID numérico (leitor) para Matrícula (backend)
  private idParaMatriculaMap = new Map<number, string>();
  // Mapa para armazenar o ID do Certificado pelo Matricula do usuário
  private matriculaParaCertificadoIdMap = new Map<string, number>();

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
      next: (evento: Evento) => { // Tipo explícito
        this.evento = evento;
        this.carregarCheckIns(evento.eventoId!);
        
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
        this.carregarCertificadosParaEvento(eventoId);
      },
      error: (error: any) => {
        console.error('Erro ao carregar check-ins:', error);
        this.checkIns = [];
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  carregarCertificadosParaEvento(eventoId: number): void {
    this.matriculaParaCertificadoIdMap.clear();
    this.certificadoService.getCertificadosPorEvento(eventoId).subscribe({
      next: (certificados: Certificado[]) => { // Tipo explícito
        certificados.forEach((cert: Certificado) => { // Tipo explícito
          this.matriculaParaCertificadoIdMap.set(cert.matriculaUsuario, cert.id);
        });
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (error: any) => { // Tipo explícito
        console.error('Erro ao carregar certificados do evento:', error);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  getCertificadoId(matricula: string): number | undefined {
    return this.matriculaParaCertificadoIdMap.get(matricula);
  }

  baixarCertificado(certificadoId: number, matricula: string): void {
    this.actionMessage = 'Baixando certificado...';
    this.isLoadingAction = true;

    this.certificadoService.downloadCertificadoPdf(certificadoId).subscribe({
      next: (blob: Blob) => { // Tipo explícito
        saveAs(blob, `certificado_${matricula}.pdf`);
        this.actionMessage = 'Download concluído!';
        this.isLoadingAction = false;
        this.cd.detectChanges();
        setTimeout(() => this.actionMessage = '', 3000);
      },
      error: (error: any) => { // Tipo explícito
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
              next: (loadResponse: { message: string, success: boolean }) => { // Tipo explícito
                this.templatesCarregados = true;
                this.isLoadingAction = false;
                this.actionMessage = 'Leitor pronto para check-in.';
                console.log('Templates carregados no leitor:', loadResponse.message);
                this.cd.detectChanges();
                setTimeout(() => this.actionMessage = '', 3000);
              },
              error: (err: any) => this.handleError(err, 'Falha ao carregar templates no leitor (ERRO 500).')
            });
          },
          error: (err: any) => this.handleError(err, 'Falha ao limpar memória do leitor.')
        });
      },
      error: (err: any) => this.handleError(err, 'Falha ao buscar templates do servidor backend.')
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
      next: (identificationResponse: { id: number, success: boolean, message: string }) => { // Tipo explícito
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
      error: (error: any) => { // Tipo explícito
        this.handleError(error, 'Erro na captura biométrica.');
      }
    });
  }
  
  registrarCheckInNoBackend(matricula: string, eventoId: number): void {
    this.isLoadingAction = true;
    this.cd.detectChanges();

    this.checkInService.registrarCheckIn(matricula, eventoId).subscribe({
        next: (response: string) => { // Tipo explícito (baseado em responseType: 'text')
            this.actionMessage = response.toString();
            this.isLoadingAction = false;
            this.carregarCheckIns(eventoId);
            this.cd.detectChanges();
            setTimeout(() => this.actionMessage = '', 3000);
        },
        error: (error: any) => { // Tipo explícito
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

  formatarCargaHoraria(totalMinutosDouble: number): string {
    const totalMinutos = Math.floor(totalMinutosDouble);

    if (totalMinutos <= 0) {
      return "0 minutos";
    }

    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    let sb = '';

    if (horas > 0) {
      sb += `${horas} hora${horas === 1 ? '' : 's'}`;
    }

    if (minutos > 0) {
      if (horas > 0) {
        sb += " e ";
      }
      sb += `${minutos} minuto${minutos === 1 ? '' : 's'}`;
    }

    return sb;
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

    const modalElement = document.getElementById('modalExportacaoDetalhes');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
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
    this.eventoService.exportarEventosJSON([eventoId]).subscribe({
      next: (data: any) => {
        this.downloadJSON(data, `evento-${eventoId}-relatorio.json`);
        this.finalizarExportacao(`Relatório JSON do evento "${eventoTitulo}" exportado com sucesso!`);
      },
      error: (error: any) => {
        this.handleError(error, 'Erro ao gerar relatório JSON.');
      }
    });
  }

  private exportarCSVUnico(eventoId: number, eventoTitulo: string): void {
    this.eventoService.exportarEventosCSV([eventoId]).subscribe({
      next: (blob: Blob) => { // Tipo explícito
        saveAs(blob, `evento-${eventoId}-relatorio.csv`);
        this.finalizarExportacao(`Relatório CSV do evento "${eventoTitulo}" exportado com sucesso!`);
      },
      error: (error: any) => {
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