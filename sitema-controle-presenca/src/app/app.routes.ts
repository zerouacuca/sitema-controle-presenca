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

export const routes: Routes = [
  // Rota pública de login
  { path: 'login', component: LoginComponent },
  
  // Rotas protegidas com layout principal
  {
    path: '',
    component: PaginaPrincipal,
    canActivate: [AuthGuard],
    children: [
      // Rotas de Eventos
      { path: 'eventos', component: TabelaEventos },
      { path: 'cadastrar-evento', component: EventoCrud },
      { path: 'editar-evento/:id', component: EventoCrud },
      { path: 'detalhes-evento/:id', component: DetalhesEventoComponent },
      
      // Rotas de Usuários
      { path: 'tabela-usuarios', component: TabelaUsuarios },
      { path: 'cadastrar-usuario', component: UsuarioCrud },
      { path: 'editar-usuario/:cpf', component: UsuarioCrud },
      
      // Outras rotas
      { path: 'certificados', component: CertificadosComponent },
      
      // Rota padrão - redireciona para eventos
      { path: '', redirectTo: 'eventos', pathMatch: 'full' },
      
      // Redirecionamentos alternativos para garantir que sempre caia em eventos
      { path: 'home', redirectTo: 'eventos', pathMatch: 'full' },
      { path: 'dashboard', redirectTo: 'eventos', pathMatch: 'full' }
    ]
  },

  // Wildcard - redireciona para login
  { path: '**', redirectTo: 'login' }
];