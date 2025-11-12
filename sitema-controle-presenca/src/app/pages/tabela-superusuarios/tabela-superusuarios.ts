import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Superusuario, SuperusuarioService } from '../../servicos/superusuario.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabela-superusuarios',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './tabela-superusuarios.html',
  styleUrls: ['./tabela-superusuarios.css']
})
export class TabelaSuperusuariosComponent implements OnInit, OnDestroy {

  superusuarios: Superusuario[] = [];
  superusuariosFiltrados: Superusuario[] = [];
  isLoading: boolean = true;

  nomePesquisa: string = '';
  matriculaPesquisa: string = '';
  emailPesquisa: string = '';

  mensagem: string = '';
  erro: string = '';
  filtroAtivo: boolean = false;

  private routerSubscription!: Subscription;

  constructor(
    private superusuarioService: SuperusuarioService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregarSuperusuarios();

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/superusuarios' || event.url === '/') {
        this.carregarSuperusuarios();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  carregarSuperusuarios(): void {
    this.isLoading = true;
    this.superusuarioService.listarSuperusuarios().subscribe({
      next: (data: any) => { // <-- TIPO ADICIONADO
        this.superusuarios = data;
        this.aplicarFiltros();
        this.isLoading = false;
        this.filtroAtivo = false;
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error('Erro ao carregar superusuários:', error);
        this.erro = 'Erro ao carregar superusuários. Tente novamente.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    let filtrados = [...this.superusuarios];

    if (this.nomePesquisa.trim()) {
      const termo = this.nomePesquisa.toLowerCase().trim();
      filtrados = filtrados.filter(usuario =>
        usuario.nome.toLowerCase().includes(termo)
      );
    }

    if (this.matriculaPesquisa.trim()) {
      const termo = this.matriculaPesquisa.trim();
      filtrados = filtrados.filter(usuario =>
        usuario.matricula.includes(termo)
      );
    }

    if (this.emailPesquisa.trim()) {
       const termo = this.emailPesquisa.toLowerCase().trim();
       filtrados = filtrados.filter(usuario =>
         usuario.email.toLowerCase().includes(termo)
       );
     }

    this.superusuariosFiltrados = filtrados;
    this.filtroAtivo = !!(this.nomePesquisa.trim() || this.matriculaPesquisa.trim() ||
                          this.emailPesquisa.trim());
  }


  limparFiltros(): void {
    this.nomePesquisa = '';
    this.matriculaPesquisa = '';
    this.emailPesquisa = '';
    this.superusuariosFiltrados = [...this.superusuarios];
    this.filtroAtivo = false;
    this.mensagem = 'Filtros limpos. Mostrando todos os superusuários.';
    setTimeout(() => this.mensagem = '', 3000);
  }

  editarSuperusuario(superusuario: Superusuario): void {
    this.router.navigate(['/editar-superusuario', superusuario.matricula]);
  }

  removerSuperusuario(superusuario: Superusuario): void {
    if (confirm(`Tem certeza que deseja remover o superusuário "${superusuario.nome}" (${superusuario.matricula})?`)) {
      this.isLoading = true;

      this.superusuarioService.excluirSuperusuario(superusuario.matricula).subscribe({
        next: () => {
          this.superusuarios = this.superusuarios.filter(u => u.matricula !== superusuario.matricula);
          this.aplicarFiltros();
          this.mensagem = `Superusuário "${superusuario.nome}" removido com sucesso.`;
          this.isLoading = false;
          this.cd.detectChanges();
          setTimeout(() => this.mensagem = '', 5000);
        },
        error: (error: any) => {
          console.error('Erro ao remover superusuário:', error);
          this.erro = 'Erro ao remover superusuário. Verifique se ele não está logado ou associado a eventos.';
          this.isLoading = false;
          this.cd.detectChanges();
          setTimeout(() => this.erro = '', 7000);
        }
      });
    }
  }

  cadastrarSuperusuario(): void {
    this.router.navigate(['/cadastrar-superusuario']);
  }
}