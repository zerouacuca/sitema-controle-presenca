import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicos/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], // ← ADICIONADO RouterModule
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
    this.router.navigate(['/login']);
  }

  isActiveRoute(route: string): boolean {
    // Remove o prefixo /app/ para comparação, se existir
    const currentRoute = this.router.url.replace('/app', '');
    const compareRoute = route.replace('/app', '');
    
    return currentRoute === compareRoute || currentRoute.startsWith(compareRoute + '/');
  }
}