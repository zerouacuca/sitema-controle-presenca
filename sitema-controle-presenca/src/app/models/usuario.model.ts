export class Usuario {
    constructor(
        public cpf: string = "",
        public nome: string = "",
        public matricula: string = "",
        public setor: string = "",
        public tipo: string = "",
        public template: string | Uint8Array = "",
        public dataNascimento: string = ""
    ) {}
}