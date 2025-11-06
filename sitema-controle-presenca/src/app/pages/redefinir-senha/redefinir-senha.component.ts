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
    private recuperacaoSenhaService: RecuperacaoSenhaService
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

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.error = '';

      const request = {
        token: this.token,
        novaSenha: this.form.value.novaSenha,
        confirmacaoSenha: this.form.value.confirmacaoSenha
      };

      this.recuperacaoSenhaService.redefinirSenha(request).subscribe({
        next: () => {
            alert('Senha redefinida com sucesso! Você será redirecionado para o login.');
          this.router.navigate(['/login'], { 
            queryParams: { passwordReset: 'success' }
          });
        },
        error: (error) => {
          this.error = 'Erro ao redefinir senha. Verifique se o link ainda é válido.';
          this.loading = false;
        }
      });
    }
  }
}