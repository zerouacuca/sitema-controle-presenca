import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [Navbar, RouterOutlet],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>`
})

export class PaginaPrincipal {}
