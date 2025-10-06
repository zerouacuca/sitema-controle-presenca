import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UsuarioListDTO } from '../../models/usuario.model';
import { UsuarioService } from '../../servicos/usuario-service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabela-usuarios',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './tabela-usuarios.html',
  styleUrl: './tabela-usuarios.css'
})
export class TabelaUsuarios implements OnInit, OnDestroy {

  usuarios: UsuarioListDTO[] = [];
  usuariosFiltrados: UsuarioListDTO[] = [];
  isLoading: boolean = true;
  
  // Novas propriedades para filtros e mensagens
  nomePesquisa: string = '';
  matriculaPesquisa: string = '';
  mensagem: string = '';
  erro: string = '';
  filtroAtivo: boolean = false;

  private routerSubscription!: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregarUsuarios();

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/tabela-usuarios' || event.url === '/') {
        this.carregarUsuarios();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  carregarUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.buscarTodosUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = [...this.usuarios];
        this.isLoading = false;
        this.filtroAtivo = false;
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error('Erro ao carregar usuários:', error);
        this.erro = 'Erro ao carregar usuários. Tente novamente.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  pesquisarPorNome(): void {
    if (!this.nomePesquisa.trim()) {
      this.usuariosFiltrados = [...this.usuarios];
      this.filtroAtivo = false;
      return;
    }

    const termo = this.nomePesquisa.toLowerCase().trim();
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nome.toLowerCase().includes(termo)
    );

    this.filtroAtivo = true;
    this.mensagem = `Pesquisa por nome: ${this.usuariosFiltrados.length} usuário(s) encontrado(s).`;
    setTimeout(() => this.mensagem = '', 3000);
  }

  pesquisarPorMatricula(): void {
    if (!this.matriculaPesquisa.trim()) {
      this.usuariosFiltrados = [...this.usuarios];
      this.filtroAtivo = false;
      return;
    }

    const termo = this.matriculaPesquisa.trim();
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.matricula.includes(termo)
    );

    this.filtroAtivo = true;
    this.mensagem = `Pesquisa por matrícula: ${this.usuariosFiltrados.length} usuário(s) encontrado(s).`;
    setTimeout(() => this.mensagem = '', 3000);
  }

  limparFiltros(): void {
    this.nomePesquisa = '';
    this.matriculaPesquisa = '';
    this.usuariosFiltrados = [...this.usuarios];
    this.filtroAtivo = false;
    this.mensagem = 'Filtros limpos. Mostrando todos os usuários.';
    setTimeout(() => this.mensagem = '', 3000);
  }

  visualizarUsuario(usuario: UsuarioListDTO): void {
    console.log('Visualizar:', usuario);
    // Navega para a página de detalhes do usuário
    this.navegarParaRota('/detalhes-usuario', usuario.cpf);
  }

  editarUsuario(usuario: UsuarioListDTO): void {
    console.log('Editando usuário:', usuario);
    // Navega para a página de edição do usuário
    this.navegarParaRota('/editar-usuario', usuario.cpf);
  }

  removerUsuario(usuario: UsuarioListDTO): void {
    if (confirm(`Tem certeza que deseja remover o usuário "${usuario.nome}" (${usuario.matricula})? Esta ação não pode ser desfeita.`)) {
      this.isLoading = true;
      
      // CORREÇÃO: Usar deletarUsuario em vez de removerUsuario
      this.usuarioService.deletarUsuario(usuario.cpf).subscribe({
        next: () => {
          // Remove o usuário da lista local
          this.usuarios = this.usuarios.filter(u => u.cpf !== usuario.cpf);
          this.usuariosFiltrados = [...this.usuarios];
          this.mensagem = `Usuário "${usuario.nome}" removido com sucesso.`;
          this.isLoading = false;
          this.cd.detectChanges();
          setTimeout(() => this.mensagem = '', 5000);
        },
        error: (error: any) => {
          console.error('Erro ao remover usuário:', error);
          this.erro = this.obterMensagemErroRemocao(error);
          this.isLoading = false;
          this.cd.detectChanges();
          setTimeout(() => this.erro = '', 7000);
        }
      });
    }
  }

  cadastrarUsuario(): void {
    this.navegarParaRota('/cadastrar-usuario');
  }

  /**
   * Método auxiliar para navegação que trata possíveis erros
   */
  private navegarParaRota(rota: string, parametro?: string): void {
    try {
      if (parametro) {
        this.router.navigate([rota, parametro]).catch((error: any) => {
          console.error(`Erro ao navegar para ${rota}:`, error);
          this.erro = `Erro ao acessar a página. Verifique se a rota "${rota}" existe.`;
          setTimeout(() => this.erro = '', 5000);
        });
      } else {
        this.router.navigate([rota]).catch((error: any) => {
          console.error(`Erro ao navegar para ${rota}:`, error);
          this.erro = `Erro ao acessar a página. Verifique se a rota "${rota}" existe.`;
          setTimeout(() => this.erro = '', 5000);
        });
      }
    } catch (error: any) {
      console.error('Erro inesperado na navegação:', error);
      this.erro = 'Erro inesperado ao tentar navegar.';
      setTimeout(() => this.erro = '', 5000);
    }
  }

  /**
   * Método para obter mensagens de erro amigáveis
   */
  private obterMensagemErroRemocao(error: any): string {
    if (error.status === 404) {
      return 'Usuário não encontrado.';
    } else if (error.status === 403) {
      return 'Você não tem permissão para remover este usuário.';
    } else if (error.status === 409) {
      return 'Não é possível remover o usuário pois existem registros associados.';
    } else if (error.status === 0) {
      return 'Erro de conexão. Verifique sua internet.';
    } else {
      return 'Erro ao remover usuário. Tente novamente.';
    }
  }
}