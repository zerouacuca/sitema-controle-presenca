// models/login.model.ts
export class Login {
  email: string = '';
  senha: string = '';
}

export interface AuthResponse {
  token: string;
  email: string;
  type: string;
}