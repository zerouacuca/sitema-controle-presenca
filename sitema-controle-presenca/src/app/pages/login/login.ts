import { Component } from '@angular/core'; //Define a clase como componente Angular.
import { CommonModule } from '@angular/common'; // Importa diretivas e pipes como *ngIf, *ngFor.
import { FormsModule } from '@angular/forms'; // Habilita o uso de formulários baseados em template, incluindo [(ngModel)] para two-way binding
import { Login } from '../../models/login.model'; //Importa a interface Login

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class LoginComponent {

  login: Login = new Login();

  onSubmit() {
    console.log('Dados do login:', this.login);
  }
}
