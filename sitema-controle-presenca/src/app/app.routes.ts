import { Routes } from '@angular/router';
import {LoginComponent } from './pages/login/login';
import { TabelaEventos } from './pages/tabela-eventos/tabela-eventos';
import { EventoCrud } from './pages/evento-crud/evento-crud';
import { TabelaFuncionarios } from './pages/tabela-funcionarios/tabela-funcionarios';
import { FuncionarioCrud } from './pages/funcionario-crud/funcionario-crud';
import { Navbar } from './navbar/navbar';

//Definição das rotas da aplicação
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tabela-eventos', component: TabelaEventos},
  { path: 'evento-crud', component: EventoCrud},
  { path: 'tabela-funcionarios', component: TabelaFuncionarios},
  { path: 'funcionario-crud', component: FuncionarioCrud},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'navbar', component: Navbar}
];
