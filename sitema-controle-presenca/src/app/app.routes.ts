import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { TabelaEventos } from './pages/tabela-eventos/tabela-eventos';
import { EventoCrud } from './pages/evento-crud/evento-crud';
import { TabelaFuncionarios } from './pages/tabela-funcionarios/tabela-funcionarios';
import { UsuarioCrud } from './pages/usuario-crud/usuario-crud';
import { Navbar } from './componentes/navbar/navbar';
import { Usuarios } from './pages/usuarios/usuarios';
import { UsuarioCadastro } from './pages/usuario-cadastro/usuario-cadastro';

// Definição das rotas da aplicação
export const routes: Routes = [
  // Rotas específicas devem vir primeiro
  { path: 'login', component: LoginComponent },
  { path: 'tabela-eventos', component: TabelaEventos },
  { path: 'evento-crud', component: EventoCrud },
  { path: 'tabela-funcionarios', component: TabelaFuncionarios },
  { path: 'usuario-crud', component: UsuarioCrud },
  { path: 'navbar', component: Navbar },
  { path: 'usuarios', component: Usuarios },
  { path: 'usuario-cadastro', component: UsuarioCadastro },
  
  // Rotas de edição de usuário com parâmetro CPF
  { path: 'usuario-crud/:cpf', component: UsuarioCrud },

  // A rota de redirecionamento ou wildcard deve sempre vir por último
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
