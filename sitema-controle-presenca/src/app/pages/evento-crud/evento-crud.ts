import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EventoService } from '../../servicos/evento-service';
import { Evento } from '../../models/evento.model';

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
    dataHora: new Date().toISOString().slice(0, 16),
    categoria: '',
    cargaHoraria: 0
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
    // Converte a string dataHora para Date
    const eventoParaEnviar = {
      ...this.evento,
      dataHora: new Date(this.evento.dataHora)
    };

    if (this.isEditMode && this.eventoId) {
      this.eventoService.updateEvento(this.eventoId, eventoParaEnviar).subscribe({
        next: () => {
          console.log('Evento atualizado com sucesso!');
          this.navegarParaLista();
        },
        error: (err) => {
          console.error('Erro ao atualizar evento:', err);
          alert('Erro ao atualizar evento. Verifique o console para detalhes.');
        }
      });
    } else {
      this.eventoService.createEvento(eventoParaEnviar).subscribe({
        next: () => {
          console.log('Evento cadastrado com sucesso!');
          this.navegarParaLista();
        },
        error: (err) => {
          console.error('Erro ao cadastrar evento:', err);
          alert('Erro ao cadastrar evento. Verifique o console para detalhes.');
        }
      });
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
          alert('Erro ao remover evento.');
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
          alert('Erro ao encerrar evento.');
        }
      });
    }
  }

  // Métodos públicos para navegação
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

  // Métodos auxiliares para determinar o status visual
  isEventoAgendado(): boolean {
    if (!this.evento.dataHora) return false;
    const dataEvento = new Date(this.evento.dataHora);
    return dataEvento > new Date();
  }

  isEventoEmAndamento(): boolean {
    if (!this.evento.dataHora) return false;
    const dataEvento = new Date(this.evento.dataHora);
    const agora = new Date();
    const fimEvento = new Date(dataEvento.getTime() + this.evento.cargaHoraria * 60 * 60 * 1000);
    return dataEvento <= agora && fimEvento >= agora;
  }

  isEventoFinalizado(): boolean {
    if (!this.evento.dataHora) return false;
    const dataEvento = new Date(this.evento.dataHora);
    const fimEvento = new Date(dataEvento.getTime() + this.evento.cargaHoraria * 60 * 60 * 1000);
    return fimEvento < new Date();
  }
}
