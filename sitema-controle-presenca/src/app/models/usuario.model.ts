export class Usuario {
    constructor(
        public cpf: string = "",
        public nome: string = "",
        public matricula: string = "",
        public setor: string = "",
        public tipo: string = "",
        public biometriaHash: string | Uint8Array = "",
        public dataNascimento: string = ""
    ) {}
}