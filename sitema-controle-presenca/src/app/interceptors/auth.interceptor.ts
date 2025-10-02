// interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../servicos/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // Adiciona token para TODAS as requisições (exceto login e auth)
  if (token && !isAuthRequest(req.url)) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }
  
  return next(req);
};

function isAuthRequest(url: string): boolean {
  // Não adiciona token para endpoints de autenticação
  return url.includes('/auth/') || url.includes('/login');
}