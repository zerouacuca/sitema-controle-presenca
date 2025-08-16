import { Component } from '@angular/core';
import { ModalLogout } from '../modal-logout/modal-logout';

@Component({
  selector: 'app-navbar',
  imports: [ModalLogout],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  
}
