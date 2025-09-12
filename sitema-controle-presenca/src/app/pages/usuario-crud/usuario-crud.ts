import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { ActivatedRoute, Router } from '@angular/router';

import { CpfValidatorService } from '../../servicos/cpf-validator';
import { UsuarioService } from '../../servicos/usuario-service';

@Component({
  selector: 'app-usuario-crud',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective 
  ],
  templateUrl: './usuario-crud.html',
  styleUrls: ['./usuario-crud.css']
})
export class UsuarioCrud implements OnInit {
  // Modelo de dados do usuário, inicializado com valores vazios
  usuario = {
    cpf: '',
    matricula: '',
    nome: '',
    setor: '',
    tipo: 'padrão',
    dataNascimento: '',
    biometriaHash: ''
  };

  isEditMode: boolean = false;
  
  constructor(
    private cpfValidator: CpfValidatorService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // Este método é chamado automaticamente pelo Angular quando o componente é inicializado.
  ngOnInit(): void {
    const cpf = this.route.snapshot.paramMap.get('cpf');

    if (cpf) {
      this.isEditMode = true;
      this.usuarioService.buscarPorCpf(cpf).subscribe({
        next: (data) => {
          this.usuario = data;
          console.log('Dados do usuário carregados para edição:', this.usuario);
        },
        error: (err) => {
          console.error('Erro ao buscar usuário:', err);
          alert('Usuário não encontrado!');
          this.router.navigate(['/']);
        }
      });
    }
  }

  // Método unificado para cadastrar ou editar um usuário
  salvarFuncionario() {
    if (!this.cpfValidator.validarCPF(this.usuario.cpf)) {
      console.error('CPF inválido:', this.usuario.cpf);
      alert('Por favor, insira um CPF válido.');
      return;
    }

    if (this.isEditMode) {
      // Chama o método de atualização se estiver em modo de edição
      this.usuarioService.atualizarUsuario(this.usuario.cpf, this.usuario).subscribe({
        next: (response) => {
          console.log('Usuário atualizado com sucesso!', response);
          alert('Usuário atualizado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao atualizar usuário:', err);
          alert('Erro ao atualizar usuário.');
        }
      });
    } else {
      // Chama o método de cadastro se for um novo usuário
      this.usuarioService.cadastrarUsuario(this.usuario).subscribe({
        next: (response) => {
          console.log('Usuário cadastrado com sucesso!', response);
          alert('Usuário cadastrado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao cadastrar usuário:', err);
          alert('Erro ao cadastrar usuário.');
        }
      });
    }
  }

  // Método para remover um usuário
  remover() {
    if (this.usuario.cpf) {
      this.usuarioService.deletarUsuario(this.usuario.cpf).subscribe({
        next: () => {
          console.log('Usuário removido com sucesso!');
          alert('Usuário removido com sucesso!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erro ao remover usuário:', err);
          alert('Erro ao remover usuário.');
        }
      });
    }
  }

  // Método para simular a obtenção de biometria e validar
  obterBiometria() {
    const biometriaMock = 'hash-biometrico-do-leitor'; 

    this.usuarioService.validarBiometria(biometriaMock).subscribe({
        next: (usuario) => {
            console.log('Biometria validada com sucesso para:', usuario.nome);
            alert(`Bem-vindo, ${usuario.nome}!`);
        },
        error: (err) => {
            console.error('Erro ao validar biometria:', err);
            alert('Biometria não reconhecida.');
        }
    });
  }
}
