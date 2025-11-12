// footer.component.ts - Versão com footer fixo
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer fixed-footer">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <p class="mb-1">
              <strong>&copy; {{ currentYear }} UFPR</strong> - Universidade Federal do Paraná
            </p>
            <p class="mb-0 text-muted">
              Desenvolvido por Lucas, Aruni e Giovani
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .fixed-footer {
      background: linear-gradient(135deg, #2c3e50, #34495e);
      color: white;
      padding: 1.5rem 0;
      margin-top: 3rem;
      border-top: 3px solid #0d6efd;
    }

    .fixed-footer p {
      margin: 0;
    }

    .fixed-footer .text-muted {
      color: #bdc3c7 !important;
    }

    /* Garante que o footer fique no bottom */
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class Footer {
  currentYear: number = new Date().getFullYear();
}