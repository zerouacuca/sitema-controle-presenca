import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { TabelaEventos } from './pages/tabela-eventos/tabela-eventos';
import { EventoCrud } from './pages/evento-crud/evento-crud';
import { TabelaUsuarios } from './pages/tabela-usuarios/tabela-usuarios';
import { UsuarioCrud } from './pages/usuario-crud/usuario-crud';
import { CertificadosComponent } from './pages/certificados/certificados.component';
import { DetalhesEventoComponent } from './pages/detalhes-evento/detalhes-evento.component';
import { PaginaPrincipal } from './pages/pagina-principal/pagina-principal';
import { AuthGuard } from './guards/auth.guard';
import { NovoSuperusuarioComponent } from './pages/novo-superusuario/novo-superusuario.component';

export const routes: Routes = [
  // Rotas públicas - SEM AuthGuard
  { path: 'login', component: LoginComponent },
  
  // Rotas protegidas - COM AuthGuard
  { 
    path: 'eventos', 
    component: PaginaPrincipal,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TabelaEventos }
    ]
  },
  { 
    path: 'cadastrar-evento', 
    component: PaginaPrincipal,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: EventoCrud }
    ]
  },
  { 
    path: 'editar-evento/:id', 
    component: PaginaPrincipal,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: EventoCrud }
    ]
  },
  { 
    path: 'detalhes-evento/:id', 
    component: PaginaPrincipal,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DetalhesEventoComponent }
    ]
  },
  { 
    path: 'tabela-usuarios', 
    component: PaginaPrincipal,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TabelaUsuarios }
    ]
  },
  { 
    path: 'cadastrar-usuario', 
    component: PaginaPrincipal,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: UsuarioCrud }
    ]
  },
  { 
    path: 'editar-usuario/:cpf', 
    component: PaginaPrincipal,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: UsuarioCrud }
    ]
  },
  { 
    path: 'certificados', 
    component: PaginaPrincipal,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: CertificadosComponent }
    ]
  },
  { 
    path: 'novo-superusuario', 
    component: PaginaPrincipal,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: NovoSuperusuarioComponent }
    ]
  },
  
  // Redirecionamentos
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', redirectTo: 'eventos', pathMatch: 'full' },
  { path: 'dashboard', redirectTo: 'eventos', pathMatch: 'full' },
  
  // Wildcard
  { path: '**', redirectTo: 'login' }
];