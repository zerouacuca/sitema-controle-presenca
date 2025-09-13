import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioListDTO } from '../../models/usuario.model';
import { UsuarioService } from '../../servicos/usuario-service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabela-usuarios',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './tabela-usuarios.html',
  styleUrl: './tabela-usuarios.css'
})
export class TabelaUsuarios implements OnInit, OnDestroy {

  usuarios: UsuarioListDTO[] = [];
  isLoading: boolean = true;
  private routerSubscription!: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cd: ChangeDetectorRef // 👈 Injete o ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregarUsuarios();

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/') {
        this.carregarUsuarios();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  carregarUsuarios() {
    this.isLoading = true;
    this.usuarioService.buscarTodosUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
        this.isLoading = false;
        this.cd.detectChanges(); // Força o Angular a atualizar o template
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.isLoading = false;
        this.cd.detectChanges(); // Força a atualização mesmo em caso de erro
      }
    );
  }

  visualizarUsuario(usuario: UsuarioListDTO) {
    console.log('Visualizar:', usuario);
  }

  editarUsuario(usuario: UsuarioListDTO) {
    this.router.navigate(['/editar-usuario', usuario.cpf]);
  }

  removerUsuario(usuario: UsuarioListDTO) {
    console.log('Remover:', usuario);
  }

  cadastrarUsuario() {
    this.router.navigate(['/cadastrar-usuario']);
  }
}