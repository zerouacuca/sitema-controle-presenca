import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-funcionario-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funcionario-crud.html',
  styleUrl: './funcionario-crud.css'
})
export class FuncionarioCrud {

  funcionario = {
    cpf: '12136717952',
    matricula: '00007',
    nome: 'João Souza dos Santos',
    setor: 'Almoxarifado',
    tipo: 'padrão',
    dataNascimento: '2001-01-29',
    biometriaHash: "bdfa0acc400939819b9afc23bf462d66e57b0500"
  };

  editarFuncionario() {
    console.log('Editar:', this.funcionario);
  }

  remover() {
    console.log('Remover:', this.funcionario);
  }

  cadastrarFuncionario() {
    console.log('Cadastrar novo funcionário');
  }

  obterBiometria() {
    console.log('Obtendo Biometria');

    this.funcionario.biometriaHash = Math.random().toString(36).substring(2, 15) +
                                    Math.random().toString(36).substring(2, 15);
  }
}
