import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { TabelaEventos } from './pages/tabela-eventos/tabela-eventos';
import { EventoCrud } from './pages/evento-crud/evento-crud';
import { TabelaUsuarios } from './pages/tabela-usuarios/tabela-usuarios';
import { UsuarioCrud } from './pages/usuario-crud/usuario-crud';
import { Navbar } from './componentes/navbar/navbar';
import { Usuarios } from './pages/usuarios/usuarios';
import { UsuarioCadastro } from './pages/usuario-cadastro/usuario-cadastro';
import { CertificadosComponent } from './pages/certificados/certificados.component';
import { DetalhesEventoComponent } from './pages/detalhes-evento/detalhes-evento.component';

// Definição das rotas da aplicação
export const routes: Routes = [
  // Rotas específicas devem vir primeiro
  { path: 'login', component: LoginComponent },
  { path: 'eventos', component: TabelaEventos },
  { path: 'cadastrar-evento', component: EventoCrud },
  { path: 'tabela-usuarios', component: TabelaUsuarios },
  { path: 'editar-usuario', component: UsuarioCrud },
  { path: 'navbar', component: Navbar },
  { path: 'usuarios', component: Usuarios },
  { path: 'cadastrar-usuario', component: UsuarioCadastro },
  { path: 'certificados', component: CertificadosComponent },
  
  // Rotas de edição de usuário com parâmetro CPF
  { path: 'editar-usuario/:cpf', component: UsuarioCrud },
  // Rotas de edição de evento com parâmetro ID
  { path: 'editar-evento/:id', component: EventoCrud },
  { path: 'detalhes-evento/:id', component: DetalhesEventoComponent },

  // A rota de redirecionamento ou wildcard deve sempre vir por último
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
