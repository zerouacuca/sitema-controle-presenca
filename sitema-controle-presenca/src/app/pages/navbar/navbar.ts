import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalLogout } from '../modal-logout/modal-logout';
import { AuthService } from '../../servicos/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ModalLogout],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  currentUser: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(email => {
      this.currentUser = email;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }
}