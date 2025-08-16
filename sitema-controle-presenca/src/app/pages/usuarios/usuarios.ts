import { Component } from '@angular/core';
import { TabelaFuncionarios } from '../tabela-funcionarios/tabela-funcionarios';
import { Navbar } from '../../componentes/navbar/navbar';

@Component({
  selector: 'app-usuarios',
  imports: [
    TabelaFuncionarios,
    Navbar
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios {

}
