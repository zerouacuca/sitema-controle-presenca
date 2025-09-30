import { Component } from '@angular/core';
import { ModalLogout } from '../modal-logout/modal-logout';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ModalLogout],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar { }
