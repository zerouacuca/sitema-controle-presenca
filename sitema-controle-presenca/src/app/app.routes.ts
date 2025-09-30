import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { TabelaEventos } from './pages/tabela-eventos/tabela-eventos';
import { EventoCrud } from './pages/evento-crud/evento-crud';
import { TabelaUsuarios } from './pages/tabela-usuarios/tabela-usuarios';
import { UsuarioCrud } from './pages/usuario-crud/usuario-crud';
import { CertificadosComponent } from './pages/certificados/certificados.component';
import { DetalhesEventoComponent } from './pages/detalhes-evento/detalhes-evento.component';
import { PaginaPrincipal } from './pages/pagina-principal/pagina-principal';
import { Navbar } from './pages/navbar/navbar';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  {
    path: '',
    component: PaginaPrincipal,
    canActivate: [AuthGuard],
    children: [
      { path: 'navbar', component: Navbar },
      { path: 'eventos', component: TabelaEventos },
      { path: 'cadastrar-evento', component: EventoCrud },
      { path: 'editar-evento/:id', component: EventoCrud },
      { path: 'detalhes-evento/:id', component: DetalhesEventoComponent },
      { path: 'tabela-usuarios', component: TabelaUsuarios },
      { path: 'cadastrar-usuario', component: UsuarioCrud },
      { path: 'editar-usuario/:cpf', component: UsuarioCrud },
      { path: 'certificados', component: CertificadosComponent },
      { path: '', redirectTo: 'eventos', pathMatch: 'full' }
    ]
  },

  // Wildcard - redireciona para login
  { path: '**', redirectTo: '/login' },
];