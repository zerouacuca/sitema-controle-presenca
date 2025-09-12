import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';

import { routes } from './app.routes';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideHttpClient } from '@angular/common/http';

registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideNgxMask(),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
