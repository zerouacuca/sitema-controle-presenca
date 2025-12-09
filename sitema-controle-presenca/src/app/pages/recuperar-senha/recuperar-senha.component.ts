import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecuperacaoSenhaService } from '../../servicos/recuperacao-senha.service';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [ 
    CommonModule,
    ReactiveFormsModule
  ],
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
    
    console.log('Formulário válido, enviando dados:', this.form.value);
    
    this.recuperacaoSenhaService.solicitarRecuperacao(this.form.value).subscribe({
      next: (response) => {
        console.log('Resposta do servidor (sucesso):', response);
        // Se chegou aqui, é sucesso!
        this.success = true;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro completo:', error);
        
        // Se o status for 200 mas caiu no error, pode ser problema de parsing
        if (error.status === 200) {
          console.log('Status 200 caiu no error - provavel problema de parsing');
          this.success = true;
          this.loading = false;
          return;
        }
        
        let errorMessage = 'Ocorreu um erro ao processar sua solicitação';
        
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