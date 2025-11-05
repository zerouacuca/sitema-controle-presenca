import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecuperacaoSenhaService } from '../../servicos/recuperacao-senha.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [ // ← Adicione estas importações
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recuperacaoSenhaService: RecuperacaoSenhaService,
    private success: boolean = false,
    private mensagem: string = ''
  ) {
    this.form = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmacaoSenha: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.router.navigate(['/login']);
    }
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('novaSenha')?.value;
    const confirmPass = group.get('confirmacaoSenha')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  // redefinir-senha.component.ts
onSubmit() {
  if (this.form.valid) {
    this.loading = true;
    this.error = '';
    
    const data = {
      token: this.token,
      novaSenha: this.form.value.novaSenha,
      confirmacaoSenha: this.form.value.confirmacaoSenha
    };

    console.log('Enviando dados:', data);
    
    this.recuperacaoSenhaService.redefinirSenha(data).subscribe({
      next: (response) => {
        console.log('Resposta do servidor (sucesso):', response);
        this.success = true;
        this.loading = false;
        this.mensagem = 'Senha redefinida com sucesso!';
      },
      error: (error) => {
        console.error('Erro completo:', error);
        
        // ADICIONE APENAS ESTA VERIFICAÇÃO:
        if (error.status === 200) {
          // Se o backend retornou 200 mas o Angular interpretou como erro
          // (problema comum com resposta String)
          console.log('Status 200 interpretado como erro - provavel problema de parsing');
          this.success = true;
          this.loading = false;
          this.mensagem = 'Senha redefinida com sucesso!';
          return;
        }
        
        // Mantenha o tratamento de erro original para outros casos
        let errorMessage = 'Ocorreu um erro ao redefinir a senha';
        
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        this.error = errorMessage;
        this.loading = false;
      }
    });
  }
}
}