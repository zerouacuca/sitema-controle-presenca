export class Usuario {
    constructor(
        public nome: string = "",
        public matricula: string = "",
        public setor: string = "",
        public email: string = "",
        public template: string | Uint8Array = "",
        public dataNascimento: string = ""
    ) {}
}

export interface UsuarioListDTO {
    nome: string;
    matricula: string;
    setor: string;
    email: string;
    dataNascimento: string;
}