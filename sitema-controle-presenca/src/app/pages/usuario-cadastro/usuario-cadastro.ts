import { Component } from '@angular/core';
import { Navbar } from "../../componentes/navbar/navbar";
import { FuncionarioCrud } from "../funcionario-crud/funcionario-crud";

@Component({
  selector: 'app-usuario-cadastro',
  imports: [Navbar, FuncionarioCrud],
  templateUrl: './usuario-cadastro.html',
  styleUrl: './usuario-cadastro.css'
})
export class UsuarioCadastro {

}
