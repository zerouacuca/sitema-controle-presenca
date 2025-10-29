import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { saveAs } from 'file-saver';
import { filter, Subscription } from 'rxjs';

import { Certificado } from '../../models/certificado.model';
import { CertificadoService } from '../../servicos/certificado-service';

@Component({
  selector: 'app-certificados',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.css']
})
export class CertificadosComponent implements OnInit, OnDestroy {
  certificados: Certificado[] = [];
  certificadosFiltrados: Certificado[] = [];
  certificadosSelecionados: Certificado[] = [];

  matriculaPesquisa: string = '';
  eventoIdPesquisa: string = '';
  filtroAtivo: 'todos' | 'usuario' | 'evento' = 'todos';

  carregando: boolean = false;
  mensagem: string = '';
  erro: string = '';

  private routerSubscription!: Subscription;

  constructor(
    private certificadoService: CertificadoService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarTodosCertificados();

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/certificados' || event.url === '/') {
        this.carregarTodosCertificados();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  carregarTodosCertificados(): void {
    this.carregando = true;
    this.certificadoService.getAllCertificados().subscribe({
      next: (data) => {
        this.certificados = data;
        this.certificadosFiltrados = data;
        this.carregando = false;
        this.filtroAtivo = 'todos';
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar certificados:', error);
        this.erro = 'Erro ao carregar certificados';
        this.carregando = false;
        this.cd.detectChanges();
      }
    });
  }

  pesquisarPorUsuario(): void {
    if (!this.matriculaPesquisa) {
      this.certificadosFiltrados = this.certificados;
      this.filtroAtivo = 'todos';
      return;
    }

    this.carregando = true;
    this.certificadoService.getCertificadosPorMatricula(this.matriculaPesquisa).subscribe({
      next: (data) => {
        this.certificadosFiltrados = data;
        this.filtroAtivo = 'usuario';
        this.carregando = false;
        this.erro = '';
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Erro na pesquisa por usuário:', error);
        this.erro = 'Usuário não encontrado ou sem certificados';
        this.carregando = false;
        this.certificadosFiltrados = [];
        this.cd.detectChanges();
      }
    });
  }

  pesquisarPorEvento(): void {
    if (!this.eventoIdPesquisa) {
      this.certificadosFiltrados = this.certificados;
      this.filtroAtivo = 'todos';
      return;
    }

    this.carregando = true;
    this.certificadoService.getCertificadosPorEvento(Number(this.eventoIdPesquisa)).subscribe({
      next: (data) => {
        this.certificadosFiltrados = data;
        this.filtroAtivo = 'evento';
        this.carregando = false;
        this.erro = '';
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Erro na pesquisa por evento:', error);
        this.erro = 'Evento não encontrado ou sem certificados';
        this.carregando = false;
        this.certificadosFiltrados = [];
        this.cd.detectChanges();
      }
    });
  }

  toggleSelecionar(certificado: Certificado): void {
    certificado.selected = !certificado.selected;
    this.atualizarSelecionados();
    this.cd.detectChanges();
  }

  toggleSelecionarTodos(event: any): void {
    const selecionar = event.target.checked;
    this.certificadosFiltrados.forEach(c => c.selected = selecionar);
    this.atualizarSelecionados();
    this.cd.detectChanges();
  }

  atualizarSelecionados(): void {
    this.certificadosSelecionados = this.certificadosFiltrados.filter(c => c.selected);
  }

  todosSelecionados(): boolean {
    return this.certificadosFiltrados.length > 0 &&
           this.certificadosFiltrados.every(c => c.selected);
  }

  algumSelecionado(): boolean {
    return this.certificadosFiltrados.some(c => c.selected);
  }

  baixarCertificadoIndividual(certificado: Certificado): void {
    this.certificadoService.downloadCertificadoPdf(certificado.id).subscribe({
      next: (blob) => {
        saveAs(blob, `certificado_${certificado.matriculaUsuario}.pdf`);
        this.mensagem = 'Certificado baixado com sucesso!';
        setTimeout(() => this.mensagem = '', 3000);
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao baixar certificado:', error);
        this.erro = 'Erro ao baixar certificado';
        setTimeout(() => this.erro = '', 3000);
        this.cd.detectChanges();
      }
    });
  }

  baixarCertificadosSelecionados(): void {
    const ids = this.certificadosSelecionados.map(c => c.id);

    if (ids.length === 0) {
      this.erro = 'Selecione pelo menos um certificado';
      setTimeout(() => this.erro = '', 3000);
      this.cd.detectChanges();
      return;
    }

    ids.forEach(id => {
      this.certificadoService.downloadCertificadoPdf(id).subscribe({
        next: (blob) => {
          saveAs(blob, `certificado_${id}.pdf`);
        },
        error: (error) => {
          console.error('Erro ao baixar certificado:', error);
        }
      });
    });

    this.mensagem = 'Iniciando download dos certificados...';
    setTimeout(() => this.mensagem = '', 3000);
    this.cd.detectChanges();
  }

  baixarTodosEvento(): void {
    if (this.filtroAtivo === 'evento' && this.eventoIdPesquisa) {
      this.certificadoService.downloadCertificadosEventoPdf(Number(this.eventoIdPesquisa)).subscribe({
        next: (blob) => {
          saveAs(blob, `certificados_evento_${this.eventoIdPesquisa}.pdf`);
          this.mensagem = 'Todos os certificados do evento baixados!';
          setTimeout(() => this.mensagem = '', 3000);
          this.cd.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao baixar certificados do evento:', error);
          this.erro = 'Erro ao baixar certificados do evento';
          setTimeout(() => this.erro = '', 3000);
          this.cd.detectChanges();
        }
      });
    }
  }

  enviarPorEmail(): void {
    const ids = this.certificadosSelecionados.map(c => c.id);

    if (ids.length === 0) {
      this.erro = 'Selecione pelo menos um certificado';
      setTimeout(() => this.erro = '', 3000);
      this.cd.detectChanges();
      return;
    }

    const email = prompt('Digite o email para envio:');

    if (email && ids.length > 0) {
      this.certificadoService.enviarCertificadosPorEmail(ids, email).subscribe({
        next: () => {
          this.mensagem = 'Certificados enviados com sucesso!';
          this.erro = '';
          setTimeout(() => this.mensagem = '', 3000);
          this.cd.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao enviar email:', error);
          this.erro = 'Erro ao enviar email';
          setTimeout(() => this.erro = '', 3000);
          this.cd.detectChanges();
        }
      });
    }
  }

  limparFiltros(): void {
    this.matriculaPesquisa = '';
    this.eventoIdPesquisa = '';
    this.carregarTodosCertificados();
    this.erro = '';
    this.mensagem = '';
    this.cd.detectChanges();
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}