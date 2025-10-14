// evento-crud.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EventoService } from '../../servicos/evento-service';
import { Evento, StatusEvento } from '../../models/evento.model';

@Component({
  selector: 'app-evento-crud',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './evento-crud.html',
  styleUrls: ['./evento-crud.css']
})
export class EventoCrud implements OnInit {
  evento: Evento = {
    titulo: '',
    descricao: '',
    dataHora: new Date().toISOString().slice(0, 16), // Para o form
    categoria: '',
    cargaHoraria: 0,
    status: StatusEvento.AGENDADO // Status inicial correto
  };

  isEditMode: boolean = false;
  eventoId: number | null = null;

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.eventoId = Number(id);
      this.carregarEvento(this.eventoId);
    }
  }

  carregarEvento(id: number): void {
    this.eventoService.getEventoById(id).subscribe({
      next: (data) => {
        //   CORREÇÃO: Converter data string para formato do form
        this.evento = {
          ...data,
          dataHora: this.formatarDataParaInput(data.dataHora)
        };
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar evento:', err);
        this.navegarParaLista();
      }
    });
  }

  salvarEvento(): void {
    //   CORREÇÃO: Preparar dados no formato exato do backend
    const eventoParaEnviar = this.prepararDadosParaBackend();

    if (this.isEditMode && this.eventoId) {
      this.eventoService.updateEvento(this.eventoId, eventoParaEnviar).subscribe({
        next: (response) => {
          console.log('Evento atualizado com sucesso!', response);
          this.navegarParaLista();
        },
        error: (err) => {
          console.error('Erro ao atualizar evento:', err);
          this.tratarErro(err);
        }
      });
    } else {
      this.eventoService.createEvento(eventoParaEnviar).subscribe({
        next: (response) => {
          console.log('Evento cadastrado com sucesso!', response);
          this.navegarParaLista();
        },
        error: (err) => {
          console.error('Erro ao cadastrar evento:', err);
          this.tratarErro(err);
        }
      });
    }
  }

  private prepararDadosParaBackend(): any {
    //   CORREÇÃO: Criar objeto IDÊNTICO ao modelo Java
    const dados = {
      titulo: this.evento.titulo,
      descricao: this.evento.descricao,
      dataHora: new Date(this.evento.dataHora), // Envia como Date object
      cargaHoraria: Number(this.evento.cargaHoraria), // Garante que é number
      categoria: this.evento.categoria,
      status: this.evento.status || StatusEvento.AGENDADO
    };

    console.log('Dados enviados para backend:', dados);
    return dados;
  }

  private tratarErro(err: any): void {
    if (err.error && typeof err.error === 'string') {
      alert('Erro: ' + err.error);
    } else if (err.error && err.error.message) {
      alert('Erro: ' + err.error.message);
    } else if (err.status === 403) {
      alert('Acesso negado. Verifique suas permissões.');
    } else if (err.status === 401) {
      alert('Sessão expirada. Faça login novamente.');
      this.router.navigate(['/login']);
    } else {
      alert('Erro ao processar solicitação. Verifique o console para detalhes.');
    }
  }

  removerEvento(): void {
    if (this.eventoId && confirm('Tem certeza que deseja remover este evento?')) {
      this.eventoService.deleteEvento(this.eventoId).subscribe({
        next: () => {
          console.log('Evento removido com sucesso!');
          this.navegarParaLista();
        },
        error: (err) => {
          console.error('Erro ao remover evento:', err);
          alert('Erro ao remover evento: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  encerrarEvento(): void {
    if (this.eventoId) {
      this.eventoService.encerrarEvento(this.eventoId).subscribe({
        next: (mensagem) => {
          alert(mensagem);
          this.navegarParaLista();
        },
        error: (err) => {
          console.error('Erro ao encerrar evento:', err);
          alert('Erro ao encerrar evento: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  // Métodos de navegação
  navegarParaLista(): void {
    this.router.navigate(['/eventos']);
  }

  cancelar(): void {
    this.navegarParaLista();
  }

  private formatarDataParaInput(data: string | Date): string {
    const date = new Date(data);
    return date.toISOString().slice(0, 16);
  }

  // Métodos auxiliares para status visual (baseado no backend)
  isEventoAgendado(): boolean {
    return this.evento.status === StatusEvento.AGENDADO;
  }

  isEventoEmAndamento(): boolean {
    return this.evento.status === StatusEvento.EM_ANDAMENTO;
  }

  isEventoFinalizado(): boolean {
    return this.evento.status === StatusEvento.FINALIZADO;
  }

  isEventoCancelado(): boolean {
    return this.evento.status === StatusEvento.CANCELADO;
  }

  isEventoPausado(): boolean {
    return this.evento.status === StatusEvento.PAUSADO;
  }
}