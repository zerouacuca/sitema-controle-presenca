import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabela-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela-usuarios.html',
  styleUrl: './tabela-usuarios.css'
})
export class TabelaUsuarios {
visualizarUsuario(_t16: { matricula: string; setor: string; nome: string; tipo: string; }) {
throw new Error('Method not implemented.');
}

    usuarios = [
    { matricula: '00007', setor: 'Almoxarifado', nome: 'João Souza dos Santos', tipo: 'padrão' },
    { matricula: '00006', setor: 'EHS', nome: 'Aruni Serena Van Amstel', tipo: 'EHS' },
    { matricula: '00005', setor: 'Financeiro', nome: 'Pedro Albuquerque de Oliveira', tipo: 'padrão' },

  ];

 editarUsuario(usuario: any) {
    console.log('Editar:', usuario);
  }

  removerUsuario(usuario: any) {
    console.log('Remover:', usuario);
  }

  cadastrarUsuario() {
    console.log('Cadastrar novo usuário');
  }

}
