export class Usuario {
    constructor(
        public cpf: string = "",
        public nome: string = "",
        public matricula: string = "",
        public setor: string = "",
        public template: string | Uint8Array = "",
        public dataNascimento: string = ""
    ) {}
}

export interface UsuarioListDTO {
    cpf: string;
    nome: string;
    matricula: string;
    setor: string;
    dataNascimento: string;
}
