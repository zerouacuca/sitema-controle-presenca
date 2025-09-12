export class Evento {
  constructor(
    public id: number,
    public descricao: string = "",
    public data: Date = new Date(),
    public status: string = ""
  ) {

  }
}
