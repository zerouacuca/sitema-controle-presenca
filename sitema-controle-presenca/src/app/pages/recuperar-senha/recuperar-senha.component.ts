import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecuperacaoSenhaService } from '../../servicos/recuperacao-senha.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.css']
})
export class RecuperarSenhaComponent {
  form: FormGroup;
  loading = false;
  success = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private recuperacaoSenhaService: RecuperacaoSenhaService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.error = '';
      
      this.recuperacaoSenhaService.solicitarRecuperacao(this.form.value).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Ocorreu um erro ao processar sua solicitação';
          this.loading = false;
        }
      });
    }
  }
}