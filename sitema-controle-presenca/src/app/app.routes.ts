import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { TabelaEventos } from './pages/tabela-eventos/tabela-eventos';
import { EventoCrud } from './pages/evento-crud/evento-crud';
import { TabelaUsuarios } from './pages/tabela-usuarios/tabela-usuarios';
import { UsuarioCrud } from './pages/usuario-crud/usuario-crud';
import { Navbar } from './componentes/navbar/navbar';
import { Usuarios } from './pages/usuarios/usuarios';
import { UsuarioCadastro } from './pages/usuario-cadastro/usuario-cadastro';

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
  
  // Rotas de edição de usuário com parâmetro CPF
  { path: 'editar-usuario/:cpf', component: UsuarioCrud },

  // A rota de redirecionamento ou wildcard deve sempre vir por último
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
