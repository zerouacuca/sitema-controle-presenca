import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabela-funcionarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela-funcionarios.html',
  styleUrl: './tabela-funcionarios.css'
})
export class TabelaFuncionarios {

    funcionarios = [
    { matricula: '00007', setor: 'Almoxarifado', nome: 'João Souza dos Santos', tipo: 'padrão' },
    { matricula: '00006', setor: 'EHS', nome: 'Aruni Serena Van Amstel', tipo: 'EHS' },
    { matricula: '00005', setor: 'Financeiro', nome: 'Pedro Albuquerque de Oliveira', tipo: 'padrão' },

  ];

 editarFuncionario(funcionario: any) {
    console.log('Editar:', funcionario);
  }

  removerFuncionario(funcionario: any) {
    console.log('Remover:', funcionario);
  }

  cadastrarFuncionario() {
    console.log('Cadastrar novo funcionário');
  }

}
