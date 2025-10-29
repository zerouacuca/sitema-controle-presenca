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

  nomePesquisa: string = '';
  matriculaPesquisa: string = '';
  emailPesquisa: string = '';
  setorPesquisa: string = '';

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
        this.aplicarFiltros();
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

  aplicarFiltros(): void {
    let usuariosFiltrados = [...this.usuarios];

    if (this.nomePesquisa.trim()) {
      const termo = this.nomePesquisa.toLowerCase().trim();
      usuariosFiltrados = usuariosFiltrados.filter(usuario =>
        usuario.nome.toLowerCase().includes(termo)
      );
    }

    if (this.matriculaPesquisa.trim()) {
      const termo = this.matriculaPesquisa.trim();
      usuariosFiltrados = usuariosFiltrados.filter(usuario =>
        usuario.matricula.includes(termo)
      );
    }

    if (this.emailPesquisa.trim()) {
       const termo = this.emailPesquisa.toLowerCase().trim();
       usuariosFiltrados = usuariosFiltrados.filter(usuario =>
         usuario.email.toLowerCase().includes(termo)
       );
     }


    if (this.setorPesquisa.trim()) {
      const termo = this.setorPesquisa.toLowerCase().trim();
      usuariosFiltrados = usuariosFiltrados.filter(usuario =>
        usuario.setor && usuario.setor.toLowerCase().includes(termo)
      );
    }


    this.usuariosFiltrados = usuariosFiltrados;

    this.filtroAtivo = !!(this.nomePesquisa.trim() || this.matriculaPesquisa.trim() ||
                          this.emailPesquisa.trim() || this.setorPesquisa.trim());
  }


  limparFiltros(): void {
    this.nomePesquisa = '';
    this.matriculaPesquisa = '';
    this.emailPesquisa = '';
    this.setorPesquisa = '';
    this.usuariosFiltrados = [...this.usuarios];
    this.filtroAtivo = false;
    this.mensagem = 'Filtros limpos. Mostrando todos os usuários.';
    setTimeout(() => this.mensagem = '', 3000);
  }

  visualizarUsuario(usuario: UsuarioListDTO): void {
    console.log('Visualizar:', usuario);
    this.navegarParaRota('/detalhes-usuario', usuario.matricula);
  }

  editarUsuario(usuario: UsuarioListDTO): void {
    console.log('Editando usuário:', usuario);
    this.navegarParaRota('/editar-usuario', usuario.matricula);
  }

  removerUsuario(usuario: UsuarioListDTO): void {
    if (confirm(`Tem certeza que deseja remover o usuário "${usuario.nome}" (${usuario.matricula})? Esta ação não pode ser desfeita.`)) {
      this.isLoading = true;

      this.usuarioService.deletarUsuario(usuario.matricula).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.matricula !== usuario.matricula);
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