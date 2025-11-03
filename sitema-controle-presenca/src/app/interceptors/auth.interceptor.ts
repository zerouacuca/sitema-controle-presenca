// interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../servicos/auth.service';
import { environment } from '../environments/environment'; // 1. Importar environment

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Funções de verificação
  const isAuthReq = isAuthRequest(req.url);
  const isBioReq = isBiometricRequest(req.url); // 2. Nova verificação

  // Adiciona token APENAS se houver token, NÃO for uma req de auth E NÃO for uma req de biometria
  if (token && !isAuthReq && !isBioReq) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  // Para todas as outras requisições (incluindo biometria e auth), passa sem o token
  return next(req);
};

function isAuthRequest(url: string): boolean {
  // Não adiciona token para endpoints de autenticação
  return url.includes('/auth/') || url.includes('/login');
}

// 3. Nova função para verificar se é a API de biometria (usando a URL do proxy)
function isBiometricRequest(url: string): boolean {
  // environment.biometricApiUrl será '/api-bio'
  return url.startsWith(environment.biometricApiUrl);
}

