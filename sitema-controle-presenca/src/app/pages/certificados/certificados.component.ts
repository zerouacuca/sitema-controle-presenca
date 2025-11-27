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
  eventoPesquisa: string = '';
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
  if (!this.matriculaPesquisa.trim()) {
    this.certificadosFiltrados = this.certificados;
    this.filtroAtivo = 'todos';
    return;
  }

  this.carregando = true;
  
  // Filtro local - busca por matrícula OU nome do usuário
  const termoPesquisa = this.matriculaPesquisa.toLowerCase().trim();
  
  this.certificadosFiltrados = this.certificados.filter(certificado => {
    // Busca por matrícula (busca exata ou parcial)
    const matriculaMatch = certificado.matriculaUsuario?.toLowerCase().includes(termoPesquisa);
    
    // Busca por nome do usuário
    const nomeMatch = certificado.nomeUsuario?.toLowerCase().includes(termoPesquisa);

    return matriculaMatch || nomeMatch;
  });

  this.filtroAtivo = 'usuario';
  this.carregando = false;
  
  if (this.certificadosFiltrados.length === 0) {
    this.erro = 'Nenhum certificado encontrado para: "' + this.matriculaPesquisa + '"';
  } else {
    this.erro = '';
    this.mensagem = `Encontrados ${this.certificadosFiltrados.length} certificado(s)`;
    setTimeout(() => this.mensagem = '', 3000);
  }
  
  this.cd.detectChanges();
}

   pesquisarPorEvento(): void {
    if (!this.eventoPesquisa.trim()) {
      this.certificadosFiltrados = this.certificados;
      this.filtroAtivo = 'todos';
      return;
    }

    this.carregando = true;
    
    // Filtro local - busca por título, categoria ou data do evento
    const termoPesquisa = this.eventoPesquisa.toLowerCase().trim();
    
    this.certificadosFiltrados = this.certificados.filter(certificado => {
      // Verifica se o certificado tem informações do evento
      if (!certificado.eventoTitulo) {
        return false;
      }

      // Busca no título do evento
      const tituloMatch = certificado.eventoTitulo?.toLowerCase().includes(termoPesquisa);
      
      // Busca na data do evento (formato brasileiro)
      const dataEvento = certificado.dataEmissao ? new Date(certificado.dataEmissao) : null;
      const dataMatch = dataEvento ? 
        dataEvento.toLocaleDateString('pt-BR').includes(termoPesquisa) : false;
      
      // Busca na data formatada (alternativa)
      const dataFormatadaMatch = dataEvento ?
        dataEvento.toLocaleDateString('pt-BR', { 
          day: 'numeric', 
          month: 'numeric', 
          year: 'numeric' 
        }).includes(termoPesquisa) : false;

      return tituloMatch || dataMatch || dataFormatadaMatch;
    });

    this.filtroAtivo = 'evento';
    this.carregando = false;
    
    if (this.certificadosFiltrados.length === 0) {
      this.erro = 'Nenhum certificado encontrado para o critério de pesquisa';
    } else {
      this.erro = '';
      this.mensagem = `Encontrados ${this.certificadosFiltrados.length} certificado(s)`;
      setTimeout(() => this.mensagem = '', 3000);
    }
    
    this.cd.detectChanges();
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
    if (this.filtroAtivo === 'evento' && this.eventoPesquisa) {
      // Como agora é um filtro local, precisamos baixar individualmente os certificados filtrados
      const ids = this.certificadosFiltrados.map(c => c.id);
      
      if (ids.length === 0) {
        this.erro = 'Nenhum certificado para baixar';
        setTimeout(() => this.erro = '', 3000);
        this.cd.detectChanges();
        return;
      }

      // Baixa cada certificado individualmente
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

      this.mensagem = `Iniciando download de ${ids.length} certificado(s)...`;
      setTimeout(() => this.mensagem = '', 3000);
      this.cd.detectChanges();
    }
  }

  limparFiltros(): void {
    this.matriculaPesquisa = '';
    this.eventoPesquisa = ''; // ← Atualizei para o novo nome
    this.carregarTodosCertificados();
    this.erro = '';
    this.mensagem = '';
    this.cd.detectChanges();
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  // Novo: Função de formatação de carga horária (minutos para horas e minutos)
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
  
  // Método auxiliar para formatar a data do evento para exibição
  formatarDataEvento(dataHora: string): string {
    if (!dataHora) return 'Data não informada';
    
    const data = new Date(dataHora);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}