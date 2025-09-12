import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-evento-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evento-crud.html',
  styleUrl: './evento-crud.css'
})
export class EventoCrud {

  evento = {
    id: '1',
    nome: 'Teste 1',
    data: '29/08/2025',
    descricao: 'Teste de evento',
    categoria: 'Reunião',
    status: 'finalizado',
  };

  cadastrarOuEditar() {
    console.log('Cadastrando/Atualizando evento:', this.evento);
  }

  removerEvento() {
    console.log('Removendo evento:', this.evento.id);
  }

  finalizarEvento() {
    console.log('Finalizando evento:', this.evento.id);
  }

  iniciarEvento() {
    console.log('Iniciando evento:', this.evento.id);
  }

  gerarRelatorio() {
    console.log('Gerando relatório...');
  }

  gerarCertificados() {
    console.log('Gerando certificados...');
  }
}


