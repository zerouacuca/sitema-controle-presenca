import { Component } from '@angular/core';
import { TabelaUsuarios } from '../tabela-usuarios/tabela-usuarios';
import { Navbar } from '../../componentes/navbar/navbar';

@Component({
  selector: 'app-usuarios',
  imports: [
    TabelaUsuarios,
    Navbar
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios {

}
