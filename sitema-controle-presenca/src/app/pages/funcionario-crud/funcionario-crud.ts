import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { CpfValidatorService } from '../../servicos/cpf-validator';


@Component({
  selector: 'app-funcionario-crud',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective  // <- habilita o uso da máscara no template
  ],
  templateUrl: './funcionario-crud.html',
  styleUrls: ['./funcionario-crud.css']  // <- corrigido (era styleUrl)
})
export class FuncionarioCrud {
  constructor(private cpfValidator: CpfValidatorService) {}

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

  obterBiometria() {
    console.log('Obtendo Biometria');

    this.funcionario.biometriaHash =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }

  cadastrarFuncionario() {
    if (!this.cpfValidator.validarCPF(this.funcionario.cpf)) {
      console.error('CPF inválido:', this.funcionario.cpf);
      return;
    }
    console.log('Cadastrando funcionário:', this.funcionario);
    // lógica de cadastro real aqui...
  }
}
