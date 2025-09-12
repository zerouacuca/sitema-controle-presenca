import { Component } from '@angular/core';
import { Navbar } from "../../componentes/navbar/navbar";
import { UsuarioCrud } from "../usuario-crud/usuario-crud";

@Component({
  selector: 'app-usuario-cadastro',
  imports: [Navbar, UsuarioCrud],
  templateUrl: './usuario-cadastro.html',
  styleUrl: './usuario-cadastro.css'
})
export class UsuarioCadastro {

}
